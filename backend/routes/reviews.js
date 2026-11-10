// ===================================================================
// TRAUMURLAUB LANKA – REVIEWS ROUTE
// ===================================================================

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limit: 5 review submissions per 30 minutes
const reviewLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  maxRequests: 5,
  message: 'Review submission limit reached. Please wait before submitting another review.'
});

// GET /api/reviews (approved reviews only)
router.get('/', reviewController.getPublicReviews);

// POST /api/reviews (submit new review, default pending status)
router.post('/', reviewLimiter, reviewController.submitReview);

module.exports = router;
