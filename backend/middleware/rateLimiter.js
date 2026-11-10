// ===================================================================
// TRAUMURLAUB LANKA – RATE LIMITER MIDDLEWARE
// In-Memory IP rate limiter for spam & bot abuse prevention
// ===================================================================

const ipRequests = new Map();

function createRateLimiter({ windowMs = 60000, maxRequests = 20, message = 'Too many requests, please try again later.' }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    const timestamps = ipRequests.get(ip).filter(time => now - time < windowMs);
    timestamps.push(now);
    ipRequests.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
}

module.exports = {
  createRateLimiter
};
