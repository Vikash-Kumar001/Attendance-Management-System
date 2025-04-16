import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html = null }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Attendance System" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
    };

    if (html) {
      mailOptions.html = html;
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
