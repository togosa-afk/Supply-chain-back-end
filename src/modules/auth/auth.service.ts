import bcrypt from "bcrypt";
import User from "../../models/user";
import { type RegisterInput } from "./auth.types";

export const register = async (userData: RegisterInput) => {
  const password = await bcrypt.hash(userData.password, 12);
  const user = await User.create({ ...userData, password });
  const { password: _password, ...safeUser } = user.toJSON();
  return safeUser;
};

// get user by id 

const getByID = async (id:string) => {
  const user = await User.findByPk()
  return user
}

export default {
  register,
  getByID
}