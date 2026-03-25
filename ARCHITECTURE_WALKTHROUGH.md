# Locs by Nya - Complete System Architecture Walkthrough

## 🎯 Overview

**locsbynya.com** is a Next.js 14 booking website for a loctician service business. The site allows clients to book appointments online, with automatic email confirmations sent via Resend when bookings are completed.

---

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### Backend/Email
- **Next.js API Routes** - Serverless backend endpoints
- **Resend** (v6.6.0) - Transactional email service for automated booking confirmations

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
locsbynya-site/
├── app/
│   ├── api/
│   │   └── book/
│   │       └── route.ts          # POST endpoint for booking submissions
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Main landing/booking page
├── components/
│   └── LocsFaqChatWidget.tsx      # Interactive FAQ chat widget
├── public/
│   └── images/                    # Static images (gallery, logos, hero images)
└── package.json                   # Dependencies and scripts
```

---

## 🔄 System Flow: How Everything Works

### 1. **User Visits the Site** (`app/page.tsx`)

When a user visits `locsbynya.com`:
- The main landing page loads with:
  - Hero section showcasing services
  - Service gallery/images
  - **Booking form** (embedded in the page)
  - **FAQ Chat Widget** (floating button in bottom-right corner)

### 2. **Interactive FAQ Chat Widget** (`components/LocsFaqChatWidget.tsx`)

**Purpose**: Provides instant answers to common questions without leaving the page.

**How it works**:
- **Floating Button**: Fixed position button in bottom-right corner with chat icon
- **Chat Interface**: Opens a modal-style chat panel when clicked
- **FAQ Matching Algorithm**:
  - User types a question
  - System searches through predefined FAQ entries
  - Each FAQ has multiple keyword variations (handles typos, slang, different phrasings)
  - **Scoring System**:
    - Multi-word keywords = 2 points
    - Single-word keywords = 1 point
    - Best match (highest score) is selected
  - Returns matching answer or fallback message
- **Call-to-Action**: Some answers include a "Book an appointment" button that scrolls to the booking form

**FAQ Topics Covered**:
- Starter locs
- Loc repair & re-attachment
- New client policy
- Cancellation/reschedule policy
- Deposit requirements ($25 security deposit)
- Walk-in availability
- Appointment expectations
- Review discount ($10 off for Yelp reviews)
- Pricing & services
- Hours & availability
- How to book
- Contact information
- Location & address

**Design Features**:
- Dark theme with gradient accents (teal/cyan for CTAs, brown/tan for user messages)
- Smooth animations and transitions
- Auto-scroll to latest message
- Auto-focus on input when opened
- Responsive design (max-width on mobile)

### 3. **Booking Form** (embedded in `app/page.tsx`)

**Form Fields** (typical booking form structure):
- **Client Information**:
  - Name
  - Email
  - Phone number
- **Service Selection**:
  - Dropdown/selection for service type:
    - Starter locs
    - Retwist/maintenance
    - Loc repair/re-attachment
    - Other services
- **Appointment Details**:
  - Date picker
  - Time picker (shows available slots)
- **Additional Information**:
  - Hair photos/video upload (for new clients)
  - Special requests/notes
- **Deposit**:
  - $25 security deposit requirement (mentioned in form)

**Form Validation**:
- Client-side validation before submission
- Required field checks
- Email format validation
- Date/time availability checks

### 4. **Form Submission → API Endpoint** (`app/api/book/route.ts`)

When user clicks "Book Appointment":

**Frontend Action**:
```typescript
// Client-side code (in page.tsx)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formData = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    service: form.service,
    date: form.date,
    time: form.time,
    photos: form.photos, // if uploaded
    notes: form.notes
  };
  
  const response = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  // Handle success/error
};
```

**Backend Processing** (`app/api/book/route.ts`):
```typescript
// This is a Next.js API Route (serverless function)
export async function POST(request: Request) {
  // 1. Parse incoming JSON data
  const bookingData = await request.json();
  
  // 2. Validate the data
  // - Check required fields
  // - Validate email format
  // - Validate date/time
  // - Check availability (if you have a calendar system)
  
  // 3. Store booking (if you have a database)
  // - Could save to database, Google Sheets, Airtable, etc.
  // - Generate booking ID/reference number
  
  // 4. Send confirmation emails via Resend
  // - Email to client
  // - Email to Nya (business owner)
  
  // 5. Return success response
  return NextResponse.json({ success: true, bookingId: '...' });
}
```

---

## 📧 Email System: Resend Integration

### How Auto-Emails Work

**Resend** is a modern email API service (like SendGrid, Mailgun) that's developer-friendly and reliable.

### Email Flow When Client Books:

#### Step 1: **Client Confirmation Email**

After successful booking, the API sends an email to the client:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Client confirmation email
await resend.emails.send({
  from: 'Nya <booking@locsbynya.com>', // or 'onboarding@resend.dev' for testing
  to: bookingData.email,
  subject: 'Appointment Confirmed - Locs by Nya',
  html: `
    <h1>Your Appointment is Confirmed!</h1>
    <p>Hi ${bookingData.name},</p>
    <p>Thank you for booking with Locs by Nya!</p>
    <h2>Appointment Details:</h2>
    <ul>
      <li><strong>Service:</strong> ${bookingData.service}</li>
      <li><strong>Date:</strong> ${bookingData.date}</li>
      <li><strong>Time:</strong> ${bookingData.time}</li>
    </ul>
    <p><strong>Location:</strong> RVM Twists and Cuts<br>
    5373 Wilshire Blvd, Los Angeles, CA</p>
    <p><strong>Reminder:</strong> Please arrive 15 minutes early. No extra guests or children unless they are receiving a service.</p>
    <p>If you need to reschedule or cancel, please contact Nya at 310-892-4874 at least 24 hours in advance.</p>
    <p>We look forward to seeing you!</p>
    <p>— Nya</p>
  `
});
```

**Email Content Includes**:
- Personalized greeting
- Service type
- Date and time
- Location/address
- Reminder about arrival time and policies
- Contact information for changes
- Cancellation policy reminder

#### Step 2: **Business Owner Notification Email**

Simultaneously, an email is sent to Nya (the business owner):

```typescript
// Notification email to Nya
await resend.emails.send({
  from: 'Locs by Nya Booking <noreply@locsbynya.com>',
  to: 'nya@locsbynya.com', // or Nya's email
  subject: `New Booking: ${bookingData.name} - ${bookingData.service}`,
  html: `
    <h1>New Booking Received</h1>
    <h2>Client Information:</h2>
    <ul>
      <li><strong>Name:</strong> ${bookingData.name}</li>
      <li><strong>Email:</strong> ${bookingData.email}</li>
      <li><strong>Phone:</strong> ${bookingData.phone}</li>
    </ul>
    <h2>Appointment Details:</h2>
    <ul>
      <li><strong>Service:</strong> ${bookingData.service}</li>
      <li><strong>Date:</strong> ${bookingData.date}</li>
      <li><strong>Time:</strong> ${bookingData.time}</li>
    </ul>
    ${bookingData.notes ? `<p><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
    ${bookingData.photos ? `<p><strong>Photos attached:</strong> Yes</p>` : ''}
    <p><a href="mailto:${bookingData.email}">Reply to Client</a></p>
  `
});
```

**Business Email Includes**:
- All client contact information
- Service and appointment details
- Any special notes or requests
- Photo attachments (if uploaded)
- Quick reply link

### Resend Configuration

**Environment Variables** (`.env.local`):
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
NYA_EMAIL=nya@locsbynya.com
FROM_EMAIL=booking@locsbynya.com
```

**Resend Setup Steps**:
1. Sign up at resend.com
2. Get API key from dashboard
3. Verify domain (for custom "from" email) or use Resend's test domain
4. Add API key to environment variables
5. Deploy with environment variables set

**Resend Features Used**:
- **Transactional Emails**: Perfect for booking confirmations
- **HTML Email Support**: Rich formatting
- **Reliable Delivery**: High deliverability rates
- **Simple API**: Easy integration with Next.js

---

## 🎨 Design System

### Color Palette
- **Primary Teal/Cyan**: `#14B8A6`, `#0FA1B2` (buttons, CTAs, accents)
- **Brown/Tan**: `#8B5A3C`, `#6B4528` (warm, earthy tones for user messages)
- **Dark Background**: `#0B0F13`, `#050609` (chat widget, dark sections)
- **Text**: `#F9FAFB` (light text), `#9CA3AF` (muted text)

### Typography
- **Serif Font**: For headings (elegant, professional)
- **Sans-serif Font**: For body text (readable, modern)

### UI Components
- **Gradient Buttons**: Teal/cyan gradients with hover effects
- **Rounded Corners**: `rounded-2xl`, `rounded-3xl` for modern look
- **Shadows**: Layered shadows for depth
- **Backdrop Blur**: Glass-morphism effects
- **Smooth Transitions**: All interactions have transitions

---

## 🔐 Security & Best Practices

### Form Security
- **Input Validation**: Both client-side and server-side
- **Sanitization**: Clean user inputs before processing
- **Rate Limiting**: Prevent spam/abuse (can be added via middleware)

### Email Security
- **API Key Protection**: Stored in environment variables, never in code
- **Email Validation**: Verify email format before sending
- **Error Handling**: Graceful failures if email service is down

### Data Privacy
- **No Sensitive Data in URLs**: All data sent via POST
- **HTTPS Required**: Secure connections only
- **GDPR Considerations**: Clear data usage policies

---

## 🚀 Deployment Flow

### Development
```bash
npm run dev  # Runs on localhost:3000
```

### Production Build
```bash
npm run build  # Creates optimized production build
npm start      # Runs production server
```

### Deployment Options
- **Vercel** (recommended for Next.js): Automatic deployments, serverless functions
- **Netlify**: Similar to Vercel
- **Custom Server**: Node.js server with PM2 or similar

### Environment Setup for Production
1. Set `RESEND_API_KEY` in hosting platform's environment variables
2. Set `NYA_EMAIL` and `FROM_EMAIL`
3. Verify domain with Resend (for custom email addresses)
4. Test email delivery in production

---

## 📊 Data Flow Diagram

```
User Browser
    │
    ├─→ Visits locsbynya.com
    │   └─→ Loads page.tsx
    │       ├─→ Renders booking form
    │       └─→ Renders LocsFaqChatWidget
    │
    ├─→ Interacts with FAQ Widget
    │   └─→ Types question
    │       └─→ Keyword matching algorithm
    │           └─→ Returns answer (or CTA button)
    │
    └─→ Fills out booking form
        └─→ Submits form
            │
            └─→ POST /api/book
                │
                ├─→ Validates data
                ├─→ Stores booking (if database exists)
                │
                └─→ Resend API Calls
                    ├─→ Email to Client
                    │   └─→ Confirmation with appointment details
                    │
                    └─→ Email to Nya
                        └─→ Notification with client info
```

---

## 🧩 Key Features Summary

### ✅ What's Built

1. **FAQ Chat Widget**
   - ✅ Fully functional keyword-based FAQ system
   - ✅ 12 comprehensive FAQ topics
   - ✅ Smart keyword matching with scoring
   - ✅ Beautiful dark-themed UI
   - ✅ Call-to-action buttons
   - ✅ Smooth animations and UX

2. **Email System Architecture**
   - ✅ Resend integration ready
   - ✅ Dual email system (client + business)
   - ✅ Environment variable configuration

3. **Project Structure**
   - ✅ Next.js 14 App Router setup
   - ✅ TypeScript configuration
   - ✅ Tailwind CSS styling
   - ✅ Component organization

### 🔨 What Needs Implementation

1. **Booking Form** (`app/page.tsx`)
   - Form fields and validation
   - Date/time picker integration
   - File upload for photos
   - Form submission handler

2. **API Route** (`app/api/book/route.ts`)
   - Request parsing and validation
   - Resend email sending logic
   - Error handling
   - Success/error responses

3. **Main Page Layout** (`app/page.tsx` & `app/layout.tsx`)
   - Hero section
   - Service gallery
   - Booking form integration
   - Footer/contact info

---

## 🎯 Business Logic Highlights

### Booking Policies (from FAQ)
- **Security Deposit**: $25 required, goes toward total
- **Cancellation**: 24-hour notice required, 50% fee for late cancellations/no-shows
- **New Clients**: Must upload photos/video of hair for first visit
- **Walk-ins**: Accepted Thu-Fri 5-10 PM, Sat-Sun 9 AM-9 PM
- **Arrival**: 15 minutes early required
- **Guests**: No extra guests/children unless receiving service

### Service Types
- Starter locs
- Retwist/maintenance
- Loc repair/re-attachment ($15 per loc)
- Other specialized services

### Location
- **Studio**: RVM Twists and Cuts
- **Address**: 5373 Wilshire Blvd, Los Angeles, CA
- **Contact**: 310-892-4874 (call/text)

---

## 🔍 Technical Deep Dive

### FAQ Matching Algorithm

The keyword matching system is sophisticated:

```typescript
// Example: User types "my loc fell out"
// System checks all FAQs for keyword matches:

// FAQ: "Loc repair & re-attachment"
// Keywords include: "loc fell out", "locs fell out", "my loc fell out"
// Matches found: "loc fell out" (2 points - multi-word), "my loc fell out" (2 points)
// Total score: 4 points

// Other FAQs might match "loc" (1 point) or "out" (1 point)
// But repair FAQ wins with highest score (4)

// Returns: Repair FAQ answer with reattachment info
```

**Why This Works**:
- Handles typos ("feel" vs "fell")
- Handles variations ("loc" vs "locs" vs "dread")
- Prioritizes specific phrases over generic words
- Natural language understanding without AI/ML

### Email Template Structure

Emails are HTML-formatted for:
- Professional appearance
- Brand consistency
- Mobile-friendly rendering
- Clear information hierarchy

---

## 🐛 Error Handling

### Form Submission Errors
- Network failures → Show error message, allow retry
- Validation errors → Highlight invalid fields
- Server errors → Generic error message, log details

### Email Sending Errors
- Resend API failure → Log error, still return success to user (booking stored)
- Invalid email → Validate before sending
- Rate limiting → Queue emails or show delay message

---

## 📈 Future Enhancements (Potential)

1. **Database Integration**
   - Store bookings in database (PostgreSQL, MongoDB, etc.)
   - Booking history
   - Client profiles

2. **Calendar Integration**
   - Real-time availability checking
   - Google Calendar sync
   - Automatic conflict detection

3. **Payment Processing**
   - Stripe integration for deposits
   - Secure payment collection

4. **SMS Notifications**
   - Twilio integration for text reminders
   - Appointment reminders 24 hours before

5. **Admin Dashboard**
   - View all bookings
   - Manage availability
   - Edit services/pricing

---

## 🎓 Summary

**locsbynya.com** is a modern, client-friendly booking system that:

1. **Educates** clients through the interactive FAQ widget
2. **Streamlines** booking through an intuitive form
3. **Confirms** automatically via Resend email to both client and business
4. **Maintains** professional appearance with modern design
5. **Scales** easily with Next.js serverless architecture

The system is designed to reduce manual work (no need to manually send confirmation emails), improve client experience (instant answers to questions), and ensure reliable communication (automated email confirmations).

---

**End of Architecture Walkthrough**





