import { put } from '@vercel/blob';
import { PendingBookingDraft } from './types';

export interface StoredBookingDraft {
  draftPath: string;
  draftUrl: string;
}

export async function saveBookingDraft(draft: PendingBookingDraft): Promise<StoredBookingDraft> {
  const blob = await put(`bookings/drafts/${draft.id}.json`, JSON.stringify(draft), {
    access: 'public',
    contentType: 'application/json',
  });

  return {
    draftPath: blob.pathname,
    draftUrl: blob.downloadUrl || blob.url,
  };
}

export async function updateBookingDraft(draftPath: string, draft: PendingBookingDraft): Promise<string> {
  const blob = await put(draftPath, JSON.stringify(draft), {
    access: 'public',
    contentType: 'application/json',
  });

  return blob.downloadUrl || blob.url;
}

export async function loadBookingDraft(draftUrl: string): Promise<PendingBookingDraft | null> {
  const response = await fetch(draftUrl);
  if (!response.ok) {
    return null;
  }

  return (await response.json()) as PendingBookingDraft;
}

export async function uploadBookingPhotos(files: File[], bookingId: string): Promise<string[]> {
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120) || 'upload';
      const blob = await put(`bookings/photos/${bookingId}/${fileName}`, file, {
        access: 'private',
        contentType: file.type || 'application/octet-stream',
      });
      return blob.downloadUrl || blob.url;
    })
  );

  return uploadResults;
}
