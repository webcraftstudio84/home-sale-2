import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Shop } from '../types';

export const shopkeeperService = {
  /**
   * Fetch the assigned shop for a specific shopkeeper profile ID
   */
  fetchAssignedShop: async (shopkeeperId: string): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('assigned_shopkeeper_id', shopkeeperId)
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
        status: data.status,
        ownerId: data.assigned_shopkeeper_id,
        rejectionReason: data.rejection_reason,
        registeredAt: data.created_at,
      };
    } catch (err) {
      console.error('Fetch assigned shop exception:', err);
      return null;
    }
  },
};
