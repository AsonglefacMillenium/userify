import { Request, Response, NextFunction, RequestHandler } from "express";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middlewares/auth";
import { SafeUser, UserAttributes } from "../models/user.model";

type RegisterBody = {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type IdParams = { id: string };

export const register: RequestHandler<
  {},
  SafeUser | { message: string },
  RegisterBody
> = async (req, res, next) => {
  try {
    const { fullName, birthDate, email, password } = req.body;
    const user: SafeUser = await userService.register(
      fullName,
      birthDate,
      email,
     password
    );
    res.status(201).json(user);
  } catch (err: unknown) {
    next(err);
  }
};

export const login: RequestHandler<
  {}, // params
  { user: SafeUser; token: string } | { message: string },
  LoginBody
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err: unknown) {
    next(err);
  }
};

export const getUser = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err: unknown) {
    next(err);
  }
};

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err: unknown) {
    next(err);
  }
};

export const blockUser = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await userService.blockUser(id);
    res.json(user);
  } catch (err: unknown) {
    next(err);
  }
};
