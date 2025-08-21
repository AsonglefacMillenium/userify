import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type Role = "ADMIN" | "USER";
export type Status = "ACTIVE" | "INACTIVE";

interface UserAttributes {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "role" | "status"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public fullName!: string;
  public birthDate!: string;
  public email!: string;
  public password!: string;
  public role!: Role;
  public status!: Status;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("ADMIN", "USER"),
      defaultValue: "USER",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: { attributes: { include: ["password"] } },
    },
  }
);

export default User;
