import { del, list, put } from '@vercel/blob';
import { sanitizeFilename } from './validate';
import type { BookingDraft, EmailAttachment, ValidatedBooking } from './types';

const DRAFT_PREFIX = 'pending-bookings';
const PROCESSED_PREFIX = 'stripe-processed';

function manifestPath(bookingId: string): string {
  return `${DRAFT_PREFIX}/${bookingId}/manifest.json`;
}

export async function saveBookingDraft(
  bookingId: string,
  booking: ValidatedBooking
): Promise<BookingDraft> {
  const fileRefs = [];

  for (let index = 0; index < booking.files.length; index++) {
    const file = booking.files[index];
    const filename = sanitizeFilename(file.name);
    const pathname = `${DRAFT_PREFIX}/${bookingId}/files/${index}-${filename}`;
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });
    fileRefs.push({
      url: blob.url,
      filename,
      contentType: file.type,
    });
  }

  const draft: BookingDraft = {
    id: bookingId,
    createdAt: new Date().toISOString(),
    clientType: booking.clientType,
    service: booking.service,
    date: booking.date,
    timeWindow: booking.timeWindow,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    notes: booking.notes,
    addOns: booking.addOns,
    files: fileRefs,
    emailsSent: false,
  };

  await put(manifestPath(bookingId), JSON.stringify(draft), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });

  return draft;
}

export async function loadBookingDraft(
  bookingId: string
): Promise<BookingDraft | null> {
  const prefix = `${DRAFT_PREFIX}/${bookingId}/`;
  const blobs = await list({ prefix });
  const manifestBlob = blobs.blobs.find((blob) =>
    blob.pathname.endsWith('/manifest.json')
  );
  if (!manifestBlob) {
    return null;
  }

  const response = await fetch(manifestBlob.url);
  if (!response.ok) {
    return null;
  }

  return (await response.json()) as BookingDraft;
}

export async function markDraftEmailsSent(bookingId: string): Promise<void> {
  const draft = await loadBookingDraft(bookingId);
  if (!draft) {
    return;
  }

  draft.emailsSent = true;
  await put(manifestPath(bookingId), JSON.stringify(draft), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

export async function loadDraftAttachments(
  draft: BookingDraft
): Promise<EmailAttachment[]> {
  const attachments: EmailAttachment[] = [];

  for (const fileRef of draft.files) {
    const response = await fetch(fileRef.url);
    if (!response.ok) {
      throw new Error(`Failed to load uploaded file: ${fileRef.filename}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    attachments.push({
      filename: fileRef.filename,
      content: Buffer.from(arrayBuffer),
    });
  }

  return attachments;
}

export function draftToValidatedBooking(draft: BookingDraft): ValidatedBooking {
  return {
    clientType: draft.clientType,
    service: draft.service,
    date: draft.date,
    timeWindow: draft.timeWindow,
    name: draft.name,
    email: draft.email,
    phone: draft.phone,
    notes: draft.notes,
    addOns: draft.addOns,
    files: [],
  };
}

export async function deleteBookingDraft(bookingId: string): Promise<void> {
  const prefix = `${DRAFT_PREFIX}/${bookingId}/`;
  const blobs = await list({ prefix });
  if (blobs.blobs.length === 0) {
    return;
  }
  await del(blobs.blobs.map((blob) => blob.url));
}

export async function isStripeEventProcessed(eventId: string): Promise<boolean> {
  const prefix = `${PROCESSED_PREFIX}/${eventId}`;
  const blobs = await list({ prefix, limit: 1 });
  return blobs.blobs.length > 0;
}

export async function markStripeEventProcessed(eventId: string): Promise<void> {
  await put(`${PROCESSED_PREFIX}/${eventId}.json`, JSON.stringify({ processedAt: new Date().toISOString() }), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}
