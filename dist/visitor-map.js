const visitorMap = document.getElementById('visitors');

// Only the configured public site records visits; local previews never load the counter.
if (visitorMap && location.origin === visitorMap.dataset.siteOrigin && visitorMap.dataset.widgetUrl) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'mmvst_globe';
  script.src = visitorMap.dataset.widgetUrl;
  script.async = true;
  script.addEventListener('error', () => { visitorMap.hidden = true; });
  // Load on all devices to count visits. CSS hides the globe on mobile.
  visitorMap.hidden = false;
  visitorMap.querySelector('.visitor-map-content').append(script);
}
