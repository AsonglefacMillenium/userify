import { Request, Response, NextFunction } from "express";
import AppError from "../utils/apperror";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Error) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ message: err.message });
  }

  console.error("Unknown error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};
