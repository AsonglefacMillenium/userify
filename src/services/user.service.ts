import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import jwt from "jsonwebtoken";

export const register = async (
  fullName: string,
  birthDate: string,
  email: string,
  password: string
) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already in use");
  const hashed = await hashPassword(password);
  const created = await User.create({
    fullName,
    birthDate,
    email,
    password: hashed,
  });
  return created;
};

export const login = async (email: string, password: string) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  if (user.status !== "ACTIVE") throw new Error("Account is inactive");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return { user, token };
};

export const getUserById = (id: string) => User.findByPk(id);

export const getUsers = () => User.findAll();

export const blockUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  user.status = "INACTIVE";
  await user.save();
  return user;
};
