const rateLimiter = require('express-rate-limit');

// Импорт ошибок
const errorMessage = require('./constants');

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: errorMessage.tooManyRequests,
});

module.exports = limiter;
