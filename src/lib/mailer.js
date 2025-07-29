const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    secure: false,
    requireTLS: true,
});

async function sendVerificationEmail(to, token) {
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: `"${process.env.MAILEROO_SENDER_NAME}" <${process.env.MAILEROO_FROM}>`,
        to,
        subject: "Verify your email address",
        html: `
          <p>Thank you for registering!</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };