# Donglin Yang — Academic homepage

A responsive, static English academic homepage for Donglin Yang at Beihang University, hosted with GitHub Pages at https://puffyyy.github.io/. No runtime framework or package installation is required.

## Preview and update

```sh
npm run build
npm run check
npm run dev
```

Open `http://localhost:4173/` while the server is running. The generated local preview is in `dist/`.

- `publications.json`: publication titles, authors, venues, descriptions, image paths/alt text, full BibTeX venue names, verified links, and source URLs.
- `build.mjs`: profile text, research interests, the `news` date/text list, honors and awards, education, and shared HTML/BibTeX rendering.
- `dist/styles.css`: responsive visual styling.
- `dist/app.js`: topic filters, mobile navigation, and citation dialog/copy behavior.
- `visitor-map.json` and `dist/visitor-map.js`: optional MapMyVisitors map and public-site-only loading.
- `dist/assets/`: publication figures and portrait images.
- `source-assets/`: original research figures and portrait for future editing.
- `SOURCES.md`: content and image provenance, with known metadata differences.

After changing publication data or the page template, run `npm run build`. Content remains accessible without JavaScript; BibTeX links then directly download the citation files. Fonts use a local system stack without external font requests. The site has no backend. The optional visitor map is the only analytics integration and never loads in local previews.

## Visitor map

The owner's MapMyVisitors **rotating globe** embed is configured for `https://puffyyy.github.io/` in `visitor-map.json`. `scriptUrl` holds the HTTPS `globe.js` URL from the supplied snippet, including its public widget identifier. Leave `scriptUrl` empty to disable the feature. Do not use another site's counter.

Run `npm run build` after configuring it. The globe loads below Contact only on the exact HTTPS origin in `siteUrl`. Localhost, file previews, and other domains do not request or display the counter. If the final public domain changes, update both the provider's site registration and `siteUrl`. The loader preserves the provider's required `mmvst_globe` script ID and loads the script asynchronously.

Desktop displays a 280px globe. At widths of 767px or less, CSS hides the entire Visitors section while the same script still records the visit. The supported `w=280` embed parameter keeps initialization dimensions valid even when hidden; keep it in sync with `.visitor-map-content`. Resizing never reloads the counter or creates a second visit.

MapMyVisitors receives the visitor's request and uses IP geolocation to show approximate locations. Counts start when the widget is active on the published site; they are not historical traffic. The provider's external script renders the globe and its statistics link. The homepage does not add a second tracker. See the [embed guide](https://mapmyvisitors.com/learn/tools/add-a-visitor-map-widget/).

The layout follows the academic homepage style of [ryanhtr.github.io](https://ryanhtr.github.io/): a compact profile sidebar, simple top navigation, and a text-focused main column. Publication entries retain the research images, topic filters, and downloadable citations from the initial design.

## GitHub Pages deployment

The active repository is [puffyyy/puffyyy.github.io](https://github.com/puffyyy/puffyyy.github.io). In **Settings → Pages**, set the source to **GitHub Actions**. The `Deploy homepage` workflow builds and checks the site with Node.js 24, then publishes only `dist/` on each push to `main`. It can also be run manually from the Actions tab.

Commit the source and `dist/` assets together: `build.mjs` regenerates HTML and citations, while styles, JavaScript, and images are maintained in `dist/`. Original figures in `source-assets/` remain available in the repository and are not part of the published artifact.

The original repository's commits are retained in Git history. Do not register or deploy this project to OpenAI Sites unless the user explicitly requests it.

## Content scope

News covers all six works at month precision (`YYYY.MM`). PanoVLA is marked as a preprint release. Paper-specific announcements, schedule-derived months, and evidence limits are recorded in `SOURCES.md`; verification notes are omitted from the visible homepage at the user’s request.

The biography is a draft synthesized from the supplied academic profile and verified papers. The portrait and contact email are from the public CoLab team page. No unconfirmed undergraduate education, admission/graduation dates, internships, awards, or academic service have been added. Citation counts are deliberately omitted because they change frequently. Google Scholar links are omitted at the user’s request.

The Honors and Awards section includes the following award supplied by the user on 2026-11-11: Second Place Award (2/62), **RoCo Challenge @ AAAI 2026: Robotic Collaborative Assembling for Human-Centered Manufacturing**. The placing and competition name are recorded verbatim, without inferring participant or team counts. Its January 2026 news entry follows the official event agenda; timeline provenance is recorded in `SOURCES.md`.

It also includes the user's third-place finish in the 2026 World Humanoid Robot Games, in the scenario competition's five-task combined event (场景赛综合五项), supplied on the same date.
