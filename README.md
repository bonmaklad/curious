# Curious Garden Showcase

A fully responsive, section-by-section landing page for the Curious Garden range. The layout mirrors the provided creative
frames and includes a lightweight Prismic integration so editors can swap copy and imagery without a rebuild.

## Features

- Smooth full-screen scrolling with snap alignment for each hero panel.
- Local Albertus Nova typography embedded for precise art direction.
- Mobile-first responsive rules that preserve the supplied compositions on tablet and desktop breakpoints.
- Prismic data loader that can hydrate every section (hero, gin, vodka, cocktails, and how-to-serve) at runtime.
- Zero-build static delivery – can be hosted on any static file host or served locally with the included Node server.

## Getting started

```bash
npm install # optional – no dependencies required
npm run start
```

Then open <http://localhost:3000>.

> **Tip:** The project has no runtime dependencies. `npm install` simply creates a lockfile if you want one; the page works
> straight away.

## Linking to Prismic

1. Create (or reuse) a Prismic repository.
2. Add a custom type called `homepage` with the fields shown below. You can copy the JSON definition from
   [`prismic-custom-type.json`](./prismic-custom-type.json) as a starting point.
3. Publish a document with the UID `homepage` (or change the UID in `scripts/prismic.config.js`).
4. Update [`scripts/prismic.config.js`](./scripts/prismic.config.js) with your repository name (and an access token if the
   repo is private).
5. Reload the page – Prismic content will override the baked-in defaults.

### Suggested custom type (summary)

| Field API ID                 | Field type      | Notes                                                                     |
| --------------------------- | --------------- | ------------------------------------------------------------------------- |
| `hero_question`             | Key Text        | “CURIOUS?”                                                                |
| `hero_line_one`             | Key Text        | “C U R I O U S” (include spaces for styling)                              |
| `hero_line_two`             | Key Text        | “G A R D E N”                                                             |
| `hero_background`           | Image           | Hero background artwork                                                   |
| `story_body`                | Rich Text       | Monk origin copy                                                          |
| `story_title`               | Key Text        | “CURIOUS\nGARDEN”                                                         |
| `story_background`          | Image           | Split layout artwork                                                      |
| `gin_title`                 | Key Text        | Typically “GIN”                                                           |
| `gin_tagline`               | Key Text        | “every sip blossoms.”                                                     |
| `gin_items` (Group)         | Title/Image/Rich Text | One repeat for each gin bottle                                       |
| `vodka_title`               | Key Text        | “VODKA”                                                                   |
| `vodka_tagline`             | Key Text        | “every sip warms the spirit.”                                             |
| `vodka_description`         | Rich Text       | Vodka paragraph                                                           |
| `vodka_image`               | Image           | Vodka bottle                                                              |
| `cocktail_intro_*` fields   | Key Text / Rich Text / Image | Badge copy, supporting text, and artwork                        |
| `cocktails_title`           | Key Text        | “COCKTAILS”                                                               |
| `cocktails_tagline`         | Key Text        | “twist.shake.pour.”                                                       |
| `cocktail_items` (Group)    | Title/Image/Rich Text | Each cocktail card (description + “made with” line)                 |
| `how_to_title`              | Key Text        | “HOW\nTO\nSERVE”                                                         |
| `how_to_tagline`            | Key Text        | Supporting strapline                                                      |
| `how_to_images` (Group)     | Image           | Three serve illustrations or bottles                                      |

Only the fields you publish are replaced – any missing values fall back to the default creative from the design brief.

## File structure

```
curious/
├── Fonts/                      # Albertus Nova font files supplied by the client
├── Images/                     # Provided artwork and bottle renders
├── README.md
├── index.html                  # Main landing page
├── package.json
├── server.js                   # Lightweight static server for local previews
├── scripts/
│   ├── content.js              # Fallback content that mirrors the Figma copy
│   ├── main.js                 # Boots the page and applies data bindings
│   ├── prismic.config.js       # Repository configuration (edit me!)
│   └── prismic.js              # Prismic fetch + DOM binding helpers
└── styles/
    └── main.css                # Global styles and responsive rules
```

## Accessibility & performance notes

- All imagery includes alt text hooks so editors can provide meaningful descriptions through Prismic.
- Fonts load with `font-display: swap` to keep Lighthouse scores high on first paint.
- Layout relies on CSS scroll snapping and pure CSS grids/flex – no heavy JavaScript libraries required.

## Deploying

Because everything compiles to plain HTML, CSS, and JavaScript, you can deploy the `/workspace/curious` folder to any static
host (Netlify Drop, Vercel static hosting, S3, Azure Blob, etc.).

If you use a CDN, enable caching for the Images and Fonts folders for best performance.
