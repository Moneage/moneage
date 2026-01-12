# Subscriber Management System - Setup Guide

## Environment Variables

### Backend (.env)

Add these to your existing backend `.env` file:

```bash
# Existing variables
RESEND_API_KEY=re_xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=newsletter@moneage.com

# NEW: Add this variable
FRONTEND_URL=https://moneage.com
```

### Frontend (.env.local)

No new variables needed! Your existing configuration works:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-backend.onrender.com
STRAPI_API_TOKEN=your_api_token_here
```

---

## Database Migration

After deploying the backend changes, Strapi will automatically create the new database tables and columns.

### For Existing Subscribers

You have two options:

#### Option 1: Require Re-confirmation (Recommended for GDPR)
All existing subscribers will need to re-confirm their email. This is the most legally compliant approach.

#### Option 2: Auto-migrate Existing Subscribers
Run this script in Strapi console to migrate existing subscribers:

```javascript
// In Strapi Admin → Settings → API Tokens → Create a token
// Then run this script

const crypto = require('crypto');

async function migrateSubscribers() {
  const subscribers = await strapi.db.query('api::subscriber.subscriber').findMany();
  
  for (const subscriber of subscribers) {
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    await strapi.db.query('api::subscriber.subscriber').update({
      where: { id: subscriber.id },
      data: {
        confirmationToken,
        unsubscribeToken,
        isConfirmed: true, // Auto-confirm existing
        confirmedAt: new Date(),
        preferences: {
          weeklyNewsletter: true,
          productUpdates: true,
          marketInsights: true
        }
      }
    });
  }
  
  console.log(`Migrated ${subscribers.length} subscribers`);
}

migrateSubscribers();
```

---

## Testing the System

### 1. Test Double Opt-in Flow

1. Go to your homepage
2. Subscribe with a test email
3. Check your email for confirmation link
4. Click confirmation link
5. Verify you see success message
6. Check Strapi admin - subscriber should be `isConfirmed: true`

### 2. Test Unsubscribe

1. From a newsletter email, click unsubscribe link
2. Confirm unsubscribe
3. Check Strapi admin - subscriber should be `isActive: false`

### 3. Test Preferences

1. Click "Manage Preferences" link in email
2. Toggle preferences
3. Save changes
4. Check Strapi admin - preferences should be updated

### 4. Test Newsletter Sending

1. Login to Strapi Admin
2. Go to Content Manager → Newsletter
3. Create a new newsletter
4. Fill in subject and content
5. Save as draft
6. Send test email to yourself
7. If test looks good, send to all subscribers

---

## Sending Your First Newsletter

### Via Strapi Admin UI

1. **Create Newsletter:**
   - Go to Content Manager → Newsletter
   - Click "Create new entry"
   - Fill in:
     - Subject: "Your newsletter subject"
     - Preheader: "Preview text"
     - Content: Your newsletter content (rich text)
   - Save as Draft

2. **Send Test Email:**
   ```bash
   POST /api/newsletters/{id}/test
   Body: { "testEmail": "your@email.com" }
   ```

3. **Send to All Subscribers:**
   ```bash
   POST /api/newsletters/{id}/send
   ```

### Via API (for automation)

```javascript
// Send newsletter via API
const response = await fetch('https://your-backend.onrender.com/api/newsletters/1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log(`Sent to ${result.sentCount} subscribers`);
```

---

## Email Deliverability Tips

### 1. Set Up SPF Record

Add to your DNS:

```
TXT @ "v=spf1 include:_spf.resend.com ~all"
```

### 2. Set Up DKIM

Resend provides DKIM automatically. Verify in Resend dashboard.

### 3. Add DMARC Record

```
TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@moneage.com"
```

### 4. Warm Up Your Domain

- Start with small batches (50-100 emails)
- Gradually increase volume over 2-4 weeks
- Monitor bounce and complaint rates

---

## Monitoring & Analytics

### Check Newsletter Performance

```bash
GET /api/newsletters/{id}/analytics
```

Response:
```json
{
  "sentCount": 500,
  "openCount": 125,
  "clickCount": 45,
  "openRate": "25.00%",
  "clickRate": "9.00%"
}
```

### Monitor Subscriber Growth

Check Strapi Admin → Content Manager → Subscriber

Filter by:
- `isConfirmed: true` - Confirmed subscribers
- `isActive: true` - Active subscribers
- `isActive: false` - Unsubscribed

---

## Troubleshooting

### Confirmation emails not sending

1. Check Resend API key in backend `.env`
2. Check Resend dashboard for errors
3. Verify `DEFAULT_FROM_EMAIL` is set
4. Check Strapi logs for errors

### Unsubscribe link not working

1. Verify `FRONTEND_URL` is set in backend `.env`
2. Check that frontend routes are deployed
3. Verify token in URL is correct

### Newsletter not sending

1. Check you have confirmed subscribers
2. Verify Resend API limits (100/day on free tier)
3. Check Strapi logs for errors
4. Try sending test email first

---

## Legal Compliance Checklist

Before sending newsletters:

- [ ] Add your business address to email footer
- [ ] Include unsubscribe link in every email (✅ automatic)
- [ ] Include preference management link (✅ automatic)
- [ ] Update privacy policy with email collection info
- [ ] Set up double opt-in (✅ implemented)
- [ ] Honor unsubscribe requests immediately (✅ automatic)
- [ ] Keep records of consent (✅ metadata field)

---

## Resend Pricing

| Plan | Emails/Month | Cost |
|------|--------------|------|
| Free | 3,000 | $0 |
| Pro | 50,000 | $20 |
| Business | 100,000 | $80 |

**Recommendation:** Start with free tier, upgrade when you hit limits.

---

## Next Steps

1. Deploy backend changes to Render
2. Deploy frontend changes to Vercel
3. Add `FRONTEND_URL` to backend environment variables
4. Test the complete flow
5. Migrate existing subscribers (if any)
6. Send your first newsletter!

---

## Support

If you encounter issues:

1. Check Strapi logs in Render dashboard
2. Check Vercel logs for frontend errors
3. Verify all environment variables are set
4. Test with a fresh email address

For Resend issues:
- Dashboard: https://resend.com/dashboard
- Docs: https://resend.com/docs
- Status: https://status.resend.com
