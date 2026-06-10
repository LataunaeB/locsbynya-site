import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY?.trim();
const fromEmail = process.env.FROM_EMAIL?.trim();

if (!apiKey) {
  console.error('RESEND_API_KEY is not set');
}
if (!fromEmail) {
  console.error('FROM_EMAIL is not set');
}

const resend = apiKey ? new Resend(apiKey) : null;

export async function POST(request: NextRequest) {
  try {
    if (!resend || !fromEmail) {
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    
    // Extract form fields
    const clientType = formData.get('clientType') as string;
    const service = formData.get('service') as string;
    const date = formData.get('date') as string;
    const timeWindow = formData.get('timeWindow') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const notes = formData.get('notes') as string || '';
    const hasFiles = formData.get('hasFiles') === 'true';

    // Extract all uploaded files
    const files: File[] = [];
    const fileEntries = formData.getAll('hairFiles');
    for (const entry of fileEntries) {
      if (entry instanceof File) {
        files.push(entry);
      }
    }

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !timeWindow) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate new client requirements: must have files
    if (clientType === 'new' && !hasFiles) {
      return NextResponse.json(
        { message: 'New clients must upload photos/video of their hair so Nya can see your hair texture and condition.' },
        { status: 400 }
      );
    }

    // Format the service name for display
    const serviceNames: { [key: string]: string } = {
      'new-client-consultation': 'New Client Consultation',
      'kids-starter-locs': 'Kids · Starter Locs (Ages 2–12)',
      'kids-retwist-style': 'Kids · Retwist + Style',
      'kids-takedown': 'Kids · Loc Take Down + Detangle',
      'teens-adults-starter-locs': 'Teens & Adults · Starter Locs (13+)',
      'teens-adults-retwist': 'Teens & Adults · Retwist & Maintenance',
      'teens-adults-repair': 'Teens & Adults · Repair / Deep Care',
    };

    // Format add-on names for display
    const addOnNames: { [key: string]: string } = {
      'loc-detox': 'Loc Detox (+$30)',
      'loc-oil-treatment': 'Loc Oil Treatment (+$25)',
      'scalp-treatment': 'Scalp Treatment (+$30)',
      'loc-repair': 'Loc Repair / Re-attachment (+$15 each)',
      'style-add-ons': 'Style Add Ons',
      'loc-color': 'Loc Color Enhancement (starting at $40+)',
      'house-call': 'House Call (+$60+)',
      'late-night-early-morning': 'Late Night / Early Morning Slot (by request only)',
    };

    const serviceName = serviceNames[service] || service;
    const addOnsJson = formData.get('addOns') as string;
    const addOnsArray: string[] = addOnsJson ? JSON.parse(addOnsJson) : [];
    const addOnsDisplay = addOnsArray.map((key) => addOnNames[key] || key).join(', ') || 'None';
    const clientTypeLabel = clientType === 'new' ? 'New Client' : 'Returning Client';

    // Email to client (confirmation)
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
              <p>Hi ${name},</p>
              <p><strong>Your appointment is confirmed!</strong> Thank you for booking with Locs by Nya. We're looking forward to seeing you.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #4F2F18;">Appointment Details</h3>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${timeWindow}</p>
                <p><strong>Client Type:</strong> ${clientTypeLabel}</p>
                ${addOnsArray.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${clientType === 'new' && hasFiles ? `<p><strong>Files Uploaded:</strong> Yes (${files.length} file${files.length > 1 ? 's' : ''})</p>` : ''}
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
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

    // Email to Nya (notification)
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
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Client Type:</strong> ${clientTypeLabel}</p>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #4F2F18;">Appointment Details</h3>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${timeWindow}</p>
                ${addOnsArray.length > 0 ? `<p><strong>Add-ons & Extras:</strong> ${addOnsDisplay}</p>` : ''}
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                ${clientType === 'new' ? `<p><strong>Files Uploaded:</strong> ${hasFiles ? `Yes (${files.length} file${files.length > 1 ? 's' : ''}) - See attachments below` : 'No'}</p>` : ''}
              </div>
            </div>
            <div class="footer">
              <p>Locs by Nya Booking System</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Prepare file attachments for Nya's email
    const attachments = files.map((file) => {
      return {
        filename: file.name,
        content: file as any, // Resend will handle the File object
      };
    });

    // Send email to client (no attachments)
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Appointment Confirmed - Locs by Nya',
      html: clientEmailHtml,
    });

    // Send notification email to Nya (with file attachments if any)
    await resend.emails.send({
      from: fromEmail,
      to: 'locsbynya@locsbynya.com',
      subject: `New Appointment Confirmed: ${name} - ${serviceName}`,
      html: nyaEmailHtml,
      attachments: files.length > 0 ? await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return {
            filename: file.name,
            content: buffer,
          };
        })
      ) : undefined,
    });

    return NextResponse.json(
      { message: 'Appointment request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}

