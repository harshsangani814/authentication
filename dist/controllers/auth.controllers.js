"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ormconfig_1 = require("../ormconfig");
const User_1 = require("../entities/User");
const jwt_1 = require("../utils/jwt");
const mailer_1 = require("../utils/mailer");
const crypto_1 = __importDefault(require("crypto"));
const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });
    const existing = await userRepo.findOneBy({ email });
    if (existing)
        return res.status(400).json({ message: "Email already used" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
    const user = userRepo.create({ email, password: hashed, verificationToken, isVerified: false });
    await userRepo.save(user);
    await (0, mailer_1.sendVerificationEmail)(email, verificationToken);
    return res.status(201).json({ message: "User registered. Verification email sent." });
};
exports.register = register;
const verifyEmail = async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(400).json({ message: "Token required" });
    const user = await userRepo.findOneBy({ verificationToken: token });
    if (!user)
        return res.status(400).json({ message: "Invalid token" });
    user.isVerified = true;
    user.verificationToken = null;
    await userRepo.save(user);
    return res.json({ message: "Email verified" });
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });
    const user = await userRepo.findOneBy({ email });
    if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
        return res.status(403).json({ message: "Please verify your email first" });
    const token = (0, jwt_1.signJwt)({ userId: user.id, email: user.email });
    return res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
};
exports.login = login;
