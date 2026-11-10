// ===================================================================
// TRAUMURLAUB LANKA – INQUIRIES ROUTE
// ===================================================================

const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limit: 10 inquiries per 15 minutes per IP
const inquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many inquiries submitted from this connection. Please try again in 15 minutes or message Nirosh directly on WhatsApp (+94 777 978 768).'
});

router.post('/', inquiryLimiter, inquiryController.submitInquiry);

module.exports = router;
