import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product } from '../types';

export const productService = {
  /**
   * Fetch products from Supabase (all or by shopId)
   */
  fetchProducts: async (shopId?: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (shopId) {
        query = query.eq('shop_id', shopId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return (data || []).map((p: any) => ({
        id: p.id,
        shopId: p.shop_id,
        name: p.product_name,
        description: p.description || '',
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        unit: p.unit || '1 unit',
        image: p.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
        inStock: Boolean(p.is_available),
        stockQuantity: Number(p.stock_quantity || 0),
        isVeg: Boolean(p.is_veg),
        isFeatured: Boolean(p.is_featured),
        rating: Number(p.rating || 4.8),
        reviewCount: Number(p.review_count || 0),
      }));
    } catch (err) {
      console.error('Product fetch exception:', err);
      return [];
    }
  },

  /**
   * Create product in Supabase
   */
  createProduct: async (product: Omit<Product, 'id'>): Promise<{ data?: Product; error?: string }> => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            shop_id: product.shopId,
            category: product.category,
            product_name: product.name,
            description: product.description || '',
            image_url: product.image,
            price: product.price,
            original_price: product.originalPrice,
            stock_quantity: product.stockQuantity,
            unit: product.unit,
            is_available: product.inStock,
            is_veg: product.isVeg ?? true,
            is_featured: product.isFeatured ?? false,
          },
        ])
        .select()
        .single();

      if (error) return { error: error.message };

      return {
        data: {
          id: data.id,
          shopId: data.shop_id,
          name: data.product_name,
          description: data.description,
          category: data.category,
          price: Number(data.price),
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          unit: data.unit,
          image: data.image_url,
          inStock: data.is_available,
          stockQuantity: Number(data.stock_quantity),
          isVeg: data.is_veg,
          isFeatured: data.is_featured,
          rating: Number(data.rating || 4.8),
          reviewCount: Number(data.review_count || 0),
        },
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create product' };
    }
  },

  /**
   * Update product
   */
  updateProduct: async (id: string, updates: Partial<Product>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.product_name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
      if (updates.unit !== undefined) payload.unit = updates.unit;
      if (updates.image !== undefined) payload.image_url = updates.image;
      if (updates.inStock !== undefined) payload.is_available = updates.inStock;
      if (updates.stockQuantity !== undefined) payload.stock_quantity = updates.stockQuantity;
      if (updates.isVeg !== undefined) payload.is_veg = updates.isVeg;
      if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;

      const { error } = await supabase.from('products').update(payload).eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update product' };
    }
  },

  /**
   * Toggle product stock availability
   */
  toggleStock: async (id: string, inStock: boolean): Promise<{ error?: string }> => {
    return productService.updateProduct(id, { inStock });
  },

  /**
   * Delete product
   */
  deleteProduct: async (id: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to delete product' };
    }
  },

  /**
   * Helper search & filter methods
   */
  getProductsByShop: (products: Product[], shopId: string): Product[] => {
    return products.filter((p) => p.shopId === shopId);
  },
  searchProducts: (products: Product[], query: string): Product[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  },
  getProductCategoriesForShop: (products: Product[], shopId: string): string[] => {
    const shopProds = products.filter((p) => p.shopId === shopId);
    const set = new Set(shopProds.map((p) => p.category));
    return Array.from(set);
  },
};
