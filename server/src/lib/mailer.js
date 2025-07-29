const nodemailer = require('nodemailer');
require('dotenv').config();

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
  console.log(`Attempting to send verification email to: ${to}`);
  
  // Validate required environment variables
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'BASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to,
    subject: "Verify your email address - Wearship Store",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-text {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
            text-align: center;
          }
          .verification-text {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .link-text {
            font-size: 14px;
            color: #718096;
            text-align: center;
            margin-top: 20px;
            word-break: break-all;
          }
          .footer {
            background-color: #f7fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            font-size: 14px;
            color: #718096;
            margin: 0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 4px;
            }
            .content {
              padding: 20px 15px;
            }
            .header {
              padding: 20px 15px;
            }
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Wearship!</h1>
          </div>
          
          <div class="content">
            <p class="welcome-text">Thank you for joining our community!</p>
            <p class="verification-text">
              To complete your registration and start shopping with us, please verify your email address by clicking the button below.
            </p>
            
            <div class="button-container">
              <a href="${verifyUrl}" class="verify-button">
                Verify Email Address
              </a>
            </div>
            
            <p class="link-text">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" style="color: #667eea;">${verifyUrl}</a>
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              This email was sent to verify your account. If you didn't create an account with Wearship Store, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to: ${to}`);
    return result;
  } catch (error) {
    console.error(`Failed to send verification email to ${to}:`, error);
    throw error;
  }
}

module.exports = { sendVerificationEmail }; 