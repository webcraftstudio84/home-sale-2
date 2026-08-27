export { supabase, isSupabaseConfigured } from './supabaseClient';
export { authService } from './authService';
export { shopService } from './shopService';
export { productService } from './productService';
export { customerService } from './customerService';
export { orderService } from './orderService';
export { deliveryService } from './deliveryService';
export { adminService } from './adminService';
export { shopkeeperService } from './shopkeeperService';
export { transactionService } from './transactionService';
export { storageService } from './storageService';

import { CartItem } from '../types';

export const cartService = {
  calculateSubtotal: (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
  checkMinimumOrder: (subtotal: number, minOrder: number = 150): { isMet: boolean; deficit: number; minAmount: number } => {
    const deficit = Math.max(0, minOrder - subtotal);
    return {
      isMet: subtotal >= minOrder,
      deficit,
      minAmount: minOrder,
    };
  },
};

