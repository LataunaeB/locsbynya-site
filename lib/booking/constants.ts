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
  'moisture-treatment',
  'same-day-appointment',
  'holiday-appointment',
  'house-call',
  'emergency-appointment',
  'bridal-loc-package',
  'birthday-package',
  'photoshoot-ready-package',
]);

export const ALLOWED_HAIR_LENGTHS = new Set(['short', 'medium', 'long', 'xl']);

export const LENGTH_PRICED_SERVICE_IDS = new Set([
  'starter-locs',
  'instant-locs',
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
]);

export const hairLengthLabels: Record<string, string> = {
  short: 'Short',
  medium: 'Medium',
  long: 'Long',
  xl: 'XL',
};

export const hairLengthStartingPrices: Record<string, string> = {
  short: '$175+',
  medium: '$225+',
  long: '$300+',
  xl: '$400+',
};

export const serviceCategories: Record<string, string> = {
  'starter-locs': 'Start Your Loc Journey',
  'instant-locs': 'Start Your Loc Journey',
  'traditional-loc-consultation': 'Start Your Loc Journey',
  'signature-retwist': 'Signature Maintenance',
  'retwist-style': 'Signature Maintenance',
  'interlocking-maintenance': 'Signature Maintenance',
  'detox-retwist': 'Signature Maintenance',
  'retwist-membership': 'Signature Maintenance',
  'loc-repair': 'Loc Restoration',
  'broken-loc-repair': 'Loc Restoration',
  'reattachment': 'Loc Restoration',
  'root-reattachment': 'Loc Restoration',
  'wick-repair': 'Loc Restoration',
  'loc-reconstruction': 'Loc Restoration',
  'loc-take-down-detangle': 'Loc Restoration',
  'deep-cleansing-detox': 'Hair Wellness',
  'scalp-detox': 'Hair Wellness',
  'deep-conditioning': 'Hair Wellness',
  'hydration-treatment': 'Hair Wellness',
  'hot-oil-treatment': 'Hair Wellness',
  'protein-treatment': 'Hair Wellness',
  'moisture-treatment': 'Hair Wellness',
  'precision-trim': 'Hair Wellness',
  'same-day-appointment': 'VIP Experiences',
  'holiday-appointment': 'VIP Experiences',
  'house-call': 'VIP Experiences',
  'emergency-appointment': 'VIP Experiences',
  'bridal-loc-package': 'VIP Experiences',
  'birthday-package': 'VIP Experiences',
  'photoshoot-ready-package': 'VIP Experiences',
};

export const fixedServiceStartingPrices: Record<string, string> = {
  'deep-cleansing-detox': '$35',
  'protein-treatment': '$30',
  'moisture-treatment': '$25',
  'precision-trim': '$25',
  'same-day-appointment': '$40',
  'holiday-appointment': '$75',
  'house-call': 'Starting at $100 travel fee',
  'emergency-appointment': 'Starting at $50',
};

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
  'loc-jewelry-installation',
  'color-consultation',
  'style-add-ons',
  'loc-color',
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
  'moisture-treatment': 'Moisture Treatment',
  'protein-treatment': 'Protein Treatment',
  'hot-oil-treatment': 'Hot Oil Treatment',
  'precision-trim': 'Precision Trim',
  'same-day-appointment': 'Same-Day Appointment',
  'holiday-appointment': 'Holiday Appointment',
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
  'loc-jewelry-installation': 'Loc Jewelry Installation ($15+)',
  'color-consultation': 'Color Consultation ($30)',
  'style-add-ons': 'Style Add-Ons (priced by style)',
  'loc-color': 'Loc Color Enhancement (starting at $40+)',
  'house-call': 'House Call (+$60+)',
  'late-night-early-morning': 'Late Night / Early Morning Slot (by request only)',
};
