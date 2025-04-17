const rateLimit = require('express-rate-limit');

// Basic rate limiting: 10 requests per minute
module.exports = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many requests, try again later.'
});

