import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middlewares/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, email, password } = req.body;
    const user = await userService.register(fullName, birthDate, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await userService.login(email, password);
    res.json(token);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user!.role !== "ADMIN" && req.user!.id.toString() !== String(id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await userService.getUserById((id));
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user!.role !== "ADMIN" && req.user!.id.toString() !== String(id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await userService.blockUser((id));
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
