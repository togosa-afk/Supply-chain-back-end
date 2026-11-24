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
    manufacturer_id: existing.id,
    company_name: existing.name,
  });

  return {
    id: product.id,
    name: product.name,
    quantity: product.quantity,
    company_name: product.company_name,
    manufacturer_id: product.manufacturer_id,
    min_order_qaun: product.min_order_qaun,
    max_order_qaun: product.max_order_qaun,
    img_url: product.img_url,
    discription: product.discription,
    is_active: product.is_active,
    created_at: new Date(product.created_at),
  };
};

export const productService = {
  add,
};
