"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true", // true for 465
    auth: {
        user: String(process.env.EMAIL_USER ?? ""),
        pass: String(process.env.EMAIL_PASS ?? ""),
    },
});
async function sendVerificationEmail(to, token) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@example.com",
        to,
        subject: "Verify your email",
        html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p><p>Or copy this token: <strong>${token}</strong></p>`,
    });
    return info;
}
