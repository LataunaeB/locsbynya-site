import { Resend } from 'resend';
import { addOnNames, serviceNames } from './constants';
import type { EmailAttachment, ValidatedBooking } from './types';

const apiKey = process.env.RESEND_API_KEY?.trim();
const fromEmail = process.env.FROM_EMAIL?.trim();

const resend = apiKey ? new Resend(apiKey) : null;

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

function formatDateForEmail(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(resend && fromEmail);
}

export async function sendBookingEmails(
  booking: ValidatedBooking,
  attachments: EmailAttachment[]
): Promise<void> {
  if (!resend || !fromEmail) {
    throw new Error('Email service is not configured');
  }

  const {
    clientType,
    service,
    date,
    timeWindow,
    name,
    email,
    phone,
    notes,
    addOns: addOnsArray,
    files,
  } = booking;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeNotes = escapeHtml(notes);
  const safeTimeWindow = escapeHtml(timeWindow);
  const serviceName = escapeHtml(serviceNames[service]);
  const formattedDate = escapeHtml(formatDateForEmail(date));
  const addOnsDisplay =
    addOnsArray.map((key) => escapeHtml(addOnNames[key])).join(', ') || 'None';
  const clientTypeLabel =
    clientType === 'new' ? 'New Client' : 'Returning Client';

  const fileCount = files.length > 0 ? files.length : attachments.length;

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
              <p style="margin: 10px 0 0 0;">Appointment Confirmed ✓</p>
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
                ${addOnsArray.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${clientType === 'new' && fileCount > 0 ? `<p><strong>Files Uploaded:</strong> Yes (${fileCount} file${fileCount > 1 ? 's' : ''})</p>` : ''}
                ${notes ? `<p><strong>Notes:</strong> ${safeNotes}</p>` : ''}
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
                ${addOnsArray.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${notes ? `<p><strong>Notes:</strong> ${safeNotes}</p>` : ''}
                ${clientType === 'new' ? `<p><strong>Files Uploaded:</strong> ${fileCount > 0 ? `Yes (${fileCount} file${fileCount > 1 ? 's' : ''}) - See attachments below` : 'No'}</p>` : ''}
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
    to: email,
    subject: 'Appointment Confirmed - Locs by Nya',
    html: clientEmailHtml,
  });

  await resend.emails.send({
    from: fromEmail,
    to: 'locsbynya@locsbynya.com',
    subject: `New Appointment Confirmed: ${sanitizeSubjectPart(name)} - ${serviceNames[service]}`,
    html: nyaEmailHtml,
    attachments:
      attachments.length > 0
        ? attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
          }))
        : undefined,
  });
}
