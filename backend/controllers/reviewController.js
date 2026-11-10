// ===================================================================
// TRAUMURLAUB LANKA – REVIEW CONTROLLER
// Public review endpoint (approved only) & Review submission flow
// ===================================================================

const db = require('../database/db');

exports.getPublicReviews = (req, res) => {
  try {
    // Only approved reviews are served publicly
    const reviews = db.getReviews('approved');
    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reviews.'
    });
  }
};

exports.submitReview = (req, res) => {
  try {
    const {
      customerName,
      country,
      email,
      tourPackage,
      travelDate,
      rating,
      title,
      message
    } = req.body;

    if (!customerName || !country || !email || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields.'
      });
    }

    const starRating = Math.min(Math.max(parseInt(rating, 10) || 5, 1), 5);

    const newReview = db.createReview({
      customerName: String(customerName).trim(),
      country: String(country).trim(),
      email: String(email).trim(),
      tourPackage: tourPackage || 'Customized Sri Lanka Tour',
      travelDate: travelDate || '',
      rating: starRating,
      title: String(title).trim(),
      message: String(message).trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted for moderation.',
      reviewId: newReview.id
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review.'
    });
  }
};
