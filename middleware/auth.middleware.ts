import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = auth.split(" ")[1];
  try {
    const payload = verifyJwt(token);
    // @ts-ignore
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
