// ===================================================================
// TRAUMURLAUB LANKA – AI CONTROLLER
// Handles /api/ai/chat with conversation history & rate-limit check
// ===================================================================

const aiService = require('../services/aiService');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required.'
      });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const response = await aiService.getChatbotResponse(message, conversationHistory);

    return res.status(200).json({
      success: true,
      reply: response.reply,
      actions: response.actions
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat request.'
    });
  }
};
