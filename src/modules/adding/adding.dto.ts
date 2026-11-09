// --- Input DTOs ---
export interface ProductDto {
  name: string;
  quantity: number;
  min_avalabil_qaun: number;
  max_avalabil_qaun: number;
}

// --- Output DTOs ---
export interface ProductResponseDto {
  id: string;
  name: string;
  quantity: number;
  company_name: string;
  combany_id: string;
  min_avalabil_qaun: number;
  max_avalabil_qaun: number;
}
