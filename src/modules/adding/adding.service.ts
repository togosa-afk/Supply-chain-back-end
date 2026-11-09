import { productRepository } from './adding.repository';
import type { ProductDto } from './adding.dto';
import { userRepository } from '../auth/auth.repository';
import { UserRole } from '../auth/auth.types';

const add = async (userId: string, data: ProductDto): Promise<void> => {
  const existing = await userRepository.findById(userId);

  if (!existing) throw new Error('USER_NOT_FOUND');

  if (existing.role !== UserRole.MANUFACTURER) {
    throw new Error('CAN\'T_ADD_PRODUCTS_WITH_THIS_ROLR');
  }

  await productRepository.create({
    ...data,
    combany_id: existing.id,
    company_name: existing.name,
  });
};

export const productService = {
  add,
};
