// ===================================================================
// TRAUMURLAUB LANKA – ADMIN CONTROLLER
// Authentication, Inquiry Tracking & Review Moderation Logic
// ===================================================================

const db = require('../database/db');
const { generateToken } = require('../middleware/auth');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.'
    });
  }

  const user = db.findAdmin(username);
  if (!user || !db.verifyPassword(password, user)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid administrative credentials.'
    });
  }

  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    token,
    user: user.username,
    role: user.role
  });
};

exports.getInquiries = (req, res) => {
  try {
    const inquiries = db.getInquiries();
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInquiryStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = db.updateInquiryStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    return res.status(200).json({ success: true, inquiry: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInquiry = (req, res) => {
  try {
    const { id } = req.params;
    db.deleteInquiry(id);
    return res.status(200).json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = (req, res) => {
  try {
    const reviews = db.getReviews(); // Returns all statuses for admin moderation
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReviewStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const updated = db.updateReviewStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.status(200).json({ success: true, review: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = (req, res) => {
  try {
    const { id } = req.params;
    db.deleteReview(id);
    return res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
