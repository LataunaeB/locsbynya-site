export type ValidatedBooking = {
  clientType: string;
  service: string;
  serviceCategory: string;
  hairLength: string;
  takeDownLocLength: string;
  takeDownDensity: string;
  takeDownInstalled: string;
  takeDownNotes: string;
  restorationLocCount: number | null;
  restorationLength: string;
  restorationDescription: string;
  startingPriceTier: string;
  depositAmount: number;
  minimumAppointmentTotal: number;
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
  pathname: string;
  filename: string;
  contentType: string;
  url?: string;
};

export type BookingDraft = {
  id: string;
  createdAt: string;
  completedAt?: string;
  clientType: string;
  service: string;
  serviceCategory: string;
  hairLength: string;
  takeDownLocLength: string;
  takeDownDensity: string;
  takeDownInstalled: string;
  takeDownNotes: string;
  restorationLocCount: number | null;
  restorationLength: string;
  restorationDescription: string;
  startingPriceTier: string;
  depositAmount: number;
  minimumAppointmentTotal: number;
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

export type PendingBookingDraft = {
  id: string;
  createdAt: string;
  clientType: string;
  service: string;
  serviceCategory?: string;
  hairLength?: string;
  takeDownLocLength?: string;
  takeDownDensity?: string;
  takeDownInstalled?: string;
  takeDownNotes?: string;
  restorationLocCount?: number | null;
  restorationLength?: string;
  restorationDescription?: string;
  startingPriceTier?: string;
  depositAmount?: number;
  minimumAppointmentTotal?: number;
  date: string;
  timeWindow: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  addOns: string[];
  files?: StoredFileRef[];
  paymentStatus?: 'pending' | 'paid';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  photoUrls?: string[];
};
