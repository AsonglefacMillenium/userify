import User, { UserAttributes } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import jwt from "jsonwebtoken";
import AppError from "../utils/apperror";
import { SafeUser } from "../models/user.model";

export const register = async (
  fullName: string,
  birthDate: string,
  email: string,
  password: string
): Promise<SafeUser> => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError("Email already in use", 409);

  const hashed = await hashPassword(password);
  const created = await User.create({
    fullName,
    birthDate,
    email,
    password: hashed,
  });

  const {password: _pw, ...safeUser } = created.get({plain: true}) as UserAttributes;
  return created.toJSON() as UserAttributes;
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: UserAttributes; token: string }> => {
  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.status !== "ACTIVE") throw new AppError("Account is inactive", 403);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // hide password from response
  const plain = user.get({ plain: true }) as UserAttributes;

  delete (plain as any).password;

  return { user: plain, token };
};

export const getUserById = (id: string) => User.findByPk(id);

export const getUsers = () => User.findAll();

export const blockUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  user.status = "INACTIVE";
  await user.save();
  return user;
};
