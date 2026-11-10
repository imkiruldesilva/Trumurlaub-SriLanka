// ===================================================================
// TRAUMURLAUB LANKA – OFFICIAL PRODUCTION NODE.JS / EXPRESS SERVER
// ===================================================================

const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Basic Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Logging Middleware
app.use((req, res, next) => {
  if (!req.path.startsWith('/css') && !req.path.startsWith('/js') && !req.path.startsWith('/assets')) {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    company: 'Traumurlaub Lanka',
    founder: 'Nirosh',
    timestamp: new Date().toISOString()
  });
});

// Serve Static Frontend Files from Root Directory
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir, {
  extensions: ['html', 'htm'],
  index: 'index.html'
}));

// Fallback to index.html for clean client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const potentialPath = path.join(rootDir, req.path);
  if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
    return res.sendFile(potentialPath);
  }
  return res.sendFile(path.join(rootDir, 'index.html'));
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
===================================================================
🌴 TRAUMURLAUB LANKA – PRODUCTION WEB SERVER ONLINE
-------------------------------------------------------------------
Founder: Nirosh | 15+ Years Experience | 2,500+ Happy Guests
-------------------------------------------------------------------
Local Server URL:     http://localhost:${PORT}
Admin Portal URL:     http://localhost:${PORT}/admin/login.html
API Health:           http://localhost:${PORT}/api/health
Database Storage:     backend/data/database.json (Auto-initialized)
===================================================================
`);
});

module.exports = app;
