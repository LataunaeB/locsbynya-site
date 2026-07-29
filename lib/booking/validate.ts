import {
  ALLOWED_ADD_ONS,
  ALLOWED_CLIENT_TYPES,
  ALLOWED_FILE_TYPES,
  ALLOWED_HAIR_LENGTHS,
  ALLOWED_SERVICES,
  ALLOWED_TIME_WINDOWS,
  fixedServiceStartingPrices,
  hairLengthStartingPrices,
  LENGTH_PRICED_SERVICE_IDS,
  MAX_FILES,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_RESTORATION_LOC_COUNT,
  MAX_TOTAL_FILE_BYTES,
  RESTORATION_MINIMUM_APPOINTMENT_TOTAL,
  RESTORATION_STARTING_PRICE_PER_LOC,
  RESTORATION_SERVICE_IDS,
  serviceCategories,
} from './constants';
import type { ValidatedBooking } from './types';

export type ValidationResult =
  | { ok: true; booking: ValidatedBooking }
  | { ok: false; message: string };

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00`);
  return !Number.isNaN(parsed.getTime());
}

function parseAddOns(addOnsJson: string | null): string[] | null {
  if (!addOnsJson) return [];
  try {
    const parsed = JSON.parse(addOnsJson);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every((item) => typeof item === 'string')) return null;
    if (!parsed.every((item) => ALLOWED_ADD_ONS.has(item))) return null;
    return parsed;
  } catch {
    return null;
  }
}

function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) {
    return `You can upload at most ${MAX_FILES} files.`;
  }

  let totalBytes = 0;
  for (const file of files) {
    if (file.size <= 0) {
      return 'Uploaded files must not be empty.';
    }
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return 'Only image and video files are allowed (JPEG, PNG, GIF, WebP, HEIC, MP4, MOV, WebM).';
    }
    totalBytes += file.size;
    if (totalBytes > MAX_TOTAL_FILE_BYTES) {
      return 'Total upload size must be 10MB or less.';
    }
  }

  return null;
}

function extractFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (const entry of formData.getAll('hairFiles')) {
    if (entry instanceof File && entry.size > 0) {
      files.push(entry);
    }
  }
  return files;
}

export async function validateBookingFormData(
  formData: FormData
): Promise<ValidationResult> {
  const clientType = String(formData.get('clientType') ?? '').trim();
  const service = String(formData.get('service') ?? '').trim();
  const serviceCategory = String(formData.get('serviceCategory') ?? '').trim();
  const hairLength = String(formData.get('hairLength') ?? '').trim();
  const takeDownLocLength = String(formData.get('takeDownLocLength') ?? '').trim();
  const takeDownDensity = String(formData.get('takeDownDensity') ?? '').trim();
  const takeDownInstalled = String(formData.get('takeDownInstalled') ?? '').trim();
  const takeDownNotes = String(formData.get('takeDownNotes') ?? '').trim();
  const restorationLocCountRaw = String(formData.get('restorationLocCount') ?? '').trim();
  const restorationLength = String(formData.get('restorationLength') ?? '').trim();
  const restorationDescription = String(formData.get('restorationDescription') ?? '').trim();
  const startingPriceTier = String(formData.get('startingPriceTier') ?? '').trim();
  const depositAmountRaw = String(formData.get('depositAmount') ?? '').trim();
  const date = String(formData.get('date') ?? '').trim();
  const timeWindow = String(formData.get('timeWindow') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();
  const addOnsJson = formData.get('addOns');
  const files = extractFiles(formData);

  if (!name || !email || !phone || !service || !date || !timeWindow || !clientType) {
    return { ok: false, message: 'Missing required fields' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, message: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  if (phone.length > MAX_PHONE_LENGTH) {
    return { ok: false, message: `Phone must be ${MAX_PHONE_LENGTH} characters or fewer.` };
  }

  if (notes.length > MAX_NOTES_LENGTH) {
    return { ok: false, message: `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.` };
  }

  if (!ALLOWED_CLIENT_TYPES.has(clientType)) {
    return { ok: false, message: 'Invalid client type.' };
  }

  if (!ALLOWED_SERVICES.has(service)) {
    return { ok: false, message: 'Invalid service selection.' };
  }

  const expectedServiceCategory = serviceCategories[service] ?? '';
  if (!expectedServiceCategory) {
    return { ok: false, message: 'Invalid service category.' };
  }

  if (serviceCategory && serviceCategory !== expectedServiceCategory) {
    return { ok: false, message: 'Service category mismatch.' };
  }

  const serviceUsesLengthPricing = LENGTH_PRICED_SERVICE_IDS.has(service);
  const serviceIsRestoration = RESTORATION_SERVICE_IDS.has(service);
  const serviceIsTakeDownDetangle = service === 'loc-take-down-detangle';
  let validatedHairLength = '';
  let validatedTakeDownLocLength = '';
  let validatedTakeDownDensity = '';
  let validatedTakeDownInstalled = '';
  let validatedTakeDownNotes = '';
  let validatedStartingPriceTier = '';
  let validatedRestorationLocCount: number | null = null;
  let validatedRestorationLength = '';
  let validatedRestorationDescription = '';

  if (serviceUsesLengthPricing) {
    if (!hairLength || !ALLOWED_HAIR_LENGTHS.has(hairLength)) {
      return { ok: false, message: 'Please select a valid hair/loc length.' };
    }

    validatedHairLength = hairLength;
    validatedStartingPriceTier = hairLengthStartingPrices[hairLength] ?? '';

    if (!validatedStartingPriceTier) {
      return { ok: false, message: 'Invalid starting price tier.' };
    }

    if (startingPriceTier && startingPriceTier !== validatedStartingPriceTier) {
      return { ok: false, message: 'Starting price tier mismatch.' };
    }
  } else if (serviceIsTakeDownDetangle) {
    if (!takeDownLocLength || !ALLOWED_HAIR_LENGTHS.has(takeDownLocLength)) {
      return { ok: false, message: 'Please select an approximate loc length.' };
    }

    if (!takeDownDensity) {
      return { ok: false, message: 'Please share the approximate density/fullness.' };
    }

    if (!takeDownInstalled) {
      return { ok: false, message: 'Please share how long the locs have been installed.' };
    }

    if (!takeDownNotes) {
      return { ok: false, message: 'Please add condition or buildup notes.' };
    }

    validatedTakeDownLocLength = takeDownLocLength;
    validatedTakeDownDensity = takeDownDensity;
    validatedTakeDownInstalled = takeDownInstalled;
    validatedTakeDownNotes = takeDownNotes;
    validatedStartingPriceTier = fixedServiceStartingPrices[service] ?? '';

    if (!validatedStartingPriceTier) {
      return { ok: false, message: 'Invalid starting price tier.' };
    }

    if (startingPriceTier && startingPriceTier !== validatedStartingPriceTier) {
      return { ok: false, message: 'Starting price tier mismatch.' };
    }
  } else {
    if (hairLength) {
      return { ok: false, message: 'Hair/loc length is not required for this service.' };
    }

    if (serviceIsRestoration) {
      const restorationLocCount = Number(restorationLocCountRaw);
      if (!Number.isInteger(restorationLocCount) || restorationLocCount < 1 || restorationLocCount > MAX_RESTORATION_LOC_COUNT) {
        return { ok: false, message: 'Please enter a valid estimated number of locs.' };
      }

      if (restorationLength && !ALLOWED_HAIR_LENGTHS.has(restorationLength)) {
        return { ok: false, message: 'Please select a valid approximate loc length.' };
      }

      validatedRestorationLocCount = restorationLocCount;
      validatedRestorationLength = restorationLength;
      validatedRestorationDescription = restorationDescription;
      validatedStartingPriceTier = RESTORATION_STARTING_PRICE_PER_LOC;

      if (startingPriceTier && startingPriceTier !== validatedStartingPriceTier) {
        return { ok: false, message: 'Starting price tier mismatch.' };
      }
    } else {
      validatedStartingPriceTier = fixedServiceStartingPrices[service] ?? '';
      if (startingPriceTier && startingPriceTier !== validatedStartingPriceTier) {
        return { ok: false, message: 'Starting price tier mismatch.' };
      }
    }
  }

  const validatedDepositAmount = 25;
  if (depositAmountRaw && Number(depositAmountRaw) !== validatedDepositAmount) {
    return { ok: false, message: 'Invalid booking deposit amount.' };
  }

  const validatedMinimumAppointmentTotal = RESTORATION_MINIMUM_APPOINTMENT_TOTAL;
  if (!isValidDate(date)) {
    return { ok: false, message: 'Invalid preferred date.' };
  }

  if (!ALLOWED_TIME_WINDOWS.has(timeWindow)) {
    return { ok: false, message: 'Invalid preferred day and time.' };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: 'Invalid email address.' };
  }

  if (!isValidPhone(phone)) {
    return { ok: false, message: 'Invalid phone number.' };
  }

  const addOns = parseAddOns(typeof addOnsJson === 'string' ? addOnsJson : null);
  if (addOns === null) {
    return { ok: false, message: 'Invalid add-ons selection.' };
  }

  if ((clientType === 'new' || serviceIsRestoration) && files.length === 0) {
    return {
      ok: false,
      message: serviceIsRestoration
        ? 'Please upload photos of the locs that need repair so Nya can review the condition and planning details.'
        : 'New clients must upload photos/video of their hair so Nya can see your hair texture and condition.',
    };
  }

  if (files.length > 0) {
    const fileError = validateFiles(files);
    if (fileError) {
      return { ok: false, message: fileError };
    }
  }

  return {
    ok: true,
    booking: {
      clientType,
      service,
      serviceCategory: expectedServiceCategory,
      hairLength: validatedHairLength,
      takeDownLocLength: validatedTakeDownLocLength,
      takeDownDensity: validatedTakeDownDensity,
      takeDownInstalled: validatedTakeDownInstalled,
      takeDownNotes: validatedTakeDownNotes,
      restorationLocCount: validatedRestorationLocCount,
      restorationLength: validatedRestorationLength,
      restorationDescription: validatedRestorationDescription,
      startingPriceTier: validatedStartingPriceTier,
      depositAmount: validatedDepositAmount,
      minimumAppointmentTotal: serviceIsRestoration
        ? validatedMinimumAppointmentTotal
        : validatedDepositAmount,
      date,
      timeWindow,
      name,
      email,
      phone,
      notes,
      addOns,
      files,
    },
  };
}

export function sanitizeFilename(filename: string): string {
  const base = filename.replace(/[/\\]/g, '_').replace(/\.\./g, '_').trim();
  return base.slice(0, 200) || 'upload';
}
