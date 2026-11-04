# BaseNET Website

Company website for **BaseNET Technology Sdn Bhd**: a static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com) v4, deployed to GitHub Pages.

Design source: https://www.figma.com/design/jwdybIx46zxLA1GlidloGV/website-baru-basenet?node-id=0-1&p=f&m=dev

## Requirements

- Node.js `>= 22.23.4`
- [pnpm](https://pnpm.io)

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:4321/basenet-web/>. The site is served under the `/basenet-web` base path (see [Deployment](#deployment)), so the bare `localhost:4321/` URL will not show the site.

| Command        | Action                                           |
| :------------- | :----------------------------------------------- |
| `pnpm install` | Install dependencies                             |
| `pnpm dev`     | Start the local dev server                       |
| `pnpm build`   | Build the production site to `./dist/`           |
| `pnpm preview` | Preview the production build locally             |
| `pnpm astro …` | Run Astro CLI commands (`astro add`, `astro check`) |

## Project structure

```text
/
├── public/                  Favicons
├── src/
│   ├── assets/              Images processed by Astro (hero photo, logo, brand logos, training icons)
│   ├── components/
│   │   ├── header/          Top bar, logo, main nav, staff dropdown
│   │   ├── footer/          Footer sections
│   │   ├── Hero, AboutUs, Solutions, CorporateTraining, LogoCloud, ContactCta   Home page sections
│   │   ├── Carousel, BackToTop                                                  Reusable interactive pieces
│   │   └── InquiryForm, FormField, ContactInfo                                  Contact page
│   ├── layouts/Layout.astro Page shell (header, footer, back-to-top, per-page title)
│   ├── pages/               index.astro (home), contact.astro
│   ├── styles/global.css    Tailwind import and design tokens
│   ├── nav.ts               Navigation links (shared by header and footer)
│   └── site.config.ts       Company details and form settings
└── astro.config.mjs         Site URL, base path, Inter font, Tailwind plugin
```

## Where to change things

- **Company details** (name, phone, email, address, hours): `src/site.config.ts`.
- **Navigation links**: `src/nav.ts`. Pass paths without the base prefix; `withBase()` adds it.
- **Partner logos**: drop the image in `src/assets/brands/` and add it to the `brands` list in `src/components/LogoCloud.astro`. The scroll speed adjusts to the number of logos.
- **Training courses**: the `courses` list in `src/components/CorporateTraining.astro`. The carousel shows chevrons only when the cards don't all fit.
- **Page title and description**: pass `title` and `description` to `<Layout>`.

## Design tokens

Colours, type sizes and spacing live in the `@theme` block of `src/styles/global.css`, taken from the Figma design. Use the tokens rather than raw values:

- Colours: `brand-50` to `brand-900`, `accent`, `nav`, `copy`, `muted`
- Type sizes: `text-display`, `text-heading`, `text-lead`, `text-title`, `text-body`, `text-small`, `text-caption`, `text-cta`
- Section padding: `py-section`

## Contact form

The site is static, so the inquiry form has no backend of its own. It works in two modes, set by `INQUIRY_ENDPOINT` in `src/site.config.ts`:

- **Empty (default):** submitting opens the visitor's email app with the inquiry prefilled to `COMPANY.email`.
- **Set to a URL:** the form POSTs the inquiry as JSON to that URL (for example a Formspree or Web3Forms endpoint, or a Cloudflare Worker) and shows a success or error message on the page.

## Accessibility

The site targets WCAG 2.2 AA. Notable decisions:

- The logo cloud scrolls automatically. It pauses on hover and on tap, and shows a static grid when the visitor prefers reduced motion. It has no pause button, so it does not fully meet WCAG 2.2.2 (Pause, Stop, Hide); a static logo row would.
- The training carousel never auto-rotates. It is a native scroll-snap list with chevron buttons, and it works without JavaScript.
- Form inputs use a darker border than the Figma design so they meet the 3:1 contrast requirement for UI components.
- The form validates inline, moves focus to the first error, and announces the result to screen readers.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages at <https://new.basenet.com.my>. If the repository or its URL changes, update `site` and `base` in `astro.config.mjs`.

## Known gaps

- Navigation links to Solutions, Brands, News, Staff and Training, and the Privacy Policy link, point to pages that don't exist yet and return 404.
