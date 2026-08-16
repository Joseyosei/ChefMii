# ChefMii Platform - Deployment Guide

## 🚀 Production Deployment to Vercel

ChefMii is a full-stack Next.js 14 private chef booking platform powered by Firebase and Stripe. Follow these steps to deploy to Vercel.

### Prerequisites

- GitHub account with access to the repository
- Vercel account (https://vercel.com)
- Firebase Project (Authentication + Firestore)
- Stripe account (for payments)
- Google AI Studio key (for Gemini chatbot)
- Resend account (for email notifications)

### Step 1: Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** with Email/Password and Google Sign-In providers.
3. Enable **Cloud Firestore** in production mode.
4. Copy `firestore.rules` into the Firebase Console Rules tab and publish.
5. In Project Settings > Service Accounts, click "Generate new private key".
6. Encode the service account JSON to base64:
   ```bash
   base64 -i serviceAccountKey.json
   ```

### Step 2: Configure Environment Variables in Vercel

In Vercel project settings, add the following environment variables:

```env
# ─── Firebase Client ──────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# ─── Firebase Admin (Server-side) ─────────────────────────────
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_json

# ─── Stripe ───────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENT=10

# ─── Gemini AI (Chatbot) ──────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ─── Email (Resend) ───────────────────────────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM=no-reply@chefmii.com

# ─── App Config ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ChefMii
```

### Step 3: Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → Webhooks
3. Click "Add endpoint"
4. Enter your URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
6. Copy the webhook signing secret and add it to Vercel as `STRIPE_WEBHOOK_SECRET`.

### Step 4: Deploy & Verify

After deployment, verify the following checklist:
- [ ] Homepage loads with search and animations
- [ ] Waitlist modal writes to Firestore
- [ ] User registration and email/password login works
- [ ] Google popup sign-in works
- [ ] User dashboard loads bookings and conversations
- [ ] Chef dashboard loads
- [ ] Chatbot (`/api/chat`) responds with Gemini AI
