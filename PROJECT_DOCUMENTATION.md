# Moneage - Financial Blog Platform Documentation

## Project Overview

**Moneage** is a comprehensive financial insights platform built for the Nepali market, featuring articles, financial calculators, market tickers, newsletter subscriptions, and advertisement integration. The platform consists of a headless CMS backend (Strapi) and a modern Next.js frontend.

**Live URL:** https://moneage.com  
**Vercel Preview:** https://moneage-puce.vercel.app

---

## Architecture

### Tech Stack

#### Frontend
- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components + Lucide React icons
- **Deployment:** Vercel
- **Domain:** moneage.com (DNS via Himalayan Host)

#### Backend
- **CMS:** Strapi 5.5.0
- **Language:** TypeScript
- **Database:** PostgreSQL (Render)
- **Deployment:** Render
- **API:** RESTful API with authentication

#### External Services
- **Image Storage:** Cloudinary
- **Email Service:** Resend (via Nodemailer SMTP)
- **Market Data:** TradingView Widget API
- **Analytics:** Google Analytics
- **Monetization:** Google AdSense

---

## Hosting & Infrastructure

### Frontend Hosting (Vercel)
- **Service:** Vercel
- **Repository:** Connected to GitHub (auto-deploy on push to `main`)
- **Domain Configuration:**
  - Primary: `moneage.com`
  - WWW: `www.moneage.com`
  - DNS Records:
    - A Record: `@` → `76.76.21.21`
    - CNAME: `www` → `cname.vercel-dns.com`
- **Environment Variables:**
  - `NEXT_PUBLIC_STRAPI_URL` - Backend API URL
  - `STRAPI_API_TOKEN` - API authentication token
  - `NEXT_PUBLIC_SITE_URL` - Frontend URL (https://moneage.com)
  - `NEXT_PUBLIC_GA_ID` - Google Analytics ID

### Backend Hosting (Render)
- **Service:** Render Web Service
- **Database:** Render PostgreSQL
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Environment Variables:**
  - `DATABASE_CLIENT=postgres`
  - `DATABASE_HOST` - Render PostgreSQL host
  - `DATABASE_PORT=5432`
  - `DATABASE_NAME` - Database name
  - `DATABASE_USERNAME` - Database user
  - `DATABASE_PASSWORD` - Database password
  - `DATABASE_SSL=true`
  - `JWT_SECRET` - Strapi JWT secret
  - `API_TOKEN_SALT` - API token salt
  - `ADMIN_JWT_SECRET` - Admin JWT secret
  - `APP_KEYS` - Strapi app keys (comma-separated)
  - `CLOUDINARY_NAME` - Cloudinary cloud name
  - `CLOUDINARY_KEY` - Cloudinary API key
  - `CLOUDINARY_SECRET` - Cloudinary API secret
  - `RESEND_API_KEY` - Resend email API key
  - `DEFAULT_FROM_EMAIL` - Default sender email (onboarding@resend.dev)

### Image Storage (Cloudinary)
- **Provider:** Cloudinary
- **Usage:** All media uploads (article images, ad images)
- **Integration:** Strapi upload provider (`@strapi/provider-upload-cloudinary`)
- **Configuration:** `backend/config/plugins.ts`

### Database (PostgreSQL)
- **Provider:** Render PostgreSQL
- **Version:** PostgreSQL 14+
- **SSL:** Required (enabled)
- **Backup:** Automatic daily backups by Render
- **Access:** Via Render dashboard or connection string

---

## Repository Information

### GitHub Repository
- **Organization:** Moneage
- **Repository Name:** moneage
- **URL:** https://github.com/Moneage/moneage
- **Branch Strategy:**
  - `main` - Production branch (auto-deploys to Vercel & Render)
- **Structure:**
  ```
  /
  ├── frontend/          # Next.js application
  ├── backend/           # Strapi CMS
  ├── PROJECT_DOCUMENTATION.md
  └── README.md
  ```

### Deployment Workflow
1. Push code to `main` branch
2. GitHub triggers webhooks
3. Vercel auto-deploys frontend
4. Render auto-deploys backend (if backend changes detected)

---

## Features

### 1. Content Management
- **Articles:** Full blog system with rich text editor
- **Categories:** Organize articles by topics
- **Authors:** Multi-author support with profiles
- **SEO:** Meta tags, Open Graph, structured data
- **Dynamic Sitemap:** Auto-generated from Strapi content

### 2. Financial Calculators
Located at `/tools`:

#### SIP Calculator (`/tools/sip-calculator`)
- Monthly investment calculator
- Expected returns calculation
- Visual breakdown with donut chart
- Logic: `frontend/lib/calculators/sip.ts`

#### EMI Calculator (`/tools/emi-calculator`)
- Loan EMI calculation
- Principal vs Interest breakdown
- Amortization visualization
- Logic: `frontend/lib/calculators/emi.ts`

#### ROI Calculator (`/tools/roi-calculator`)
- Return on Investment calculator
- Lumpsum investment analysis
- Profit/loss visualization
- Logic: `frontend/lib/calculators/roi.ts`

### 3. Dynamic Market Ticker
- **Location:** Homepage header
- **Data Source:** TradingView Widget API
- **Management:** Strapi `Ticker` collection
- **Features:**
  - Admin-configurable symbols
  - Real-time price updates
  - Order management
  - Active/inactive toggle

### 4. Newsletter System
- **Frontend Component:** `NewsletterForm.tsx`
- **API Route:** `frontend/app/api/newsletter/route.ts`
- **Backend:** Strapi `Subscriber` collection
- **Email Provider:** Resend (SMTP via Nodemailer)
- **Features:**
  - Email validation
  - Duplicate prevention
  - Welcome email automation (lifecycle hook)
  - Source tracking

### 5. Advertisement Integration
- **Management:** Strapi `Advertisement` collection
- **Component:** `AdUnit.tsx`
- **Placements:**
  - Homepage sidebar
  - Article bottom
- **Ad Types:**
  - Image ads (with destination URL)
  - Code snippet ads (Google AdSense, etc.)
- **Features:**
  - Random ad selection per placement
  - Active/inactive toggle
  - Click tracking ready

### 6. Search Functionality
- **Location:** Navbar search bar
- **Endpoint:** `/api/search`
- **Search Scope:** Article titles and content
- **Features:**
  - Real-time search
  - Debounced API calls
  - Highlighted results

### 7. SEO & Analytics
- **Google Search Console:** Verified
- **Google AdSense:** Verified (ca-pub-9135303720365290)
- **Sitemap:** `https://moneage.com/sitemap.xml`
- **Robots.txt:** Configured
- **Ads.txt:** `https://moneage.com/ads.txt`
- **Structured Data:** Organization and Website schemas
- **Meta Tags:** Dynamic per page

---

## Strapi Collections

### Article
**Path:** `backend/src/api/article/content-types/article/schema.json`

**Fields:**
- `title` (string, required)
- `slug` (UID, required)
- `description` (text)
- `content` (richtext)
- `coverImage` (media)
- `category` (relation to Category)
- `author` (relation to Author)
- `publishedAt` (datetime)
- `seo` (component: SEO)

### Category
**Fields:**
- `name` (string)
- `slug` (UID)
- `description` (text)
- `articles` (relation to Article)

### Author
**Fields:**
- `name` (string)
- `bio` (text)
- `avatar` (media)
- `articles` (relation to Article)

### Ticker
**Path:** `backend/src/api/ticker/content-types/ticker/schema.json`

**Fields:**
- `symbol` (string, required) - e.g., "FOREXCOM:SPXUSD"
- `title` (string) - Display name
- `isActive` (boolean, default: true)
- `order` (integer) - Display order

**Permissions:**
- Public: `find` (read-only)

### Advertisement
**Path:** `backend/src/api/advertisement/content-types/advertisement/schema.json`

**Fields:**
- `title` (string, required)
- `placement` (enumeration: 'homepage-sidebar', 'article-bottom')
- `type` (enumeration: 'image', 'code')
- `image` (media) - For image ads
- `destinationUrl` (string) - Click destination
- `codeSnippet` (text) - For code-based ads
- `isActive` (boolean, default: true)

**Permissions:**
- Public: `find` (read-only)

### Subscriber
**Path:** `backend/src/api/subscriber/content-types/subscriber/schema.json`

**Fields:**
- `email` (email, required, unique)
- `isActive` (boolean, default: true)
- `source` (string) - Subscription source

**Lifecycle Hook:**
- `afterCreate` - Sends welcome email via Resend

**Permissions:**
- Public: `create`, `find`

---

## API Endpoints

### Frontend API Routes

#### Newsletter Subscription
**Endpoint:** `POST /api/newsletter`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed!"
}
```

### Strapi API Endpoints

#### Get Articles
**Endpoint:** `GET /api/articles`

**Query Parameters:**
- `populate=*` - Populate relations
- `filters[category][slug][$eq]=category-slug` - Filter by category
- `sort=publishedAt:desc` - Sort by date
- `pagination[page]=1&pagination[pageSize]=10` - Pagination

#### Get Tickers
**Endpoint:** `GET /api/tickers`

**Query:**
```
?filters[isActive][$eq]=true&sort=order:asc
```

#### Get Advertisements
**Endpoint:** `GET /api/advertisements`

**Query:**
```
?filters[placement][$eq]=homepage-sidebar&filters[isActive][$eq]=true
```

---

## Email Configuration

### Resend Integration
**Provider:** Resend (via Nodemailer SMTP)

**Configuration:** `backend/config/plugins.ts`

```typescript
email: {
  config: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'smtp.resend.com',
      port: 587,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    },
    settings: {
      defaultFrom: process.env.DEFAULT_FROM_EMAIL,
      defaultReplyTo: process.env.DEFAULT_FROM_EMAIL,
    },
  },
},
```

**Welcome Email Template:**
Location: `backend/src/api/subscriber/content-types/subscriber/lifecycles.ts`

---

## Environment Variables Reference

### Frontend (.env.local)
```bash
NEXT_PUBLIC_STRAPI_URL=https://your-backend.onrender.com
STRAPI_API_TOKEN=your_api_token_here
NEXT_PUBLIC_SITE_URL=https://moneage.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Backend (.env)
```bash
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host.render.com
DATABASE_PORT=5432
DATABASE_NAME=moneage_db
DATABASE_USERNAME=moneage_user
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=true

# Strapi Secrets
JWT_SECRET=your_jwt_secret
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
APP_KEYS=key1,key2,key3,key4

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=onboarding@resend.dev
```

---

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (for local development)
- Git

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/Moneage/moneage.git
cd moneage
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with local database credentials
npm run develop
```

Backend runs at: `http://localhost:1337`

#### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure .env.local with backend URL
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

#### Backend
```bash
cd backend
npm run build
npm run start
```

---

## Common Tasks

### Adding a New Article
1. Login to Strapi Admin
2. Go to Content Manager → Article
3. Click "Create new entry"
4. Fill in title, content, select category/author
5. Upload cover image
6. Click "Save" and "Publish"

### Adding Ticker Symbols
1. Login to Strapi Admin
2. Go to Content Manager → Ticker
3. Click "Create new entry"
4. Enter symbol (e.g., `NSE:NIFTY`)
5. Set title, order, and active status
6. Click "Save" and "Publish"

### Managing Advertisements
1. Login to Strapi Admin
2. Go to Content Manager → Advertisement
3. Create new entry
4. Select placement and type
5. Upload image or paste code snippet
6. Set active status
7. Click "Save" and "Publish"

### Deploying Changes

#### Frontend Changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Vercel auto-deploys in ~2 minutes.

#### Backend Changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Render auto-deploys in ~3-5 minutes.

### Checking Logs

#### Vercel Logs
1. Go to Vercel Dashboard
2. Select "moneage" project
3. Click "Deployments"
4. Click on latest deployment
5. View "Build Logs" or "Function Logs"

#### Render Logs
1. Go to Render Dashboard
2. Select backend service
3. Click "Logs" tab
4. View real-time logs

---

## Troubleshooting

### Frontend Build Errors
- Check Vercel deployment logs
- Verify environment variables are set
- Ensure `NEXT_PUBLIC_STRAPI_URL` is correct
- Check for TypeScript errors locally: `npm run build`

### Backend Not Responding
- Check Render service status
- Verify database connection (check DATABASE_* env vars)
- Check Render logs for errors
- Restart service if needed

### Images Not Loading
- Verify Cloudinary credentials
- Check `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
- Test upload in Strapi Media Library

### Newsletter Not Sending Emails
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for quota/errors
- Note: Free tier only sends to verified email
- Check Strapi logs for email errors

### DNS Issues
- Check DNS propagation: https://dnschecker.org
- Verify A record: `76.76.21.21`
- Verify CNAME: `cname.vercel-dns.com`
- Clear local DNS cache: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`

---

## Security Notes

### API Tokens
- Strapi API tokens are in Settings → API Tokens
- Use read-only tokens for frontend
- Never commit `.env` files to Git

### Database Access
- PostgreSQL is only accessible via Render's internal network
- Use Render dashboard for database management
- Regular backups are automatic

### CORS Configuration
- Backend CORS is configured in `backend/config/middlewares.ts`
- Allows requests from `moneage.com` and Vercel preview URLs

---

## Performance Optimization

### Frontend
- Next.js Image optimization (automatic)
- Static page generation where possible
- Dynamic imports for heavy components
- Vercel Edge Network CDN

### Backend
- Database query optimization with Strapi populate
- Cloudinary image transformations
- API response caching (consider adding Redis)

### Images
- Cloudinary automatic format optimization
- Responsive images via Next.js Image component
- Lazy loading enabled

---

## Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Comment system for articles
- [ ] Bookmarking functionality
- [ ] Advanced search with filters
- [ ] Multi-language support (Nepali/English)
- [ ] Mobile app (React Native)
- [ ] Premium subscription tier
- [ ] Stock portfolio tracker

### Technical Improvements
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Automated testing (Jest, Playwright)
- [ ] CI/CD pipeline improvements
- [ ] Performance monitoring (Sentry)
- [ ] A/B testing framework

---

## Support & Contacts

### Developer Resources
- **Strapi Docs:** https://docs.strapi.io
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs

### Service Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com
- **Cloudinary:** https://cloudinary.com/console
- **Google Search Console:** https://search.google.com/search-console
- **Google AdSense:** https://adsense.google.com

---

## Version History

### v1.0.0 (Current)
- Initial production release
- Core features: Articles, Calculators, Newsletter, Ads
- SEO optimization
- Google AdSense integration
- Deployed on Vercel + Render

---

**Last Updated:** January 11, 2026  
**Maintained By:** Moneage Development Team
