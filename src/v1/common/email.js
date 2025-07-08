import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { EMAIL_SUBJECTS, MESSAGE } from "./constants.js";
import { env } from "../config/env.config.js";
import { logMessage } from "../middlewares/logger.js";

/**
 * Sends an email using nodemailer.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 * @param {Array<Object>} [options.attachments] - Attachments array (nodemailer format)
 * @returns {Promise<Object>} - Result of the email sending
 */

export async function sendMail({ to, subject, text, html, attachments }) {
     const transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          auth: {
               user: env.SMTP_USER,
               pass: env.SMTP_PASS
          }
     });

     const mailOptions = {
          from: env.SMTP_FROM,
          to,
          subject,
          text,
          html,
          ...(attachments && { attachments })
     };

     try {
          await transporter.sendMail(mailOptions);
          return { success: 1, message: MESSAGE.EMAIL_SENT_SUCCESS };
     } catch (error) {
          logMessage(error);
          return { success: 0, message: error.message };
     }
}

/**
 * function to send an OTP email using an EJS template.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.otp - OTP code
 * @param {number|string} params.otp_expiry - OTP expiry in minutes
 * @returns {Promise<Object>} - Result of the email sending
 */

export async function sendOtpEmail({ to, name, otp, otp_expiry }) {
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);
     const templatePath = path.join(__dirname, "templates", "otp-email.ejs");

     // Render the EJS template
     const html = await ejs.renderFile(templatePath, { name, otp, otp_expiry });

     // Send the email
     return sendMail({
          to,
          subject: EMAIL_SUBJECTS.OTP,
          text: `Hello ${name},\nYour OTP is: ${otp}. It will expire in ${otp_expiry} minutes.`, // Fallback text if HTML fails
          html
     });
}

/**
 * function to send a password reset OTP email using an EJS template.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.otp - OTP code
 * @param {number|string} params.otp_expiry - OTP expiry in minutes
 * @returns {Promise<Object>} - Result of the email sending
 */
export async function sendPasswordResetOtpEmail({ to, name, otp, otp_expiry }) {
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);
     const templatePath = path.join(__dirname, "templates", "password-reset-otp-email.ejs");

     // Render the EJS template
     const html = await ejs.renderFile(templatePath, { name, otp, otp_expiry });

     // Send the email
     return sendMail({
          to,
          subject: EMAIL_SUBJECTS.PASSWORD_RESET_OTP,
          text: `Hello ${name},\nYour password reset OTP is: ${otp}. It will expire in ${otp_expiry} minutes.`,
          html
     });
}
