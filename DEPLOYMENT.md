# Deployment Guide - Vercel

## ✅ Deployment Status

**Site is live at:** https://www.locsbynya.com

The code has been successfully deployed to Vercel production.

## 🔐 Critical: Set Up Environment Variables

**IMPORTANT:** The booking system requires environment variables to send emails. Without these, bookings will fail.

### Steps to Add Environment Variables in Vercel:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Navigate to your project: `locsbynya-site`

2. **Open Project Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add These Variables:**

   ```
   RESEND_API_KEY = re_your_api_key_here
   NYA_EMAIL = nya@locsbynya.com
   FROM_EMAIL = onboarding@resend.dev
   ```

   **For each variable:**
   - Click "Add New"
   - Enter the variable name
   - Enter the value
   - Select **Production**, **Preview**, and **Development** environments
   - Click "Save"

4. **Redeploy After Adding Variables**
   - After adding environment variables, go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**
   - This ensures the new environment variables are loaded

## 📧 Resend Setup

1. **Get Resend API Key:**
   - Sign up at https://resend.com (if not already)
   - Go to https://resend.com/api-keys
   - Create a new API key or copy existing one
   - Add it as `RESEND_API_KEY` in Vercel

2. **For Production (Optional):**
   - Verify your domain in Resend dashboard
   - Update `FROM_EMAIL` to use your verified domain (e.g., `booking@locsbynya.com`)
   - This allows custom "from" addresses instead of `onboarding@resend.dev`

## 🧪 Testing the Deployment

1. **Visit the site:** https://www.locsbynya.com
2. **Test the booking form:**
   - Fill out all fields
   - Submit a test booking
   - Check that you receive confirmation emails

3. **Check email delivery:**
   - Client should receive confirmation email
   - Business owner (NYA_EMAIL) should receive notification

## 🔄 Future Deployments

The site is connected to GitHub. Any push to the `main` branch will automatically trigger a new deployment.

To manually deploy:
```bash
npx vercel --prod
```

## 📊 Monitoring

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Logs:** Available in Vercel dashboard under each deployment
- **Function Logs:** Check API route logs in Vercel dashboard

## 🐛 Troubleshooting

### Emails Not Sending?
- ✅ Check environment variables are set in Vercel
- ✅ Verify RESEND_API_KEY is correct
- ✅ Check Resend dashboard for email logs
- ✅ Ensure you've redeployed after adding env vars

### Build Errors?
- Check deployment logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript errors locally: `npm run build`

### Site Not Updating?
- Wait a few minutes for deployment to complete
- Clear browser cache
- Check Vercel dashboard for deployment status


