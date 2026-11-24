// --- Input DTOs ---
export interface ProductDto {
  name: string;
  quantity: number;
  min_order_qaun: number;
  max_order_qaun: number;
  img_url: string;
  discription: string;
  category_id: string;
  unit_price: number;
}

// --- Output DTOs ---
export interface ProductResponseDto {
  id: string;
  name: string;
  quantity: number;
  manufacturer_id: string;
  company_name: string;
  min_order_qaun: number;
  max_order_qaun: number;
  img_url: string;
  discription: string;
  is_active: boolean;
  created_at: Date;
}
