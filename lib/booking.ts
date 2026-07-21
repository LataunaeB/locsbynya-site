import { Resend } from 'resend';

export type BookingDetails = {
  clientType: 'new' | 'returning';
  service: string;
  date: string;
  timeWindow: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  addOns: string[];
};

export type BookingAttachment = {
  filename: string;
  contentType: string;
  base64: string;
  size: number;
};

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 30;
const MAX_NOTES_LENGTH = 2000;
const MAX_FILES = 5;
const MAX_TOTAL_FILE_BYTES = 10 * 1024 * 1024;

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

export const serviceNames: Record<string, string> = {
  'starter-locs': 'Starter Locs',
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

const ALLOWED_FILE_TYPES = new Set([
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeSubjectPart(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

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

function formatDateForEmail(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function sanitizeFilename(filename: string): string {
  const base = filename.replace(/[/\\]/g, '_').replace(/\.\./g, '_').trim();
  return base.slice(0, 200) || 'upload';
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

export async function parseBookingFormData(formData: FormData): Promise<{ booking: BookingDetails; attachments: BookingAttachment[] } | { error: string }> {
  const clientType = String(formData.get('clientType') ?? '').trim();
  const service = String(formData.get('service') ?? '').trim();
  const date = String(formData.get('date') ?? '').trim();
  const timeWindow = String(formData.get('timeWindow') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();
  const addOnsJson = String(formData.get('addOns') ?? '[]');

  const hairFiles: File[] = [];
  const fileEntries = formData.getAll('hairFiles');
  for (const entry of fileEntries) {
    if (entry instanceof File && entry.size > 0) {
      hairFiles.push(entry);
    }
  }

  if (!name || !email || !phone || !service || !date || !timeWindow || !clientType) {
    return { error: 'Missing required fields.' };
  }

  if (!ALLOWED_CLIENT_TYPES.has(clientType)) {
    return { error: 'Invalid client type.' };
  }

  if (!ALLOWED_SERVICES.has(service)) {
    return { error: 'Invalid service selection.' };
  }

  if (!isValidDate(date)) {
    return { error: 'Invalid preferred date.' };
  }

  if (!ALLOWED_TIME_WINDOWS.has(timeWindow)) {
    return { error: 'Invalid preferred day and time.' };
  }

  if (!isValidEmail(email)) {
    return { error: 'Invalid email address.' };
  }

  if (!isValidPhone(phone)) {
    return { error: 'Invalid phone number.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  if (phone.length > MAX_PHONE_LENGTH) {
    return { error: `Phone must be ${MAX_PHONE_LENGTH} characters or fewer.` };
  }

  if (notes.length > MAX_NOTES_LENGTH) {
    return { error: `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.` };
  }

  let addOns: string[];
  try {
    const parsed = JSON.parse(addOnsJson);
    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
      throw new Error('Invalid');
    }
    addOns = parsed;
  } catch {
    return { error: 'Invalid add-ons selection.' };
  }

  if (!addOns.every((item) => ALLOWED_ADD_ONS.has(item))) {
    return { error: 'Invalid add-ons selection.' };
  }

  if (clientType === 'new' && hairFiles.length === 0) {
    return { error: 'New clients must upload photos/video of their hair so Nya can see your hair texture and condition.' };
  }

  if (hairFiles.length > 0) {
    const fileError = validateFiles(hairFiles);
    if (fileError) {
      return { error: fileError };
    }
  }

  const attachments: BookingAttachment[] = [];
  for (const file of hairFiles) {
    const arrayBuffer = await file.arrayBuffer();
    attachments.push({
      filename: sanitizeFilename(file.name),
      contentType: file.type,
      base64: Buffer.from(arrayBuffer).toString('base64'),
      size: file.size,
    });
  }

  return {
    booking: {
      clientType: clientType as 'new' | 'returning',
      service,
      date,
      timeWindow,
      name,
      email,
      phone,
      notes,
      addOns,
    },
    attachments,
  };
}

export async function sendBookingEmails(booking: BookingDetails, attachments: BookingAttachment[]) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.FROM_EMAIL?.trim();

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  if (!fromEmail) {
    throw new Error('FROM_EMAIL is not configured.');
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(booking.name);
  const safeEmail = escapeHtml(booking.email);
  const safePhone = escapeHtml(booking.phone);
  const safeNotes = escapeHtml(booking.notes);
  const safeTimeWindow = escapeHtml(booking.timeWindow);
  const serviceName = escapeHtml(serviceNames[booking.service]);
  const formattedDate = escapeHtml(formatDateForEmail(booking.date));
  const addOnsDisplay = booking.addOns.map((key) => escapeHtml(addOnNames[key])).join(', ') || 'None';
  const clientTypeLabel = booking.clientType === 'new' ? 'New Client' : 'Returning Client';

  const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1F1713; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0FA1B2 0%, #7A4B27 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #FDF4E3; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #0FA1B2; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #7A4B27; font-size: 12px; }
            .button { display: inline-block; background: #0FA1B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Locs by Nya</h1>
              <p style="margin: 10px 0 0 0;"><strong>Your appointment is confirmed!</strong> Thank you for booking with Locs by Nya. We're looking forward to seeing you.</p>
            </div>
            <div class="content">
              <p>Hi ${safeName},</p>
              <p><strong>Your appointment is confirmed!</strong> Thank you for booking with Locs by Nya. We're looking forward to seeing you.</p>
              <div class="info-box">
                <h3 style="margin-top: 0; color: #4F2F18;">Appointment Details</h3>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${safeTimeWindow}</p>
                <p><strong>Client Type:</strong> ${clientTypeLabel}</p>
                ${booking.addOns.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${booking.clientType === 'new' && attachments.length > 0 ? `<p><strong>Files Uploaded:</strong> Yes (${attachments.length} file${attachments.length > 1 ? 's' : ''})</p>` : ''}
                ${booking.notes ? `<p><strong>Notes:</strong> ${safeNotes}</p>` : ''}
              </div>
              <div class="info-box" style="background: #FFF9F1; border-left-color: #7A4B27;">
                <p style="margin: 0;"><strong>$25 Security Deposit Required</strong></p>
                <p style="margin: 5px 0 0 0;">A $25 security deposit is required to hold your appointment. The deposit goes toward your total and is non-refundable for late cancellations or no-shows.</p>
              </div>
              <p>If you need to reschedule or have any questions, please reach out as soon as possible. We look forward to seeing you!</p>
              <p>Best regards,<br>Nya<br>Locs by Nya</p>
            </div>
            <div class="footer">
              <p>Locs by Nya · Los Angeles, CA</p>
              <p>By-appointment only</p>
            </div>
          </div>
        </body>
      </html>
    `;

  const nyaEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1F1713; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0FA1B2 0%, #7A4B27 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #FDF4E3; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #0FA1B2; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #7A4B27; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Appointment Confirmed</h1>
            </div>
            <div class="content">
              <p><strong>A new appointment has been automatically confirmed:</strong></p>
              <div class="info-box">
                <h3 style="margin-top: 0; color: #4F2F18;">Client Information</h3>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Phone:</strong> ${safePhone}</p>
                <p><strong>Client Type:</strong> ${clientTypeLabel}</p>
              </div>
              <div class="info-box">
                <h3 style="margin-top: 0; color: #4F2F18;">Appointment Details</h3>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${safeTimeWindow}</p>
                ${booking.addOns.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${booking.notes ? `<p><strong>Notes:</strong> ${safeNotes}</p>` : ''}
                ${booking.clientType === 'new' ? `<p><strong>Files Uploaded:</strong> ${attachments.length > 0 ? `Yes (${attachments.length} file${attachments.length > 1 ? 's' : ''}) - See attachments below` : 'No'}</p>` : ''}
              </div>
            </div>
            <div class="footer">
              <p>Locs by Nya Booking System</p>
            </div>
          </div>
        </body>
      </html>
    `;

  await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: 'Appointment Confirmed - Locs by Nya',
    html: clientEmailHtml,
  });

  await resend.emails.send({
    from: fromEmail,
    to: 'locsbynya@locsbynya.com',
    subject: `New Appointment Confirmed: ${sanitizeSubjectPart(booking.name)} - ${serviceNames[booking.service]}`,
    html: nyaEmailHtml,
    attachments: attachments.length > 0 ? attachments.map((file) => ({
      filename: file.filename,
      content: Buffer.from(file.base64, 'base64'),
    })) : undefined,
  });
}
