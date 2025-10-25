const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: {
    success: false,
    message: "너무 많은 요청이 발생했습니다. 1분 후에 다시 시도해주세요.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = contactLimiter;
