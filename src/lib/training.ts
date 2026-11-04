import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { findImage, warn } from './content';

type Entry = CollectionEntry<'training'>;
/** A usable programme. `icon` is null when the icon file is missing (a generic icon is shown instead). */
export type TrainingProgram = Entry & { icon: ImageMetadata | null };

const icons = import.meta.glob<{ default: ImageMetadata }>('../assets/training/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
});

const warnFor = (entry: Entry, message: string) =>
  warn(`src/content/training/${entry.id}.md`, `Training programme "${entry.id}": ${message}`);

/**
 * All usable training programmes, in display order. Never throws on bad content:
 * unusable entries are skipped and fixable problems fall back to defaults, each with a build warning.
 */
export async function getTrainingPrograms(): Promise<TrainingProgram[]> {
  const entries = await getCollection('training');
  const programs: TrainingProgram[] = [];

  for (const entry of entries) {
    const { title, summary, icon, focus } = entry.data;
    if (!title || !summary) {
      warnFor(entry, `skipped, because ${!title ? 'the name' : 'the card summary'} is empty.`);
      continue;
    }
    const resolved = icon ? findImage(icons, icon) : null;
    if (!resolved) {
      warnFor(entry, icon ? `icon "${icon}" was not found in src/assets/training/, showing a generic icon.` : 'no icon set, showing a generic icon.');
    }
    if (focus.length === 0) warnFor(entry, 'has no focus areas (the line at the bottom of its card is hidden).');
    programs.push({ ...entry, icon: resolved });
  }

  return programs.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export const displayTitle = ({ data }: Pick<Entry, 'data'>) =>
  data.comingSoon ? `${data.title} (Coming Soon)` : data.title;
