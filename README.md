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

The dev server runs at <http://localhost:4321/>. The site is served from the root of its custom domain, so there is no base path. Internal links still go through `withBase()` in `src/nav.ts`, so a base path can be added later in `astro.config.mjs` without touching the pages.

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
│   ├── assets/              Images processed by Astro: brands/, training/, staff/, news/, hero photo, logo
│   ├── components/
│   │   ├── header/ footer/  Site chrome (top bar, nav, staff dropdown, footer)
│   │   ├── Hero, AboutUs, Solutions, CorporateTraining, LogoCloud, ContactCta   Home page sections
│   │   ├── Carousel, BackToTop, PageHero, FilterChips, Pagination               Reusable pieces
│   │   ├── InquiryForm, FormField, ContactInfo                                  Contact page
│   │   ├── TrainingCard, CourseDetail, ProgramIcon                              Training
│   │   ├── StaffDirectory, StaffCard                                            Staff
│   │   └── NewsListing, NewsCard                                                News
│   ├── content/             Markdown content, one file per item (see "Content")
│   │   └── training/ staff/ departments/ news/ news-categories/
│   ├── content.config.ts    Schema for every content collection
│   ├── lib/                 content.ts (shared helpers), training.ts, staff.ts, news.ts (loaders)
│   ├── layouts/Layout.astro Page shell (header, footer, back-to-top, per-page title)
│   ├── pages/               index, contact, training, staff/, news/
│   ├── styles/global.css    Tailwind import and design tokens
│   ├── nav.ts               Navigation links (shared by header and footer)
│   └── site.config.ts       Company details and form settings
├── .pages.yml               Pages CMS configuration (the editors' forms)
└── astro.config.mjs         Site URL, Inter font, Tailwind plugin
```

## Where to change things

- **Company details** (name, phone, email, address, hours): `src/site.config.ts`.
- **Navigation links**: `src/nav.ts`. Pass paths without the base prefix; `withBase()` adds it.
- **Partner logos**: drop the image in `src/assets/brands/` and add it to the `brands` list (top row, scrolls right to left) or the `moreBrands` list (second row, scrolls left to right) in `src/components/LogoCloud.astro`. Each row's scroll speed adjusts to its number of logos.
- **Content** (training, staff, departments, news): Markdown files in `src/content/`; see "Content" below. Non-developers use [Pages CMS](#managing-content-pages-cms).
- **Page title and description**: pass `title` and `description` to `<Layout>`.

## Content

All editable content is Markdown: structured fields in the frontmatter, optional rich text in the body. Add, edit or delete a file and the site updates on the next build.

| Folder | One file is | Where it appears |
| :-- | :-- | :-- |
| `src/content/training/` | a training programme | Home section and `/training` |
| `src/content/staff/` | a person | `/staff` (directors and department heads) and `/staff/<department>` |
| `src/content/departments/` | a department | the tabs and `/staff/<file name>` pages (file name is the address) |
| `src/content/news/` | a news article (Markdown body is the article text) | `/news`, `/news/category/<category>`, `/news/page/<n>` and `/news/<file name>` |
| `src/content/news-categories/` | a news category | the filter chips and `/news/category/<file name>` |

Images live in `src/assets/<training|staff|news>/` and are matched by file name, whatever folder path is written in the content. News: the newest article marked `featured` fills the "Featured news" slot; `draft: true` hides an article; lists show 6 articles per page (`PAGE_SIZE` in `src/lib/news.ts`).

The schemas are in `src/content.config.ts`. Staff and department names shown in the seed content come from the Figma designs and should be confirmed by BaseNET before publishing.

**Bad content.** Because editors are non-developers, the site is forgiving rather than strict. Values are trimmed and cleaned; an item with no name or title is skipped; a missing or misspelled image shows a placeholder; an unknown department or category is ignored; a bad date or order falls back to a default. Each problem is printed as a build warning (a yellow annotation on the GitHub Actions run, naming the file), so check the Actions log if something doesn't show up. The one thing that can still fail a build is invalid frontmatter syntax, which only happens when someone edits a file by hand; the previous version of the site stays live in that case.

## Managing content (Pages CMS)

Editors can add, edit and delete content in web forms instead of editing Markdown. [Pages CMS](https://pagescms.org) edits the files in this repository directly; every save is a commit to `main`, which triggers the normal GitHub Pages deployment (usually live within a few minutes). The forms are defined in `.pages.yml`.

One-time setup (see the [Pages CMS docs](https://pagescms.org/docs/) for details):

1. Sign in at <https://app.pagescms.org> with a GitHub account that has admin access to this repository, and add the repository (this installs the Pages CMS GitHub App).
2. Invite editors as collaborators in Pages CMS.
3. Check the setup once: edit and save an item in each collection, upload a test image, and confirm the commit appears and the site rebuilds. Things worth confirming: that new files get sensible names (the file name is the page address), that the Category and Department pickers save a value the site recognises, and that the article body editor saves Markdown.

If you add a field, change `src/content.config.ts` (the site's schema) and `.pages.yml` (the editor's form) together so they stay in sync.

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

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages at <https://new.basenet.com.my>. If the domain changes, update `site` in `astro.config.mjs` (and `public/CNAME`).

## Known gaps

- The navigation links to Our Solutions (`/solution`) and Brands (`/brands`), the other Staff dropdown items (LMS, HRMS, E-Car, Webmail, Cloud Data) and the Privacy Policy link point to pages that don't exist yet and return 404.
