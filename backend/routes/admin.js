// ===================================================================
// TRAUMURLAUB LANKA – ADMIN ROUTE
// ===================================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdminAuth } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Login rate limiter: max 10 attempts per 15 minutes to prevent brute-force
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

// Admin Auth
router.post('/login', loginLimiter, adminController.login);

// Inquiries Management (Protected)
router.get('/inquiries', requireAdminAuth, adminController.getInquiries);
router.patch('/inquiries/:id/status', requireAdminAuth, adminController.updateInquiryStatus);
router.delete('/inquiries/:id', requireAdminAuth, adminController.deleteInquiry);

// Reviews Moderation (Protected)
router.get('/reviews', requireAdminAuth, adminController.getReviews);
router.patch('/reviews/:id/status', requireAdminAuth, adminController.updateReviewStatus);
router.delete('/reviews/:id', requireAdminAuth, adminController.deleteReview);

module.exports = router;
