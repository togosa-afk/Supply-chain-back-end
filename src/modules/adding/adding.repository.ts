import Product from '../../models/product';
import type { ProductDto } from './adding.dto';

const create = async (data: ProductDto & { combany_id: string; company_name: string }) => {
  return Product.create(data);
};

export const productRepository = {
  create,
};
