const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - Required for Railway/Heroku/etc
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // 배포 시 환경 변수로 제한
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/contact", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});
