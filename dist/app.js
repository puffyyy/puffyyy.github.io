const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
function setMenuOpen(isOpen) {
  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', isOpen);
}
menu.addEventListener('click', () => setMenuOpen(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menu.focus();
  }
});

const filters = [...document.querySelectorAll('.filter')];
const publications = [...document.querySelectorAll('.publication')];
const status = document.querySelector('.results-status');
document.querySelector('.filters').hidden = false;
status.hidden = false;
function filterPublications(category) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  publications.forEach(paper => { paper.hidden = category !== 'all' && paper.dataset.category !== category; });
  const count = publications.filter(paper => !paper.hidden).length;
  status.textContent = category === 'all' ? `Showing all ${count} publications` : `Showing ${count} of ${publications.length} publications`;
}
filters.forEach(button => button.addEventListener('click', () => filterPublications(button.dataset.filter)));
function revealPublication(hash, scroll = false) {
  const target = document.getElementById(hash.slice(1));
  if (target?.classList.contains('publication') && target.hidden) {
    filterPublications('all');
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }
}
window.addEventListener('hashchange', () => revealPublication(location.hash, true));
document.querySelector('.news-list').addEventListener('click', event => {
  const anchor = event.target.closest('a');
  // Reveal before the browser scrolls, including clicks on the current hash.
  if (anchor) revealPublication(anchor.hash);
});
revealPublication(location.hash, true);

const header = document.querySelector('.header');
const navItems = [...navigation.querySelectorAll('a')].map(link => ({
  link,
  section: document.getElementById(link.hash.slice(1))
}));
function updateCurrentSection() {
  let active = navItems[0].link;
  const threshold = header.getBoundingClientRect().bottom + 30;
  navItems.forEach(({link, section}) => {
    if (section && section.getBoundingClientRect().top <= threshold) active = link;
  });
  navItems.forEach(({link}) => link.setAttribute('aria-current', String(link === active)));
}
let navigationFramePending = false;
function scheduleNavigationUpdate() {
  if (navigationFramePending) return;
  navigationFramePending = true;
  requestAnimationFrame(() => { updateCurrentSection(); navigationFramePending = false; });
}
window.addEventListener('scroll', scheduleNavigationUpdate, {passive:true});
window.addEventListener('resize', scheduleNavigationUpdate);
updateCurrentSection();

const dialog = document.querySelector('.citation-dialog');
const citationTitle = document.querySelector('.citation-title');
const bibText = document.querySelector('.citation-text');
const copyButton = document.querySelector('.copy-citation');
const downloadCitation = document.querySelector('.download-citation');
const citationStatus = document.querySelector('.citation-status');
const citationsPromise = fetch('citations.json').then(response => {
  if (!response.ok) throw new Error('Could not load citations');
  return response.json();
}).catch(()=>null);
document.querySelectorAll('.cite-link').forEach(link => link.addEventListener('click', async event => {
  if (!dialog.showModal) return;
  event.preventDefault();
  const citations = await citationsPromise;
  const citation = citations?.[link.dataset.cite];
  if (!citation) { window.location.href = link.href; return; }
  citationTitle.textContent = citation.title;
  bibText.textContent = citation.bib;
  downloadCitation.href = link.href;
  citationStatus.textContent = '';
  copyButton.textContent = 'Copy BibTeX';
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect=dialog.getBoundingClientRect();
  if(event.target===dialog && (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom))dialog.close();
});
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(bibText.textContent);
    copyButton.textContent='Copied!';
    citationStatus.textContent='BibTeX copied to clipboard.';
  } catch {
    const selection=window.getSelection();
    const range=document.createRange();
    range.selectNodeContents(bibText);selection.removeAllRanges();selection.addRange(range);
    citationStatus.textContent='Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
