# BrightHome — Complete Setup & Deployment Guide
**Store:** BrightHome | Premium Lighting & Home Decor
**Domain:** https://brighthouse.website
**Admin Email:** eng50544@gmail.com

---

## ✅ CURRENT STATUS

| Service | Status |
|---------|--------|
| MongoDB Atlas | ✅ Configured |
| Google Gemini AI | ✅ Configured |
| Cloudinary | ✅ Configured |
| SendGrid | ✅ Configured |
| PayTabs | ⏳ Awaiting credentials |
| Buffer (Social) | ⏳ Optional — add when ready |
| Vercel Deployment | ⏳ Not deployed yet |

---

## PHASE 1 — Install Dependencies (on YOUR computer)

```bash
cd "drop shipping/brighthome"
npm install
npm run dev
```

Open http://localhost:3000 to see the store with mock products.

---

## PHASE 2 — PayTabs Setup (REQUIRED for payments)

1. Register at https://ai.paytabs.com/en/iraq-payment-gateway/
2. After approval → Dashboard → Developers → Key Management
3. Copy your **Profile ID** and **Server Key**
4. Open `.env.local` and fill in:

```
PAYTABS_PROFILE_ID=your_profile_id_here
PAYTABS_SERVER_KEY=your_server_key_here
```

After deployment, configure PayTabs Dashboard:
- **Callback URL:** https://brighthouse.website/api/webhook/paytabs
- **Return URL:** https://brighthouse.website/success

---

## PHASE 3 — Deploy to Vercel

```bash
# Push to GitHub first
git init && git add . && git commit -m "BrightHome store"
git remote add origin https://github.com/YOUR_USERNAME/brighthome.git
git push -u origin main
```

Then:
1. Go to https://vercel.com → New Project → Import from GitHub
2. Vercel auto-detects Next.js → Click Deploy
3. Go to Project Settings → Environment Variables
4. Add ALL variables from your .env.local file
5. Redeploy

---

## PHASE 4 — Connect Domain (brighthouse.website)

1. Vercel → Project → Settings → Domains → Add `brighthouse.website`
2. Copy the DNS records Vercel provides
3. Add them to your domain registrar
4. Wait 1–24 hours

---

## PHASE 5 — MongoDB Atlas Network Access

1. https://cloud.mongodb.com → Network Access → Add IP Address
2. Allow Access from Anywhere (0.0.0.0/0) for Vercel

---

## PHASE 6 — SendGrid Sender Verification

1. https://app.sendgrid.com → Settings → Sender Authentication
2. Authenticate domain: `brighthouse.website`
3. Add DNS records to your registrar
4. Verify ✅

---

## PHASE 7 — First Products (Run Agents)

```bash
npm run agent:research   # AI finds 15 products with Gemini
npm run agent:images     # Downloads & uploads to Cloudinary
npm run agent:content    # Generates titles, descriptions, SEO
npm run agent:publish    # Makes them live on the store
```

Products will appear at https://brighthouse.website/shop

---

## PHASE 8 — Daily Automation Schedule

| Agent | Command | Schedule |
|-------|---------|----------|
| Research | npm run agent:research | 6:00 AM daily |
| Images | npm run agent:images | 8:00 AM daily |
| Content | npm run agent:content | 11:00 AM daily |
| Publish | npm run agent:publish | 1:00 PM daily |
| Social | npm run agent:social | 2:00 PM daily |
| Analytics | npm run agent:analytics | Every hour |
| Optimize | npm run agent:optimize | 4:00 PM daily |
| Reports | npm run agent:report | 6:00 PM daily |

Set these up via Cowork Scheduled Tasks.

---

## PHASE 9 — Google Merchant Center (Recommended)

1. https://merchants.google.com → Create account
2. Verify brighthouse.website
3. Add feed: https://brighthouse.website/api/feed/google-shopping
4. Set daily refresh
5. Products appear in Google Shopping in 3–7 days

---

## PHASE 10 — Buffer Social Media (Optional)

1. https://buffer.com → Connect Instagram, TikTok, Facebook
2. Get Access Token → Settings → API
3. Add to .env.local: `BUFFER_TOKEN=your_token`

---

## STORE PAGES

| Page | URL |
|------|-----|
| Home | / |
| Shop | /shop |
| Product | /shop/[id] |
| Cart | /cart |
| Checkout | /checkout |
| Order Success | /success |
| Track Order | /track-order |
| Contact | /contact |
| About | /about |
| Returns Policy | /returns |
| Privacy Policy | /privacy |
| Terms of Service | /terms |
| Admin Dashboard | /admin |

## KEY URLS (after deployment)

- **Admin:** https://brighthouse.website/admin
- **Google Feed:** https://brighthouse.website/api/feed/google-shopping
- **Sitemap:** https://brighthouse.website/sitemap.xml
- **Robots.txt:** https://brighthouse.website/robots.txt

---

## TROUBLESHOOTING

**Products not showing?** Run agent:research then agent:publish

**Payment not working?** Check PAYTABS_PROFILE_ID and PAYTABS_SERVER_KEY

**Emails not sending?** Verify SendGrid sender domain

**Build errors?** Run npm install first

**MongoDB error?** Allow 0.0.0.0/0 in Atlas Network Access

---

*Next.js 14 · MongoDB · PayTabs · Cloudinary · SendGrid · Google Gemini · 10 AI Agents*
