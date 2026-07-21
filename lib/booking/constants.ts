export const MAX_NAME_LENGTH = 100;
export const MAX_PHONE_LENGTH = 30;
export const MAX_NOTES_LENGTH = 2000;
export const MAX_FILES = 5;
export const MAX_TOTAL_FILE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_CLIENT_TYPES = new Set(['new', 'returning']);

export const ALLOWED_SERVICES = new Set([
  'new-client-consultation',
  'kids-starter-locs',
  'kids-retwist-style',
  'kids-takedown',
  'teens-adults-starter-locs',
  'teens-adults-retwist',
  'teens-adults-repair',
]);

export const ALLOWED_TIME_WINDOWS = new Set([
  'thursday-5pm-10pm',
  'friday-5pm-10pm',
  'saturday-9am-9pm',
  'sunday-9am-9pm',
]);

export const ALLOWED_ADD_ONS = new Set([
  'loc-detox',
  'loc-oil-treatment',
  'scalp-treatment',
  'loc-repair',
  'style-add-ons',
  'loc-color',
  'house-call',
  'late-night-early-morning',
]);

export const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/mpeg',
]);

export const serviceNames: Record<string, string> = {
  'new-client-consultation': 'New Client Consultation',
  'kids-starter-locs': 'Kids · Starter Locs (Ages 2–12)',
  'kids-retwist-style': 'Kids · Retwist + Style',
  'kids-takedown': 'Kids · Loc Take Down + Detangle',
  'teens-adults-starter-locs': 'Teens & Adults · Starter Locs (13+)',
  'teens-adults-retwist': 'Teens & Adults · Retwist & Maintenance',
  'teens-adults-repair': 'Teens & Adults · Repair / Deep Care',
};

export const addOnNames: Record<string, string> = {
  'loc-detox': 'Loc Detox (+$30)',
  'loc-oil-treatment': 'Loc Oil Treatment (+$25)',
  'scalp-treatment': 'Scalp Treatment (+$30)',
  'loc-repair': 'Loc Repair / Re-attachment (+$15 each)',
  'style-add-ons': 'Style Add Ons',
  'loc-color': 'Loc Color Enhancement (starting at $40+)',
  'house-call': 'House Call (+$60+)',
  'late-night-early-morning': 'Late Night / Early Morning Slot (by request only)',
};
