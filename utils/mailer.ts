import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const info = await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p><p>Or copy this token: <strong>${token}</strong></p>`,
  });
  return info;
}
