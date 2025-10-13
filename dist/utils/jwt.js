"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "secret";
function signJwt(payload, expiresIn = process.env.JWT_EXPIRES_IN || "1h") {
    // jwt.sign typing in @types/jsonwebtoken is strict about the options object.
    // Cast the options to any to satisfy TypeScript while keeping runtime behavior.
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn });
}
function verifyJwt(token) {
    return jsonwebtoken_1.default.verify(token, SECRET);
}
