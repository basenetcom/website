import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { findByNameOrSlug, findImage, warn } from './content';

type CategoryEntry = CollectionEntry<'newsCategories'>;
type NewsEntry = CollectionEntry<'news'>;

export type Category = CategoryEntry;
export type Article = NewsEntry & { category: Category | null; image: ImageMetadata | null; gallery: ImageMetadata[] };

export const PAGE_SIZE = 6;

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/news/*.{png,jpg,jpeg,webp,svg}', { eager: true });

export async function getCategories(): Promise<Category[]> {
  const entries = (await getCollection('newsCategories')).filter((c) => {
    if (c.data.title) return true;
    warn(`src/content/news-categories/${c.id}.md`, `News category "${c.id}": skipped, because the title is empty.`);
    return false;
  });
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Published articles, newest first (undated articles last). Never throws on bad content. */
export async function getArticles(categories?: Category[]): Promise<Article[]> {
  const cats = categories ?? (await getCategories());
  const entries = await getCollection('news');
  const articles: Article[] = [];

  for (const entry of entries) {
    const file = `src/content/news/${entry.id}.md`;
    const { title, summary, category, image, gallery, draft, date } = entry.data;
    if (draft) continue;
    if (!title) {
      warn(file, `News "${entry.id}": skipped, because the title is empty.`);
      continue;
    }
    const cat = category ? (findByNameOrSlug(cats, category) ?? null) : null;
    if (category && !cat) warn(file, `News "${title}": category "${category}" doesn't match any category, so none is shown.`);
    const img = image ? findImage(images, image) : null;
    if (image && !img) warn(file, `News "${title}": image "${image}" was not found in src/assets/news/, showing a placeholder.`);
    const galleryImages: ImageMetadata[] = [];
    for (const name of gallery) {
      const g = findImage(images, name);
      if (g) galleryImages.push(g);
      else warn(file, `News "${title}": gallery image "${name}" was not found in src/assets/news/, skipping it.`);
    }
    if (!date) warn(file, `News "${title}": has no date, so it is listed last.`);
    if (!summary) warn(file, `News "${title}": has no summary.`);
    articles.push({ ...entry, category: cat, image: img, gallery: galleryImages });
  }

  return articles.sort((a, b) => (b.data.date?.getTime() ?? -Infinity) - (a.data.date?.getTime() ?? -Infinity));
}

/** The newest featured article, or the newest article if none is marked featured. */
export const pickFeatured = (articles: Article[]) => articles.find((a) => a.data.featured) ?? articles[0];

export type PageView<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  /** 1-based position of the first and last item on this page. */
  first: number;
  last: number;
};

export const paginate = <T,>(items: T[], page: number, size = PAGE_SIZE): PageView<T> => ({
  items: items.slice((page - 1) * size, page * size),
  page,
  totalPages: Math.max(1, Math.ceil(items.length / size)),
  total: items.length,
  first: (page - 1) * size + 1,
  last: Math.min(page * size, items.length),
});
