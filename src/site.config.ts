export const SITE_NAME = 'Basenet';

export const COMPANY = {
  legalName: 'BaseNET Technology Sdn Bhd',
  tagline: 'Business-ready networking, virtualization and security solutions.',
  phone: {
    display: '+6038929 0000',
    href: 'tel:+60389290000',
  },
  email: 'sales@basenet.com.my',

  address: 'Paragon Point, B-01-2, Jalan Medan PB5, 43650 Bandar Baru Bangi, Selangor',

  supportEmail: 'support@basenet.com.my',
 
  operatingHours: 'Mon-Fri 8 am-5 pm',
} as const;

/**
 * Where the inquiry form POSTs its JSON (e.g. a Formspree / Web3Forms / Cloudflare Worker URL).
 * Leave empty to fall back to opening the visitor's email app (mailto:).
 */
export const INQUIRY_ENDPOINT = '';
