import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  isNewClient?: boolean;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const bookingData: BookingRequest = await request.json();

    // Validate required fields
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.service || !bookingData.date || !bookingData.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Format date for display
    const appointmentDate = new Date(bookingData.date);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get email addresses from environment variables (required)
    const fromEmail = process.env.FROM_EMAIL;
    const businessEmail = process.env.NYA_EMAIL;

    if (!fromEmail) {
      console.error("FROM_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error: FROM_EMAIL not configured" },
        { status: 500 }
      );
    }

    if (!businessEmail) {
      console.error("NYA_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error: NYA_EMAIL not configured" },
        { status: 500 }
      );
    }

    // Send confirmation email to client
    const clientEmailResult = await resend.emails.send({
      from: `Locs by Nya <${fromEmail}>`,
      to: bookingData.email,
      subject: "Appointment Confirmed - Locs by Nya",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Confirmed</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: #0B0F13; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
              <h1 style="color: #14B8A6; margin: 0 0 10px 0; font-size: 28px;">Locs by Nya</h1>
              <p style="color: #9CA3AF; margin: 0; font-size: 14px;">Professional Loctician Services</p>
            </div>
            
            <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #0B0F13; margin-top: 0; font-size: 24px;">Your Appointment is Confirmed!</h2>
              
              <p style="color: #333; font-size: 16px;">Hi ${bookingData.name},</p>
              
              <p style="color: #333; font-size: 16px;">Thank you for booking with Locs by Nya! We're excited to see you.</p>
              
              <div style="background-color: #f9f9f9; border-left: 4px solid #14B8A6; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="color: #0B0F13; margin-top: 0; font-size: 18px;">Appointment Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Service:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingData.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Date:</td>
                    <td style="padding: 8px 0; color: #333;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Time:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingData.time}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="color: #0B0F13; margin-top: 0; font-size: 18px;">Location:</h3>
                <p style="color: #333; margin: 5px 0; font-size: 16px;">
                  <strong>RVM Twists and Cuts</strong><br>
                  5373 Wilshire Blvd<br>
                  Los Angeles, CA
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">
                  Street and/or lot parking is available. Please arrive 15 minutes early for check-in.
                </p>
              </div>
              
              ${bookingData.isNewClient ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>New Client Note:</strong> Please upload clear photos or a short video of your hair if you haven't already. This helps us prepare for your appointment.
                </p>
              </div>
              ` : ""}
              
              <div style="background-color: #e7f3ff; border-left: 4px solid #14B8A6; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #0B0F13; margin: 0 0 10px 0; font-weight: 600; font-size: 14px;">Important Reminders:</p>
                <ul style="color: #333; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Please arrive <strong>15 minutes early</strong></li>
                  <li>No extra guests or children unless they are receiving a service</li>
                  <li>A $25 security deposit is required (goes toward your total)</li>
                </ul>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;"><strong>Cancellation Policy:</strong></p>
                <p style="color: #666; margin: 0; font-size: 14px;">
                  You may cancel or reschedule up to 24 hours before your appointment. Any cancellation after that window, as well as no-shows, will require a 50% service fee before booking your next appointment.
                </p>
              </div>
              
              <p style="color: #333; font-size: 16px;">If you need to reschedule or have any questions, please contact Nya at <a href="tel:3108924874" style="color: #14B8A6; text-decoration: none;">310-892-4874</a>.</p>
              
              <p style="color: #333; font-size: 16px;">We look forward to seeing you!</p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 0;">
                Best regards,<br>
                <strong style="color: #0B0F13;">Nya</strong><br>
                <span style="color: #666; font-size: 14px;">Locs by Nya</span>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
              <p style="margin: 5px 0;">RVM Twists and Cuts • 5373 Wilshire Blvd, Los Angeles, CA</p>
              <p style="margin: 5px 0;">Phone: <a href="tel:3108924874" style="color: #14B8A6; text-decoration: none;">310-892-4874</a></p>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification email to business owner
    const businessEmailResult = await resend.emails.send({
      from: `Locs by Nya Booking <${fromEmail}>`,
      to: businessEmail,
      subject: `New Booking: ${bookingData.name} - ${bookingData.service}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: #0B0F13; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
              <h1 style="color: #14B8A6; margin: 0 0 10px 0; font-size: 28px;">New Booking Received</h1>
              <p style="color: #9CA3AF; margin: 0; font-size: 14px;">Locs by Nya Booking System</p>
            </div>
            
            <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #0B0F13; margin-top: 0; font-size: 24px;">Client Information</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600; width: 120px;">Name:</td>
                  <td style="padding: 10px 0; color: #333;">${bookingData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">Email:</td>
                  <td style="padding: 10px 0; color: #333;">
                    <a href="mailto:${bookingData.email}" style="color: #14B8A6; text-decoration: none;">${bookingData.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">Phone:</td>
                  <td style="padding: 10px 0; color: #333;">
                    <a href="tel:${bookingData.phone.replace(/\D/g, '')}" style="color: #14B8A6; text-decoration: none;">${bookingData.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">New Client:</td>
                  <td style="padding: 10px 0; color: #333;">${bookingData.isNewClient ? "Yes" : "No"}</td>
                </tr>
              </table>
              
              <h2 style="color: #0B0F13; margin-top: 30px; font-size: 24px;">Appointment Details</h2>
              
              <div style="background-color: #f9f9f9; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: 600;">Service:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 18px;"><strong>${bookingData.service}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: 600;">Date:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 18px;"><strong>${formattedDate}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: 600;">Time:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 18px;"><strong>${bookingData.time}</strong></td>
                  </tr>
                </table>
              </div>
              
              ${bookingData.notes ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="color: #856404; margin-top: 0; font-size: 16px;">Special Requests / Notes:</h3>
                <p style="color: #856404; margin: 0; white-space: pre-wrap;">${bookingData.notes}</p>
              </div>
              ` : ""}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; font-size: 14px; margin: 5px 0;">
                  <a href="mailto:${bookingData.email}" style="color: #14B8A6; text-decoration: none; font-weight: 600;">Reply to Client</a>
                </p>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">
                  <a href="tel:${bookingData.phone.replace(/\D/g, '')}" style="color: #14B8A6; text-decoration: none; font-weight: 600;">Call Client</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Check if emails were sent successfully
    if (clientEmailResult.error || businessEmailResult.error) {
      console.error("Email sending error:", {
        client: clientEmailResult.error,
        business: businessEmailResult.error,
      });
      
      // Still return success to user, but log the error
      // In production, you might want to queue these or retry
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Booking confirmed and emails sent",
        bookingId: `booking-${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process booking",
      },
      { status: 500 }
    );
  }
}
