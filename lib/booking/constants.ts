export const MAX_NAME_LENGTH = 100;
export const MAX_PHONE_LENGTH = 30;
export const MAX_NOTES_LENGTH = 2000;
export const MAX_FILES = 5;
export const MAX_TOTAL_FILE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_CLIENT_TYPES = new Set(['new', 'returning']);

export const ALLOWED_SERVICES = new Set([
  'starter-locs',
  'instant-locs',
  'traditional-loc-consultation',
  'signature-retwist',
  'retwist-style',
  'interlocking-maintenance',
  'detox-retwist',
  'retwist-membership',
  'loc-repair',
  'broken-loc-repair',
  'reattachment',
  'root-reattachment',
  'wick-repair',
  'loc-reconstruction',
  'loc-take-down-detangle',
  'scalp-detox',
  'deep-cleansing-detox',
  'deep-conditioning',
  'hydration-treatment',
  'protein-treatment',
  'hot-oil-treatment',
  'precision-trim',
  'house-call',
  'emergency-appointment',
  'bridal-loc-package',
  'birthday-package',
  'photoshoot-ready-package',
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
  'starter-locs': 'Starter Locs: Comb Coil or Two-Strand Twist',
  'instant-locs': 'Instant Locs',
  'traditional-loc-consultation': 'Traditional Loc Consultation',
  'signature-retwist': 'Signature Retwist',
  'retwist-style': 'Retwist + Style',
  'interlocking-maintenance': 'Interlocking Maintenance',
  'detox-retwist': 'Detox + Retwist',
  'retwist-membership': 'Retwist Membership',
  'loc-repair': 'Loc Repair',
  'broken-loc-repair': 'Broken Loc Repair',
  'reattachment': 'Reattachment',
  'root-reattachment': 'Root Reattachment',
  'wick-repair': 'Wick Repair',
  'loc-reconstruction': 'Loc Reconstruction',
  'loc-take-down-detangle': 'Loc Take Down & Detangle',
  'scalp-detox': 'Scalp Detox',
  'deep-cleansing-detox': 'Deep Cleansing Detox',
  'deep-conditioning': 'Deep Conditioning',
  'hydration-treatment': 'Hydration Treatment',
  'protein-treatment': 'Protein Treatment',
  'hot-oil-treatment': 'Hot Oil Treatment',
  'precision-trim': 'Precision Trim',
  'house-call': 'House Call',
  'emergency-appointment': 'Emergency Appointment',
  'bridal-loc-package': 'Bridal Loc Package',
  'birthday-package': 'Birthday Package',
  'photoshoot-ready-package': 'Photoshoot Ready Package',
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
