import { productRepository } from './adding.repository';
import type { ProductDto, ProductResponseDto } from './adding.dto';
import { userRepository } from '../auth/auth.repository';
import { UserRole } from '../auth/auth.types';

const add = async (userId: string, data: ProductDto): Promise<ProductResponseDto> => {
  const existing = await userRepository.findById(userId);

  if (!existing) throw new Error('USER_NOT_FOUND');

  if (existing.role !== UserRole.MANUFACTURER) {
    throw new Error('CAN\'T_ADD_PRODUCTS_WITH_THIS_ROLR');
  }

  const product = await productRepository.create({
    ...data,
    combany_id: existing.id,
    company_name: existing.name,
  });

  return {
    id: product.id,
    name: product.name,
    quantity: product.quantity,
    company_name: product.company_name,
    combany_id: product.combany_id,
    min_avalabil_qaun: product.min_avalabil_qaun,
    max_avalabil_qaun: product.max_avalabil_qaun,
  };
};

export const productService = {
  add,
};
