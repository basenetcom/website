import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { findByNameOrSlug, findImage, warn } from './content';

type DepartmentEntry = CollectionEntry<'departments'>;
type StaffEntry = CollectionEntry<'staff'>;

export type Department = DepartmentEntry & { heading: string };
export type Person = StaffEntry & { department: Department | null; photo: ImageMetadata | null };

/** The first tab. It lives at /staff and lists directors and department heads. */
export const BOARD_LABEL = 'Top Management';
export const BOARD_HEADING = 'Our Team';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/staff/*.{png,jpg,jpeg,webp,svg}', { eager: true });

export async function getDepartments(): Promise<Department[]> {
  const entries = await getCollection('departments');
  const departments: Department[] = [];
  for (const entry of entries) {
    if (!entry.data.title) {
      warn(`src/content/departments/${entry.id}.md`, `Department "${entry.id}": skipped, because the title is empty.`);
      continue;
    }
    departments.push({ ...entry, heading: entry.data.heading || `${entry.data.title} Department` });
  }
  return departments.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** All people, in display order, with department and photo resolved. People without a name are skipped. */
export async function getStaff(departments?: Department[]): Promise<Person[]> {
  const depts = departments ?? (await getDepartments());
  const entries = await getCollection('staff');
  const people: Person[] = [];

  for (const entry of entries) {
    const file = `src/content/staff/${entry.id}.md`;
    const { name, department, photo } = entry.data;
    if (!name) {
      warn(file, `Staff "${entry.id}": skipped, because the name is empty.`);
      continue;
    }
    const dept = department ? (findByNameOrSlug(depts, department) ?? null) : null;
    if (department && !dept) {
      warn(file, `Staff "${name}": department "${department}" doesn't match any department, so none is shown.`);
    }
    people.push({ ...entry, department: dept, photo: photo ? findImage(photos, photo) : null });
  }

  return people.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}
