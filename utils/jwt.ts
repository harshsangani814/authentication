import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export function signJwt(payload: object, expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1h") {
  // jwt.sign typing in @types/jsonwebtoken is strict about the options object.
  // Cast the options to any to satisfy TypeScript while keeping runtime behavior.
  return jwt.sign(payload, SECRET as any, { expiresIn } as any);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
