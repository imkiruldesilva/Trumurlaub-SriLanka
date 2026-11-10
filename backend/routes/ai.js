// ===================================================================
// TRAUMURLAUB LANKA – AI ROUTE
// ===================================================================

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limit: 25 AI queries per minute per IP
const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 25,
  message: 'Traumurlaub AI rate limit reached. Please wait a moment or chat directly on WhatsApp (+94 777 978 768).'
});

router.post('/chat', aiLimiter, aiController.chat);

module.exports = router;
