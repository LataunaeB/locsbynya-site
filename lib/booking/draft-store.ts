import { del, get, list, put } from '@vercel/blob';
import { sanitizeFilename } from './validate';
import type { BookingDraft, EmailAttachment, ValidatedBooking, StoredFileRef } from './types';

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
      access: 'private',
      contentType: file.type,
      addRandomSuffix: false,
    });
    fileRefs.push({
      pathname,
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
    serviceCategory: booking.serviceCategory,
    hairLength: booking.hairLength,
    startingPriceTier: booking.startingPriceTier,
    depositAmount: booking.depositAmount,
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
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
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

  const result = await get(manifestBlob.pathname, {
    access: 'private',
    useCache: false,
  });
  if (!result) {
    return null;
  }

  const rawBody = await new Response(result.stream).text();
  return JSON.parse(rawBody) as BookingDraft;
}

export async function markDraftEmailsSent(bookingId: string): Promise<void> {
  const draft = await loadBookingDraft(bookingId);
  if (!draft) {
    return;
  }

  draft.emailsSent = true;
  draft.completedAt = draft.completedAt ?? new Date().toISOString();
  await put(manifestPath(bookingId), JSON.stringify(draft), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function isBookingDraftCompleted(draft: BookingDraft): boolean {
  return Boolean(draft.completedAt || draft.emailsSent);
}

export async function loadDraftAttachments(
  draft: BookingDraft
): Promise<EmailAttachment[]> {
  const attachments: EmailAttachment[] = [];

  for (const fileRef of draft.files) {
    const source = fileRef.pathname ?? fileRef.url;
    if (!source) {
      throw new Error(`Missing file path for uploaded file: ${fileRef.filename}`);
    }

    const result = await get(source, {
      access: 'private',
      useCache: false,
    });

    if (!result) {
      throw new Error(`Failed to load uploaded file: ${fileRef.filename}`);
    }

    const arrayBuffer = await new Response(result.stream).arrayBuffer();
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
    serviceCategory: draft.serviceCategory,
    hairLength: draft.hairLength,
    startingPriceTier: draft.startingPriceTier,
    depositAmount: draft.depositAmount,
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
  await del(blobs.blobs.map((blob) => blob.pathname));
}

export async function isStripeEventProcessed(eventId: string): Promise<boolean> {
  const prefix = `${PROCESSED_PREFIX}/${eventId}`;
  const blobs = await list({ prefix, limit: 1 });
  return blobs.blobs.length > 0;
}

export async function markStripeEventProcessed(eventId: string): Promise<void> {
  await put(`${PROCESSED_PREFIX}/${eventId}.json`, JSON.stringify({ processedAt: new Date().toISOString() }), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
