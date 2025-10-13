import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true", // true for 465
  auth: {
    user: String(process.env.EMAIL_USER ?? ""),
    pass: String(process.env.EMAIL_PASS ?? ""),
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@example.com",
    to,
    subject: "Verify your email",
    html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p><p>Or copy this token: <strong>${token}</strong></p>`,
  });
  return info;
}
