# Locs by Nya - Booking Site

A complete online booking system for loctician services with automatic email confirmations via Resend.

## Features

- ✅ **Interactive FAQ Chat Widget** - Smart keyword-based FAQ assistant
- ✅ **Complete Booking Form** - Date/time pickers, service selection, validation
- ✅ **Automatic Email Confirmations** - Client and business owner notifications via Resend
- ✅ **Responsive Design** - Works beautifully on all devices
- ✅ **Modern UI** - Dark theme with gradient accents

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Business owner email (where booking notifications are sent)
NYA_EMAIL=nya@locsbynya.com

# From email address
# For testing: onboarding@resend.dev
# For production: booking@locsbynya.com (must verify domain in Resend)
FROM_EMAIL=onboarding@resend.dev
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Email Setup (Resend)

1. **Sign up** at [resend.com](https://resend.com)
2. **Get API key** from the dashboard
3. **Add to `.env.local`** as `RESEND_API_KEY`
4. **For production**: Verify your domain in Resend dashboard to use custom "from" addresses
5. **For testing**: Use `onboarding@resend.dev` as the `FROM_EMAIL`

## How It Works

1. **User visits site** → Sees booking form + FAQ widget
2. **User fills form** → Selects service, date, time
3. **Form submits** → POST to `/api/book`
4. **API processes** → Validates data, sends emails via Resend
5. **Emails sent**:
   - ✅ Client gets confirmation with appointment details
   - ✅ Business owner gets notification with client info

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Resend** - Transactional email service

## Project Structure

```
app/
├── api/
│   └── book/
│       └── route.ts          # Booking API endpoint with Resend integration
├── page.tsx                  # Main page with booking form
└── layout.tsx                # Root layout
components/
└── LocsFaqChatWidget.tsx     # Interactive FAQ chat widget
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set the environment variables in your hosting platform's dashboard.










