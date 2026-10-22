import User from '../../models/user';
import { UserRole, type globalRole } from './auth.types';
import type { RegisterDto } from './auth.dto';

const findByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

const findById = async (id: string) => {
  return User.findByPk(id);
};

const create = async (data: RegisterDto & { role: UserRole; password: string }) => {
  if (data.role === UserRole.SUPER_ADMIN) {
    throw new Error('CANNOT_REGISTER_SUPER_ADMIN');
  }
  return User.create(data);
};

const updateRole = async (id: string, role: globalRole): Promise<boolean> => {
  if ((role as UserRole) === UserRole.SUPER_ADMIN) {
    throw new Error('CANNOT_ASSIGN_SUPER_ADMIN');
  }
  const [affectedRows] = await User.update({ role }, { where: { id } });
  return affectedRows > 0;
};

export const userRepository = {
  findByEmail,
  findById,
  create,
  updateRole,
};
