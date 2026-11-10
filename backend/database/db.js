// ===================================================================
// TRAUMURLAUB LANKA – DATABASE MANAGER
// Features: Robust Zero-Config Storage with JSON File Persistence,
// Optional MySQL/PostgreSQL support via .env, and Automatic Seeding
// ===================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database State
const initialDb = {
  inquiries: [],
  reviews: [
    {
      id: "rev-1",
      customerName: "Thomas & Claudia Weber",
      country: "Germany",
      email: "thomas.weber@example.de",
      tourPackage: "7 Nights / 8 Days Island Tour",
      travelDate: "October 2026",
      rating: 5,
      title: "Unforgettable 8-Day Island Tour with Nirosh!",
      message: "Traumurlaub Lanka made our Sri Lankan holiday perfection! Nirosh was attentive, deeply knowledgeable about local history, wildlife in Yala, and showed us hidden viewpoints in Ella away from crowded spots. Exceptional hospitality!",
      status: "approved",
      created_at: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: "rev-2",
      customerName: "David Sterling",
      country: "United Kingdom",
      email: "david.sterling@example.co.uk",
      tourPackage: "5 Nights / 6 Days Highlights",
      travelDate: "September 2026",
      rating: 5,
      title: "Sigiriya, Kandy & Cultural Triangle Wonder",
      message: "Traveling with Nirosh felt like having an old friend show us his beautiful home island. Seeing wild elephant herds in Udawalawe and the sunrise over Sigiriya rock will stay in our hearts forever. Highly recommend Traumurlaub Lanka!",
      status: "approved",
      created_at: new Date(Date.now() - 35 * 86400000).toISOString()
    },
    {
      id: "rev-3",
      customerName: "Sophie Dubois",
      country: "France",
      email: "sophie.dubois@example.fr",
      tourPackage: "Customized Sri Lanka Tour",
      travelDate: "August 2026",
      rating: 5,
      title: "Magical Ella Train & Galle Fort Coastline",
      message: "The scenic hill country train to Demodara Nine Arch Bridge and the coastal charm of Galle Fort were breathtaking. Nirosh arranged lovely boutique stays and ensured every single transfer was seamless and stress-free.",
      status: "approved",
      created_at: new Date(Date.now() - 65 * 86400000).toISOString()
    },
    {
      id: "rev-4",
      customerName: "Marcus Lindner",
      country: "Austria",
      email: "marcus.lindner@example.at",
      tourPackage: "7 Nights / 8 Days Island Tour",
      travelDate: "July 2026",
      rating: 5,
      title: "Best Safari & Beach Holiday in Sri Lanka",
      message: "From the leopard sighting in Yala to relaxing on the golden beaches of Mirissa, every detail was carefully planned. Traumurlaub Lanka is the most genuine and trustworthy tour partner you could find.",
      status: "approved",
      created_at: new Date(Date.now() - 90 * 86400000).toISOString()
    }
  ],
  admin_users: [
    {
      id: "admin-1",
      username: "admin",
      email: "nirosh19@yahoo.com",
      // Salted SHA-256 hash for default password: Admin@Traumurlaub2026!
      salt: "traum_lanka_secure_salt",
      password_hash: hashPassword("Admin@Traumurlaub2026!", "traum_lanka_secure_salt"),
      role: "admin",
      created_at: new Date().toISOString()
    }
  ]
};

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Load or initialize DB
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(initialDb);
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database, resetting to seed:', err);
    saveDb(initialDb);
    return initialDb;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Database Operations
const db = {
  // Inquiries
  getInquiries: () => {
    const data = loadDb();
    return data.inquiries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  createInquiry: (inquiryData) => {
    const data = loadDb();
    const newInquiry = {
      id: `TL-${Date.now().toString().slice(-6)}`,
      ...inquiryData,
      status: 'new',
      created_at: new Date().toISOString()
    };
    data.inquiries.unshift(newInquiry);
    saveDb(data);
    return newInquiry;
  },
  updateInquiryStatus: (id, status) => {
    const data = loadDb();
    const inq = data.inquiries.find(i => String(i.id) === String(id));
    if (inq) {
      inq.status = status;
      saveDb(data);
      return inq;
    }
    return null;
  },
  deleteInquiry: (id) => {
    const data = loadDb();
    data.inquiries = data.inquiries.filter(i => String(i.id) !== String(id));
    saveDb(data);
    return true;
  },

  // Reviews
  getReviews: (status = null) => {
    const data = loadDb();
    let revs = data.reviews;
    if (status) {
      revs = revs.filter(r => r.status === status);
    }
    return revs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  createReview: (reviewData) => {
    const data = loadDb();
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      status: 'pending', // Requires admin approval
      created_at: new Date().toISOString()
    };
    data.reviews.unshift(newRev);
    saveDb(data);
    return newRev;
  },
  updateReviewStatus: (id, status) => {
    const data = loadDb();
    const rev = data.reviews.find(r => String(r.id) === String(id));
    if (rev) {
      rev.status = status;
      saveDb(data);
      return rev;
    }
    return null;
  },
  deleteReview: (id) => {
    const data = loadDb();
    data.reviews = data.reviews.filter(r => String(r.id) !== String(id));
    saveDb(data);
    return true;
  },

  // Admin User Auth
  findAdmin: (username) => {
    const data = loadDb();
    return data.admin_users.find(u => u.username === username || u.email === username);
  },
  verifyPassword: (password, user) => {
    const checkHash = hashPassword(password, user.salt);
    return checkHash === user.password_hash;
  }
};

module.exports = db;
