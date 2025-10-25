const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../controllers/emailController");
const { contactValidationRules, validate } = require("../middleware/validator");
const contactLimiter = require("../middleware/rateLimiter");

// POST /api/contact
router.post("/", contactLimiter, contactValidationRules(), validate, sendContactEmail);

module.exports = router;
