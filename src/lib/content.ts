import type { ImageMetadata } from 'astro';
import { z } from 'astro/zod';

/**
 * Helpers shared by the content collections. Content is edited by non-developers (via Pages CMS),
 * so schemas clean values and fall back to safe defaults instead of failing the build.
 */

/** Any scalar becomes a trimmed string; anything else becomes "". */
export const text = z.preprocess((v) => (v == null || typeof v === 'object' ? '' : String(v)), z.string().trim()).catch('');

/** A list of strings with blank items dropped. */
export const textList = z
  .array(text)
  .catch([])
  .transform((items) => items.filter(Boolean));

export const flag = z.boolean().catch(false);

export const sortOrder = z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int()).catch(100);

/** A valid date, or undefined. Accepts YAML dates and ISO strings. */
export const optionalDate = z
  .preprocess((v) => {
    if (v instanceof Date) return v;
    if (typeof v === 'string' || typeof v === 'number') return new Date(v);
    return undefined;
  }, z.date())
  .optional()
  .catch(undefined);

/** "Corporate Admin & Finance" -> "corporate-admin-finance". Also strips folders and extensions from paths. */
export function slugify(value: string): string {
  return value
    .split(/[\\/]/)
    .pop()!
    .replace(/\.(md|mdx|ya?ml|json)$/i, '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Finds the item whose id or title matches a CMS-written value (a name, slug or path), ignoring case. */
export function findByNameOrSlug<T extends { id: string; data: { title: string } }>(items: T[], value: string): T | undefined {
  const key = slugify(value);
  if (!key) return undefined;
  return items.find((item) => item.id === key || slugify(item.data.title) === key);
}

const warned = new Set<string>();

/** Escapes a value for a GitHub Actions workflow command, so content can't break or inject commands. */
const escapeData = (v: string) => v.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = (v: string) => escapeData(v).replace(/:/g, '%3A').replace(/,/g, '%2C');

/** Build warning shown as an annotation in GitHub Actions logs (and as plain text locally). Printed once. */
export function warn(file: string, message: string) {
  const line = `::warning file=${escapeProperty(file)}::${escapeData(message)}`;
  if (warned.has(line)) return;
  warned.add(line);
  console.warn(line);
}

/** Looks up an image by file name in an `import.meta.glob` result, ignoring folder prefix and case. */
export function findImage(
  images: Record<string, { default: ImageMetadata }>,
  value: string,
): ImageMetadata | null {
  const name = value.split(/[\\/]/).pop()?.toLowerCase();
  if (!name) return null;
  const match = Object.entries(images).find(([path]) => path.split('/').pop()?.toLowerCase() === name);
  return match ? match[1].default : null;
}

/** "30 Sep 2025" */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (d: Date) => `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
