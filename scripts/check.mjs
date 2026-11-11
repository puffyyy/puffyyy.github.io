import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('dist/index.html', root),'utf8');
const papers = JSON.parse(readFileSync(new URL('publications.json',root),'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
assert(papers.length > 0, 'Publication data must not be empty');
assert.equal([...html.matchAll(/<article class="publication"/g)].length, papers.length);
for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const value=match[1];
  if(value.startsWith('#')) assert(ids.includes(value.slice(1)),`Missing anchor ${value}`);
  else if(!/^(https?:|mailto:)/.test(value)) assert(existsSync(new URL(`dist/${value}`,root)),`Missing asset ${value}`);
}
const citations=JSON.parse(readFileSync(new URL('dist/citations.json',root),'utf8'));
for(const p of papers) {
  assert(p.authors.includes('Donglin Yang'),`Missing author in ${p.id}`);
  assert(citations[p.id].bib.includes(`year = {${p.year}}`));
  assert(citations[p.id].bib.includes(`title = {{${p.title}}}`));
  assert.equal(readFileSync(new URL(`dist/citations/${p.id}.bib`,root),'utf8').trim(),citations[p.id].bib);
  for(const field of ['paper','project','code']) if(p[field]) assert.equal(new URL(p[field]).protocol,'https:');
}
assert(!/TODO|lorem ipsum|placeholder|codex-preview/i.test(html),'No unfinished page content');

// Verify local previews never load analytics, and mobile visits are still counted.
const mapScript = readFileSync(new URL('dist/visitor-map.js', root), 'utf8');
const widgetUrl = 'https://mapmyvisitors.com/globe.js?d=test&w=280';
function loadMap(origin, {url = widgetUrl, hasContainer = true, width = 1280} = {}) {
  const scripts = [];
  const container = {
    hidden: true,
    dataset: {siteOrigin: 'https://puffyyy.github.io', widgetUrl: url},
    querySelector: () => ({append: script => scripts.push(script)}),
  };
  runInNewContext(mapScript, {
    location: {origin},
    innerWidth: width,
    document: {
      getElementById: () => hasContainer ? container : null,
      createElement: tag => ({tag, addEventListener(type, callback) { this[type] = callback; }}),
    },
  });
  return {container, scripts};
}
for (const origin of ['http://localhost:4173', 'http://127.0.0.1:4173', 'null', 'http://puffyyy.github.io', 'https://preview.example', 'https://puffyyy.github.io.example']) {
  assert.equal(loadMap(origin).scripts.length, 0, `Visitor counter must not load on ${origin}`);
}
assert.equal(loadMap('https://puffyyy.github.io', {url: ''}).scripts.length, 0);
assert.equal(loadMap('https://puffyyy.github.io', {hasContainer: false}).scripts.length, 0);
for (const width of [390, 1280]) {
  const liveMap = loadMap('https://puffyyy.github.io', {width});
  assert.equal(liveMap.scripts.length, 1);
  assert.equal(liveMap.scripts[0].tag, 'script');
  assert.equal(liveMap.scripts[0].id, 'mmvst_globe');
  assert.equal(liveMap.scripts[0].src, widgetUrl);
  assert.equal(liveMap.scripts[0].async, true);
  assert.equal(liveMap.container.hidden, false);
  liveMap.scripts[0].error();
  assert.equal(liveMap.container.hidden, true);
}

console.log(`Verified ${papers.length} publications, citation downloads, local assets, unique IDs, and navigation anchors.`);
console.log('Verified visitor globe domain restrictions, mobile/desktop loading, and error handling.');
