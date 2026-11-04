export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/** Primary navigation, shared by the header and the footer. */
export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Solutions', href: '/solution' },
  { label: 'Brands', href: '/brands' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'News', href: '/news' },
  {
    label: 'Staff',
    href: '/staff',
    children: [
      { label: 'LMS', href: '/staff/lms' },
      { label: 'HRMS', href: '/staff/hrms' },
      { label: 'E-Car', href: '/staff/e-car' },
      { label: 'Webmail', href: '/staff/webmail' },
      { label: 'Cloud Data', href: '/staff/cloud-data' },
      { label: 'Staff Directory', href: '/staff' },
    ],
  },
  { label: 'Training', href: '/training' },
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (href: string) => `${base}${href}`;
