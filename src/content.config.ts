import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { flag, optionalDate, sortOrder, text, textList } from './lib/content';

/**
 * All content is Markdown: structured fields in the frontmatter, optional rich text in the body.
 * Files are edited by non-developers (via Pages CMS, see .pages.yml), so schemas are deliberately
 * forgiving. They clean values and fall back to safe defaults; unusable entries are skipped and
 * problems are reported as build warnings by the loaders in src/lib/.
 */

/** src/content/training/*.md: one training programme per file. */
const training = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/training' }),
  schema: z.object({
    title: text,
    /** Shows "(Coming Soon)" after the title. */
    comingSoon: flag,
    /** Lower numbers appear first. */
    order: sortOrder,
    /** Icon file in src/assets/training/; only the file name is used. */
    icon: text,
    /** Small label above the title on the Training page, e.g. "Business productivity". */
    category: text,
    /** Short description shown on programme cards. */
    summary: text,
    /** One-line intro shown beside the learning topics on the Training page. */
    tagline: text,
    /** Short focus areas shown on cards, e.g. ["Reporting", "Analysis"]. */
    focus: textList,
    /** Topics without a title are dropped. */
    topics: z
      .array(z.object({ title: text, description: text }).catch({ title: '', description: '' }))
      .catch([])
      .transform((topics) => topics.filter((t) => t.title)),
    applications: z.object({ intro: text, items: textList }).catch({ intro: '', items: [] }),
  }),
});

/** src/content/departments/*.md: one staff department per file. The file name is its URL (/staff/<name>). */
const departments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/departments' }),
  schema: z.object({
    /** Tab label, e.g. "Corporate Admin". */
    title: text,
    /** Page heading. Defaults to "<title> Department". */
    heading: text,
    order: sortOrder,
  }),
});

/** src/content/staff/*.md: one person per file. */
const staff = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/staff' }),
  schema: z.object({
    name: text,
    role: text,
    /** Department name or file name. Leave empty for directors. */
    department: text,
    /** Show on the Board of Directors tab (/staff). */
    board: flag,
    order: sortOrder,
    /** Portrait file in src/assets/staff/; only the file name is used. */
    photo: text,
    /** Which part of the photo stays visible when it is cropped to the card. Defaults to top. */
    photoPosition: z.enum(['top', 'center', 'bottom']).catch('top'),
  }),
});

/** src/content/news-categories/*.md: news filter categories. The file name is the URL (/news/category/<name>). */
const newsCategories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news-categories' }),
  schema: z.object({
    title: text,
    order: sortOrder,
  }),
});

/** src/content/news/*.md: one article per file; the Markdown body is the article text. */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: text,
    date: optionalDate,
    /** Category name or file name. */
    category: text,
    /** Short intro shown on cards and at the top of the article. */
    summary: text,
    /** Cover image file in src/assets/news/; only the file name is used. */
    image: text,
    /** Extra photo files in src/assets/news/; only the file names are used. */
    gallery: textList,
    /** Shown in the "Featured news" slot on /news (the newest featured article wins). */
    featured: flag,
    /** Drafts are not published. */
    draft: flag,
  }),
});

export const collections = { training, departments, staff, newsCategories, news };
