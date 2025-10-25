const transporter = require("../config/nodemailer");
const fs = require("fs");
const path = require("path");

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    // Load email template
    const templatePath = path.join(__dirname, "../templates/email.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders
    emailTemplate = emailTemplate
      .replace("{{name}}", name)
      .replace("{{email}}", email)
      .replace("{{phone}}", phone || "미입력")
      .replace("{{company}}", company || "미입력")
      .replace("{{message}}", message)
      .replace("{{timestamp}}", new Date().toLocaleString("ko-KR"));

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `[문의사항] ${name}님으로부터 새로운 문의가 도착했습니다`,
      html: emailTemplate,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({
      success: true,
      message: "문의사항이 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      success: false,
      message: "이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
};

module.exports = {
  sendContactEmail,
};
