# Repository Guidelines

## Project Structure & Module Organization
Static assets are served by `server.js`, so edits take effect on reload. Key directories:
- `index.html` defines layout sections and `data-content-key` hooks.
- `scripts/` includes `main.js` for boot logic, `content.js` defaults, and Prismic helpers (`prismic.js`, `prismic.config.js`).
- `styles/main.css` centralises typography, scroll snapping, and modifier classes such as `.section--hero`.
- `Fonts/` and `Images/` hold supplied creative; keep paths relative so the static server resolves them.
- `prismic-custom-type.json` is the source of truth for the Prismic `homepage` schema.

## Build, Test, and Development Commands
- `npm install` (optional) creates a lockfile; there are no runtime dependencies.
- `npm run start` serves the site at `http://localhost:3000`.
- Set `PRISMIC_ENDPOINT=<repo>.cdn.prismic.io` before `npm run start` to pull remote content without editing config.

## Coding Style & Naming Conventions
Use two-space indentation and double-quoted strings in JavaScript. Stay with vanilla DOM APIs—no frameworks or bundlers. CSS follows a lightweight BEM pattern (`section--variant`) layered on custom properties, so prefer extending variables over hard-coded colours. When binding new fields, reuse the `data-content-key="group.field"` convention so Prismic overrides and fallback content stay aligned.

## Testing Guidelines
No automated suite exists; rely on focused manual checks. After `npm run start`, confirm the console is clean, scroll snapping behaves on desktop and mobile widths, and imagery loads from both local defaults and Prismic. Temporarily bypass `initializeCuriousPage` to verify the baked-in content still renders without warnings.

## Commit & Pull Request Guidelines
Write imperative, present-tense commits that flag the feature or section, e.g. `feat: add cocktail carousel copy`. Keep visual assets in their own commit when possible. Pull requests should include a short summary, before/after screenshots for UI changes, confirmation that `npm run start` was exercised, and any Prismic setup notes or environment variables new contributors must provide.

## Prismic Integration Tips
Update `scripts/prismic.config.js` with repository credentials instead of hard-coding endpoints elsewhere. When adding CMS fields, mirror them in `prismic-custom-type.json` and extend `content.js` so the page keeps a safe fallback. Stick to lowercase-hyphen filenames in `Images/` to avoid casing issues on production hosts.
