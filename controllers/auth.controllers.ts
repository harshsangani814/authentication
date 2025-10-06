import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";
import { signJwt, verifyJwt } from "../utils/jwt";
import { sendVerificationEmail } from "../utils/mailer";
import { Repository } from "typeorm";
import crypto from "crypto";

const userRepo: Repository<User> = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existing = await userRepo.findOneBy({ email });
  if (existing) return res.status(400).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(20).toString("hex");

  const user = userRepo.create({ email, password: hashed, verificationToken, isVerified: false });
  await userRepo.save(user);

  await sendVerificationEmail(email, verificationToken);

  return res.status(201).json({ message: "User registered. Verification email sent." });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token required" });

  const user = await userRepo.findOneBy({ verificationToken: token });
  if (!user) return res.status(400).json({ message: "Invalid token" });

  user.isVerified = true;
  user.verificationToken = null as any;
  await userRepo.save(user);

  return res.json({ message: "Email verified" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await userRepo.findOneBy({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

  const token = signJwt({ userId: user.id, email: user.email });
  return res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
};
