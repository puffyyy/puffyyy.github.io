import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const papers = JSON.parse(readFileSync(new URL('./publications.json', import.meta.url), 'utf8'));
const root = new URL('./dist/', import.meta.url);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const paths = {
  arrow: '<path d="M5 11 11 5M5 5h6v6"/>',
  mail: '<rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 4.5 5.5 4 5.5-4"/>',
  code: '<path d="m5 4-4 4 4 4m6-8 4 4-4 4M9 2 7 14"/>',
  paper: '<path d="M9 1.5H3v13h10v-9L9 1.5Zm0 0v4h4M5.5 8h5m-5 3h5"/>',
  quote: '<path d="M2 4h4v5H2V4Zm0 5c0 2 1 3 3 3m4-8h4v5H9V4Zm0 5c0 2 1 3 3 3"/>',
  pin: '<path d="M12.5 6.5c0 3.5-4.5 8-4.5 8s-4.5-4.5-4.5-8a4.5 4.5 0 0 1 9 0Z"/><circle cx="8" cy="6.5" r="1.5"/>',
};
// Brand icons: Simple Icons (CC0), rendered in the profile text color.
const brandPaths = {
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  wechat: 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z',
};
const icon = name => brandPaths[name] ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${brandPaths[name]}"/></svg>` : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const ext = (url, text, name) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${icon(name)}${text}</a>`;
const topics = {robotics:'Robot learning & world models',uav:'Language-guided UAVs',simulation:'Simulation & 3D perception'};
function bibAuthor(author) {
  const names = author.split(' ');
  return `${names.pop()}, ${names.join(' ')}`;
}

const citations = {};
mkdirSync(new URL('citations/', root), {recursive: true});
for (const paper of papers) {
  const key = `${paper.authors[0].split(' ').at(-1).toLowerCase()}${paper.year}${paper.id}`;
  const isPreprint = paper.type === 'preprint';
  const fields = [
    `  title = {{${paper.title}}}`,
    `  author = {${paper.authors.map(bibAuthor).join(' and ')}}`,
    isPreprint ? `  journal = {arXiv preprint arXiv:${paper.arxiv}}` : `  booktitle = {${paper.booktitle}}`,
    `  year = {${paper.year}}`,
    `  url = {${paper.paper}}`,
  ];
  const bib = `@${isPreprint ? 'article' : 'inproceedings'}{${key},\n${fields.join(',\n')}\n}`;
  citations[paper.id] = {title: paper.title, bib};
  writeFileSync(new URL(`citations/${paper.id}.bib`, root), bib + '\n');
}
writeFileSync(new URL('citations.json', root), JSON.stringify(citations, null, 2) + '\n');

const publicationRows = papers.map(p=>`<article class="publication" data-category="${p.category}" id="${p.id}">
  <a class="paper-visual" href="${escape(p.project||p.paper)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.title)} — ${p.project?'project':'paper'}"><img src="assets/${escape(p.image.src)}" alt="${escape(p.image.alt)}" width="470" height="285" loading="lazy" decoding="async"></a>
  <div class="paper-details"><h3><a href="${escape(p.paper)}" target="_blank" rel="noopener noreferrer">${escape(p.title)}</a></h3>
  <p class="authors">${p.authors.map(a=>`${a==='Donglin Yang'?`<strong>${a}</strong>`:escape(a)}${p.equalContribution.includes(a)?'<sup>*</sup>':''}`).join(', ')}</p>
  <p class="paper-meta"><span class="venue">${escape(p.venue)}</span><span class="paper-field">${escape(p.track || topics[p.category])}</span></p>
  <p class="paper-summary">${escape(p.summary)}</p>
  <div class="paper-links">${ext(p.paper,'Paper','paper')}${p.project?ext(p.project,'Project','arrow'):''}${p.code?ext(p.code,'Code','code'):''}${p.dataset?ext(p.dataset,'Dataset','arrow'):''}${p.video?ext(p.video,'Video','arrow'):''}<a class="cite-link" href="citations/${p.id}.bib" data-cite="${p.id}" download>${icon('quote')}BibTeX</a></div></div>
</article>`).join('\n');

const news = [
  ["2026-08", "<a href=\"#panovla\">PanoVLA</a> preprint was released on arXiv, exploring panorama-aware mobile manipulation with whole-body teleoperation."],
  ["2026-01", "Received the <b>Second Place Award (2/62)</b> in the <a href=\"#awards\">RoCo Challenge @ AAAI 2026</a>."],
  ["2026-01", "<a href=\"#genie\">Genie Envisioner</a> was accepted to <b>ICLR 2026</b>."],
  ["2025-09", "<a href=\"#uavflow\">UAV-Flow Colosseo</a> was accepted to <b>NeurIPS 2025</b> (Datasets and Benchmarks Track)."],
  ["2025-01", "<a href=\"#traveluav\">OpenUAV / TravelUAV</a> was accepted to <b>ICLR 2025</b>."],
  ["2024-06", "<a href=\"#rain\">Realistic Rainy Weather Simulation for LiDARs in CARLA Simulator</a> was accepted to <b>IROS 2024</b>."],
  ["2024-01", "<a href=\"#resimad\">ReSimAD</a> was accepted to <b>ICLR 2024</b>."],
];
const newsRows = news.map(([date, body]) => `<li class="news-item"><time class="news-date" datetime="${date}">${date.replace('-', '.')}:</time><span aria-hidden="true">🎉🎉</span> <p>${body}</p></li>`).join('\n');
const heading = (id, emoji, title) => `<div class="section-heading"><h2 id="${id}-title"><span aria-hidden="true">${emoji}</span> ${title}</h2></div>`;

const visitorMap = JSON.parse(readFileSync(new URL('./visitor-map.json', import.meta.url), 'utf8'));
const siteUrl = new URL(visitorMap.siteUrl);
if (siteUrl.protocol !== 'https:') throw new Error('The visitor map requires an HTTPS site URL.');
if (visitorMap.scriptUrl) {
  const widgetUrl = new URL(visitorMap.scriptUrl);
  if (widgetUrl.origin !== 'https://mapmyvisitors.com' || widgetUrl.pathname !== '/globe.js' || !widgetUrl.searchParams.get('d')) {
    throw new Error('Use the HTTPS globe.js URL from your MapMyVisitors embed code.');
  }
}
const visitorSection = visitorMap.scriptUrl ? `<section id="visitors" class="section visitor-map" aria-labelledby="visitors-title" data-site-origin="${escape(siteUrl.origin)}" data-widget-url="${escape(visitorMap.scriptUrl)}" hidden>${heading('visitors', '🌍', 'Visitors')}<div class="visitor-map-content"></div></section><script src="visitor-map.js" defer></script>` : '';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Donglin Yang - Homepage</title>
<meta name="description" content="Donglin Yang is a Ph.D. student at Beihang University, advised by Ke Xu and Si Liu. Research in embodied AI, world models, robot learning, UAV navigation, and simulation.">
<meta name="theme-color" content="#ffffff"><meta property="og:type" content="profile"><meta property="og:title" content="Donglin Yang - Homepage"><meta property="og:description" content="Embodied intelligence, world models, and robot learning. Ph.D. student at Beihang University.">
<link rel="canonical" href="${escape(siteUrl.href)}"><meta property="og:url" content="${escape(siteUrl.href)}">
<link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Person',name:'Donglin Yang',jobTitle:'Ph.D. student',affiliation:{'@type':'CollegeOrUniversity',name:'Beihang University'},email:'yangdonglin@buaa.edu.cn',knowsAbout:['Embodied intelligence','Robot learning','World models','UAV navigation','Simulation']})}</script></head>
<body><a class="skip-link" href="#main">Skip to content</a>
<header class="header"><div class="container header-inner"><a class="brand" href="#about" aria-label="Donglin Yang homepage">Homepage</a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg></button><nav class="nav" id="navigation" aria-label="Main navigation"><a href="#about" aria-current="true">About Me</a><a href="#news">News</a><a href="#publications">Selected Publications</a><a href="#awards">Honors and Awards</a><a href="#education">Education</a><a href="#contact">Contact</a></nav></div></header>
<div class="container page-layout">
<aside class="sidebar" aria-labelledby="profile-name"><img class="portrait" src="assets/portrait.webp" alt="Donglin Yang" width="214" height="266" fetchpriority="high"><h1 id="profile-name" class="profile-name">Donglin Yang</h1><p class="affiliation">Ph.D. Student, Beihang University</p><ul class="profile-links">
<li><span class="profile-contact">${icon('pin')}Beijing, China</span></li>
<li><a href="mailto:yangdonglin@buaa.edu.cn">${icon('mail')}Email</a></li>
<li>${ext('https://github.com/puffyyy','GitHub','github')}</li>
<li><span class="profile-contact" title="WeChat: lk__01">${icon('wechat')}<span class="sr-only">WeChat: </span>lk__01</span></li>
</ul></aside>
<main id="main" class="main-content">
<section id="about" class="bio" aria-label="About me"><p>I am a Ph.D. student at <a href="https://www.buaa.edu.cn/" target="_blank" rel="noopener noreferrer">Beihang University</a>, advised by <a href="https://rb-bench.github.io/" target="_blank" rel="noopener noreferrer">Prof. Ke Xu</a> and <a href="https://colalab.net/team/" target="_blank" rel="noopener noreferrer">Prof. Si Liu</a>.</p><p id="research">My research focuses on <strong>embodied intelligence and robot learning</strong>, with an emphasis on vision-language-action models, world models, and language-guided autonomous systems. My work spans mobile manipulation, UAV navigation and control, and realistic simulation for robust perception.</p></section>
<section id="news" class="section" aria-labelledby="news-title">${heading("news", "🔥", "News")}<ul class="news-list">
${newsRows}
</ul></section>
<section id="publications" class="section" aria-labelledby="publications-title">${heading("publications", "📝", "Selected Publications")}<div class="publication-tools"><div class="filters" role="group" aria-label="Filter publications by research topic" hidden><button class="filter" data-filter="all" aria-pressed="true">All research</button><button class="filter" data-filter="robotics" aria-pressed="false">Robotics</button><button class="filter" data-filter="uav" aria-pressed="false">UAVs</button><button class="filter" data-filter="simulation" aria-pressed="false">Simulation</button></div><span class="contribution-note">* Equal contribution</span></div><p class="results-status sr-only" role="status" aria-live="polite" hidden>Showing all ${papers.length} publications</p><div class="publications-list">${publicationRows}</div></section>
<section id="awards" class="section" aria-labelledby="awards-title">${heading("awards", "🎖", "Honors and Awards")}<ul class="awards-list"><li>Second Place Award (2/62), <strong>RoCo Challenge @ AAAI 2026: Robotic Collaborative Assembling for Human-Centered Manufacturing</strong></li><li>Third Place, <strong>2026 World Humanoid Robot Games — Scenario-Based Events: Combined Five-Task Event</strong></li></ul></section>
<section id="education" class="section" aria-labelledby="education-title">${heading("education", "📖", "Education")}<div class="education-row"><div><h3>Beihang University</h3><p>Ph.D. Student · Advised by Prof. Ke Xu and Prof. Si Liu</p></div><span class="education-period">Present</span></div></section>
<section id="contact" class="section" aria-labelledby="contact-title">${heading("contact", "✉️", "Contact")}<p>Always happy to exchange ideas on embodied intelligence and robotics.</p><p><a class="contact-link" href="mailto:yangdonglin@buaa.edu.cn">yangdonglin@buaa.edu.cn</a></p></section>
${visitorSection}
</main></div><footer class="container footer"><p>© 2026 Donglin Yang</p><div class="footer-right"><span>Last updated November 2026</span><a href="#about">Back to top ↑</a></div></footer>
<dialog class="citation-dialog" aria-labelledby="citation-heading"><div class="dialog-heading"><h2 id="citation-heading">Cite this work</h2><button class="dialog-close" aria-label="Close citation">×</button></div><p class="citation-title"></p><pre class="citation-text" tabindex="0"></pre><div class="dialog-actions"><button class="copy-citation">Copy BibTeX</button><a class="download-citation" download>Download .bib ↓</a></div><p class="citation-status" role="status" aria-live="polite"></p></dialog>
</body></html>`;
writeFileSync(new URL('index.html',root),html);
console.log(`Built homepage with ${papers.length} publications and downloadable citations.`);
