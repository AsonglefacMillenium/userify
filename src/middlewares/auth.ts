import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../models/user.model";

export interface JwtPayload {
  id: string;
  role: Role;
}
export interface AuthRequest extends Request {
  user?: JwtPayload;
}


export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = auth.substring("Bearer ".length);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
