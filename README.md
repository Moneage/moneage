# Moneage - Financial Insights & Tools

> Your trusted source for expert financial analysis, market trends, and personal finance tips.

[![Live Site](https://img.shields.io/badge/Live-moneage.com-blue)](https://moneage.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_16-black)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Strapi_5-blueviolet)](https://strapi.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Live Demo

**Website:** [https://moneage.com](https://moneage.com)

## 📋 Overview

Moneage is a modern financial blog and tools platform built with Next.js and Strapi CMS. It provides expert financial insights, market analysis, and interactive financial calculators to help users make informed financial decisions.

### Key Features

- 📰 **Financial Blog** - Expert articles on investing, personal finance, economy, and technology
- 🧮 **Financial Calculators** - SIP, EMI, Compound Interest, ROI calculators
- 📊 **Portfolio Tracker** - Real-time stock portfolio management
- 📧 **Newsletter System** - Double opt-in email subscriptions with GDPR/CAN-SPAM compliance
- 🔍 **Smart Search** - Full-text search across all articles
- 📱 **Responsive Design** - Mobile-first, optimized for all devices
- 🎨 **Modern UI** - Beautiful, accessible design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.1 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** Vercel
- **Analytics:** Google Analytics 4

### Backend
- **CMS:** Strapi 5.3.3
- **Database:** PostgreSQL
- **Hosting:** Render
- **Email:** Resend (SMTP)
- **Media:** Cloudinary

### External Services
- **Stock Data:** Alpha Vantage API
- **Email Delivery:** Resend
- **Image Hosting:** Cloudinary
- **Charts:** TradingView Widgets

## 📁 Project Structure

```
moneage/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   │   ├── articles/       # Article pages
│   │   ├── tools/          # Financial calculators
│   │   ├── confirm/        # Email confirmation
│   │   ├── unsubscribe/    # Newsletter unsubscribe
│   │   └── preferences/    # Subscription preferences
│   ├── components/         # React components
│   ├── lib/               # Utilities and helpers
│   └── public/            # Static assets
│
├── backend/                # Strapi CMS
│   ├── src/
│   │   ├── api/           # API endpoints
│   │   │   ├── subscriber/    # Newsletter subscribers
│   │   │   ├── newsletter/    # Email campaigns
│   │   │   └── email-template/ # Email templates
│   │   └── config/        # Strapi configuration
│   └── database/          # Database files
│
├── SUBSCRIBER_SETUP.md    # Newsletter system setup guide
└── PROJECT_DOCUMENTATION.md # Comprehensive project docs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (for backend)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Moneage/moneage.git
   cd moneage
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run develop
   ```

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/moneage
RESEND_API_KEY=your_resend_api_key
DEFAULT_FROM_EMAIL=newsletter@moneage.com
FRONTEND_URL=http://localhost:3000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

## 📚 Documentation

- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Complete project documentation
- **[SUBSCRIBER_SETUP.md](SUBSCRIBER_SETUP.md)** - Newsletter system setup guide

## 🎯 Features

### Content Management
- Rich text editor for articles
- Category and tag management
- Author profiles
- SEO optimization
- Draft and publish workflow

### Financial Tools
- **SIP Calculator** - Systematic Investment Plan returns
- **EMI Calculator** - Loan EMI calculations
- **Compound Interest** - Investment growth calculator
- **ROI Calculator** - Return on Investment calculator
- **Portfolio Tracker** - Stock portfolio management with real-time prices

### Newsletter System
- Double opt-in email confirmation
- One-click unsubscribe
- Preference management
- Bulk email campaigns
- Email analytics
- GDPR/CAN-SPAM compliant

### SEO & Analytics
- Dynamic meta tags
- Structured data (JSON-LD)
- Sitemap generation
- Google Analytics integration
- Performance optimization

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Automatic deployment on push to main
git push origin main
```

### Backend (Render)
```bash
# Automatic deployment on push to main
git push origin main
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Arun**
- Website: [moneage.com](https://moneage.com)
- GitHub: [@Moneage](https://github.com/Moneage)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Strapi team for the powerful CMS
- Vercel for hosting
- Render for backend hosting
- All open-source contributors

## 📊 Project Status

🟢 **Active Development** - The project is actively maintained and regularly updated with new features and improvements.

---

**Built with ❤️ for the financial community**
