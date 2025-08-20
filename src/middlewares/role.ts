import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const allowRoles = (...roles: Array<"ADMIN" | "USER">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
