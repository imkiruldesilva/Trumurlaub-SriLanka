// ===================================================================
// TRAUMURLAUB LANKA – INQUIRY CONTROLLER
// Validates, saves inquiry to database, and triggers email service
// ===================================================================

const db = require('../database/db');
const { sendInquiryEmail } = require('../services/emailService');

exports.submitInquiry = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      arrivalDate,
      departureDate,
      adults,
      children,
      tourPackage,
      excursion,
      accommodation,
      travelInterests,
      budget,
      message
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone/WhatsApp number are required.'
      });
    }

    const newInquiry = db.createInquiry({
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      country: String(country || '').trim(),
      arrivalDate: arrivalDate || null,
      departureDate: departureDate || null,
      adults: parseInt(adults, 10) || 1,
      children: parseInt(children, 10) || 0,
      tourPackage: tourPackage || '',
      excursion: excursion || '',
      accommodation: accommodation || '',
      travelInterests: travelInterests || '',
      budget: budget || '',
      message: message || ''
    });

    // Send email notification to Nirosh & admin in the background
    sendInquiryEmail(newInquiry).catch(err => {
      console.error('Failed to send inquiry email:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully.',
      inquiryId: newInquiry.id
    });
  } catch (error) {
    console.error('Error in submitInquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing inquiry.'
    });
  }
};
