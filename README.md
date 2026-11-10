# 🌴 Traumurlaub Lanka – Official Tourism Web Platform

A complete, premium, responsive, and animated tourism platform for **Traumurlaub Lanka**, a premier Sri Lankan travel company led by founder **Nirosh** with approximately 15 years of industry experience and over 2,500 international travelers served.

---

## 🌟 Key Features

1. **100% Real Sri Lankan Photography Only**:
   - Every single landmark, beach, wildlife shot, and tea plantation photograph represents the actual verified location in Sri Lanka.
   - Includes Sigiriya Rock Fortress, Ella Nine Arch Bridge, Kandy Temple of the Tooth, Galle Fort & Lighthouse, Mirissa Beach & Whales, Yala Safari Leopards, Udawalawe Elephants, Bentota, Nuwara Eliya, Anuradhapura, Polonnaruwa, Colombo Lotus Tower, and Negombo.
   - Zero AI-generated destinations. Zero generic foreign stock photography.

2. **Full Page Suite**:
   - `index.html` (Cinematic Hero, Highlights, Curated Tours, Why Choose Us, Animated Stats, Travel Gallery, CTA)
   - `about.html` (Company history, Founder Nirosh profile, Mission, Vision, and Core Values)
   - `tours.html` (3 Nights/4 Days, 5 Nights/6 Days, 7 Nights/8 Days with expandable daily itineraries, highlights, and customizer)
   - `excursions.html` (10 Signature one-day excursions across Sri Lanka)
   - `destinations.html` (14 iconic Sri Lankan travel highlights with detailed sights & tour links)
   - `reviews.html` (Verified traveler reviews, dynamic rating calculations, interactive 1-5 gold star rating selector, moderation workflow)
   - `contact.html` (Comprehensive travel inquiry form with instant validation, database storage, email delivery, and WhatsApp prefill)
   - `admin/login.html` & `admin/dashboard.html` (Secure staff portal to manage inquiries, moderate reviews, and track analytics)

3. **"Ask Traumurlaub AI" Travel Assistant**:
   - Floating AI chatbot accessible on every page.
   - Server-side OpenAI API integration (GPT-4o / GPT-4o-mini).
   - High-fidelity built-in local knowledge fallback ensuring intelligent travel responses even before API key configuration.
   - Seamless one-click WhatsApp handoff for real human booking.

4. **Interactive WhatsApp Integration**:
   - Dedicated floating action button (`+94 777 978 768`).
   - Quick inquiry buttons on all tour packages and excursions pre-filling customized WhatsApp messages.

5. **Customer Review System & Moderation**:
   - Interactive star rating picker (1 to 5 gold stars).
   - Dynamic real-time calculation of average rating, 5-star percentage, and star distribution bars.
   - Reviews require administrator approval before appearing publicly, preventing fake or spam entries.

6. **Full-Featured Admin Dashboard**:
   - Review moderation (Approve, Reject, Delete).
   - Inquiry management (Track status, view detailed client requirements).
   - Secure token-based authentication with brute-force rate limiting.

7. **Subtle Tropical Animations**:
   - Canvas-powered falling tropical Ceylon leaves effect with natural drift and rotation.
   - Scroll reveal animations powered by Intersection Observer.
   - Full accessibility support honoring `prefers-reduced-motion`.

---

## 📁 Project Structure

```text
traumurlaub-lanka/
├── index.html                     # Homepage
├── about.html                     # Company & Founder Nirosh Profile
├── tours.html                     # Dedicated Multi-Day Tour Itineraries
├── excursions.html                # 10 One-Day Excursions
├── destinations.html              # 14 Iconic Sri Lankan Destinations
├── reviews.html                   # Guest Reviews & Star Rating System
├── contact.html                   # Contact & Comprehensive Inquiry Form
├── admin/
│   ├── login.html                 # Secure Administrator Login
│   └── dashboard.html             # Moderation & Inquiry Dashboard
├── css/
│   ├── style.css                  # Brand Theme (Deep Forest Green, Dark Emerald, Leaf Green)
│   ├── animations.css             # Floating Leaves, Scroll Reveal & Transitions
│   └── responsive.css             # Mobile & Tablet Breakpoints
├── js/
│   ├── main.js                    # Sticky Nav, Accordions & Mobile Drawer
│   ├── animations.js              # Leaves Canvas & Stats Counter Engine
│   ├── chatbot.js                 # "Ask Traumurlaub AI" Frontend Client
│   ├── inquiry.js                 # Form Validation & Auto-Prefill Engine
│   ├── reviews.js                 # Star Rating Picker & Dynamic Analytics
│   └── whatsapp.js                # WhatsApp Message Formatter & Dispatcher
├── assets/
│   └── images/
│       ├── logo.png               # Official Traumurlaub Lanka Logo
│       ├── hero/                  # Authentic Sigiriya Panoramic Hero
│       ├── destinations/          # 14 Real Sri Lankan Location Photographs
│       ├── tours/                 # Multi-Day Package Photographs
│       ├── excursions/            # 1-Day Excursion Photographs
│       ├── gallery/               # Sri Lankan Travel Highlights
│       └── about/                 # Ceylon Tea Country & Culture
├── backend/
│   ├── server.js                  # Production Express.js Server
│   ├── routes/
│   │   ├── inquiries.js           # /api/inquiries
│   │   ├── reviews.js             # /api/reviews
│   │   ├── ai.js                  # /api/ai/chat
│   │   └── admin.js               # /api/admin/*
│   ├── controllers/               # Business logic & validations
│   ├── middleware/                # JWT Auth & Rate Limiting
│   ├── services/
│   │   ├── emailService.js        # Nodemailer SMTP Dispatcher
│   │   └── aiService.js           # OpenAI API & Knowledge Engine
│   ├── database/
│   │   ├── db.js                  # Self-contained zero-config DB engine
│   │   └── schema.sql             # SQL Schema for MySQL / PostgreSQL
│   └── data/
│       └── database.json          # Persistent JSON store with verified seeds
├── .env.example                   # Environment configuration template
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (included with Node.js)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure optional SMTP credentials and your OpenAI API key.

### 4. Start the Application
```bash
npm start
```
The server will start at:
- **Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)
- **API Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🔐 Default Administrator Credentials

- **Username / Email**: `admin` or `nirosh19@yahoo.com`
- **Password**: `Admin@Traumurlaub2026!`

*(You can update password hashes and add staff users in `backend/database/db.js` or via MySQL schema).*

---

## 📧 Email Configuration (SMTP)

Inquiries submitted through `contact.html` are automatically stored in the database and dispatched via Nodemailer to:
- **Primary Recipient**: `nirosh19@yahoo.com`
- **Inquiry Support**: `imkirul.desilva@gmail.com`
- **Company Email**: `traumurlaublanka.sl@gmail.com`

To enable live email delivery in production, specify your SMTP details in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM=inquiries@traumurlaublanka.com
```

---

## 🤖 OpenAI API Configuration

To enable live OpenAI GPT-powered responses for "Ask Traumurlaub AI":
```env
OPENAI_API_KEY=sk-...your-actual-key...
OPENAI_MODEL=gpt-4o-mini
```
*Note: If no API key is set, the chatbot automatically uses its comprehensive built-in Sri Lankan tourism knowledge engine to provide accurate details and guidance!*

---

## 🚢 Production Deployment

The project is ready for immediate deployment to any cloud host:

### Deploying to Render / Railway / Heroku
1. Push the repository to GitHub.
2. Link the repository to your host.
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add the environment variables from your `.env` file in the hosting dashboard.

### Deploying to a Linux VPS (Ubuntu / Debian with PM2 & Nginx)
```bash
git clone <repo-url> /var/www/traumurlaub-lanka
cd /var/www/traumurlaub-lanka
npm install --production
npm install -g pm2
pm2 start backend/server.js --name traumurlaub-lanka
pm2 startup
pm2 save
```

---

## 📞 Company Contact Details

- **Company**: Traumurlaub Lanka
- **Founder**: Nirosh (~15 years experience, 2,500+ happy guests)
- **Direct Phone / WhatsApp**: +94 777 978 768
- **WhatsApp Link**: [https://wa.me/94777978768](https://wa.me/94777978768)
- **Email**: nirosh19@yahoo.com | traumurlaublanka.sl@gmail.com | imkirul.desilva@gmail.com
- **Facebook**: [https://www.facebook.com/100064179215325/videos/](https://www.facebook.com/100064179215325/videos/)
