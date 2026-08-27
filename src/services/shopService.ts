import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Shop, AccountStatus } from '../types';

export const shopService = {
  /**
   * Fetch all shops from Supabase
   */
  fetchShops: async (): Promise<Shop[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shops from Supabase:', error);
        return [];
      }

      return (data || []).map((s: any) => ({
        id: s.id,
        name: s.shop_name,
        tagline: s.tagline || '',
        description: s.description || '',
        category: s.category,
        logo: s.logo_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
        banner: s.banner_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
        rating: Number(s.rating || 4.8),
        reviewCount: Number(s.review_count || 0),
        isOpen: Boolean(s.is_open),
        openingTime: s.opening_time || '07:00 AM',
        closingTime: s.closing_time || '10:00 PM',
        estimatedDeliveryTime: s.estimated_delivery_time || '20-30 min',
        distanceKm: 1.2,
        deliveryCharge: Number(s.delivery_charge || 30),
        address: s.address,
        area: s.area,
        city: s.city,
        pincode: s.pincode,
        phone: s.phone,
        isVerified: true,
        status: s.status as AccountStatus,
        ownerId: s.assigned_shopkeeper_id,
        rejectionReason: s.rejection_reason,
        registeredAt: s.created_at,
      }));
    } catch (err) {
      console.error('Shop fetch exception:', err);
      return [];
    }
  },

  /**
   * Fetch single shop by ID
   */
  fetchShopById: async (shopId: string): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.shop_name,
        tagline: data.tagline || '',
        description: data.description || '',
        category: data.category,
        logo: data.logo_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
        banner: data.banner_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
        rating: Number(data.rating || 4.8),
        reviewCount: Number(data.review_count || 0),
        isOpen: Boolean(data.is_open),
        openingTime: data.opening_time || '07:00 AM',
        closingTime: data.closing_time || '10:00 PM',
        estimatedDeliveryTime: data.estimated_delivery_time || '20-30 min',
        distanceKm: 1.2,
        deliveryCharge: Number(data.delivery_charge || 30),
        address: data.address,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        phone: data.phone,
        isVerified: true,
        status: data.status as AccountStatus,
        ownerId: data.assigned_shopkeeper_id,
        rejectionReason: data.rejection_reason,
        registeredAt: data.created_at,
      };
    } catch (err) {
      console.error('Shop detail exception:', err);
      return null;
    }
  },

  /**
   * Create a new shop (Admin or registration)
   */
  createShop: async (shop: Partial<Shop>): Promise<{ data?: Shop; error?: string }> => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([
          {
            shop_name: shop.name,
            tagline: shop.tagline || '',
            category: shop.category,
            description: shop.description || '',
            logo_url: shop.logo,
            banner_url: shop.banner,
            phone: shop.phone,
            address: shop.address,
            area: shop.area,
            city: shop.city,
            pincode: shop.pincode,
            opening_time: shop.openingTime || '07:00 AM',
            closing_time: shop.closingTime || '10:00 PM',
            is_open: shop.isOpen ?? true,
            delivery_charge: shop.deliveryCharge || 30,
            estimated_delivery_time: shop.estimatedDeliveryTime || '20-30 min',
            status: shop.status || 'active',
            assigned_shopkeeper_id: shop.ownerId || null,
          },
        ])
        .select()
        .single();

      if (error) return { error: error.message };

      return {
        data: {
          id: data.id,
          name: data.shop_name,
          tagline: data.tagline,
          description: data.description,
          category: data.category,
          logo: data.logo_url,
          banner: data.banner_url,
          rating: Number(data.rating || 4.8),
          reviewCount: Number(data.review_count || 0),
          isOpen: data.is_open,
          openingTime: data.opening_time,
          closingTime: data.closing_time,
          estimatedDeliveryTime: data.estimated_delivery_time,
          distanceKm: 1.2,
          deliveryCharge: Number(data.delivery_charge || 30),
          address: data.address,
          area: data.area,
          city: data.city,
          pincode: data.pincode,
          phone: data.phone,
          isVerified: true,
          status: data.status,
          ownerId: data.assigned_shopkeeper_id,
          registeredAt: data.created_at,
        },
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create shop' };
    }
  },

  /**
   * Update shop details
   */
  updateShop: async (shopId: string, updates: Partial<Shop>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.shop_name = updates.name;
      if (updates.tagline !== undefined) payload.tagline = updates.tagline;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.logo !== undefined) payload.logo_url = updates.logo;
      if (updates.banner !== undefined) payload.banner_url = updates.banner;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.address !== undefined) payload.address = updates.address;
      if (updates.area !== undefined) payload.area = updates.area;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.pincode !== undefined) payload.pincode = updates.pincode;
      if (updates.openingTime !== undefined) payload.opening_time = updates.openingTime;
      if (updates.closingTime !== undefined) payload.closing_time = updates.closingTime;
      if (updates.isOpen !== undefined) payload.is_open = updates.isOpen;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.ownerId !== undefined) payload.assigned_shopkeeper_id = updates.ownerId;
      if (updates.rejectionReason !== undefined) payload.rejection_reason = updates.rejectionReason;

      const { error } = await supabase.from('shops').update(payload).eq('id', shopId);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update shop' };
    }
  },

  /**
   * Delete shop (Admin only)
   */
  deleteShop: async (shopId: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const { error } = await supabase.from('shops').delete().eq('id', shopId);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to delete shop' };
    }
  },

  /**
   * Helper filter
   */
  filterShops: (shops: Shop[], query: string, category?: string, openOnly: boolean = false): Shop[] => {
    return shops.filter((shop) => {
      const matchesQuery =
        !query ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase()) ||
        shop.area.toLowerCase().includes(query.toLowerCase()) ||
        shop.description.toLowerCase().includes(query.toLowerCase());

      const matchesCat = !category || category === 'All' || shop.category === category;
      const matchesOpen = !openOnly || shop.isOpen;

      return matchesQuery && matchesCat && matchesOpen;
    });
  },
};
