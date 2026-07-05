export type ValidatedBooking = {
  clientType: string;
  service: string;
  date: string;
  timeWindow: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  addOns: string[];
  files: File[];
};

export type StoredFileRef = {
  url: string;
  filename: string;
  contentType: string;
};

export type BookingDraft = {
  id: string;
  createdAt: string;
  clientType: string;
  service: string;
  date: string;
  timeWindow: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  addOns: string[];
  files: StoredFileRef[];
  emailsSent?: boolean;
};

export type EmailAttachment = {
  filename: string;
  content: Buffer;
};
