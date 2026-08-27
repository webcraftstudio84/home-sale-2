import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Address } from '../types';

export const customerService = {
  /**
   * Fetch customer saved addresses
   */
  fetchAddresses: async (userId: string): Promise<Address[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        return [];
      }

      return (data || []).map((a: any) => ({
        id: a.id,
        fullName: a.full_name,
        phone: a.phone,
        houseFlat: a.house,
        street: a.street,
        area: a.area,
        city: a.city,
        state: a.state || 'Karnataka',
        pincode: a.pincode,
        deliveryInstructions: a.delivery_instructions,
        isDefault: Boolean(a.is_default),
        tag: a.tag as any,
      }));
    } catch (err) {
      console.error('Addresses fetch exception:', err);
      return [];
    }
  },

  /**
   * Add new address
   */
  createAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<{ data?: Address; error?: string }> => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: userId,
            full_name: address.fullName,
            phone: address.phone,
            house: address.houseFlat,
            street: address.street,
            area: address.area,
            city: address.city,
            state: address.state || 'Karnataka',
            pincode: address.pincode,
            delivery_instructions: address.deliveryInstructions || '',
            is_default: address.isDefault ?? false,
            tag: address.tag || 'Home',
          },
        ])
        .select()
        .single();

      if (error) return { error: error.message };

      return {
        data: {
          id: data.id,
          fullName: data.full_name,
          phone: data.phone,
          houseFlat: data.house,
          street: data.street,
          area: data.area,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          deliveryInstructions: data.delivery_instructions,
          isDefault: data.is_default,
          tag: data.tag,
        },
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create address' };
    }
  },

  /**
   * Update address
   */
  updateAddress: async (id: string, updates: Partial<Address>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const payload: any = {};
      if (updates.fullName !== undefined) payload.full_name = updates.fullName;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.houseFlat !== undefined) payload.house = updates.houseFlat;
      if (updates.street !== undefined) payload.street = updates.street;
      if (updates.area !== undefined) payload.area = updates.area;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;
      if (updates.pincode !== undefined) payload.pincode = updates.pincode;
      if (updates.deliveryInstructions !== undefined) payload.delivery_instructions = updates.deliveryInstructions;
      if (updates.isDefault !== undefined) payload.is_default = updates.isDefault;
      if (updates.tag !== undefined) payload.tag = updates.tag;

      const { error } = await supabase.from('addresses').update(payload).eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update address' };
    }
  },

  /**
   * Delete address
   */
  deleteAddress: async (id: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to delete address' };
    }
  },

  /**
   * Fetch favorite shop IDs
   */
  fetchFavoriteShopIds: async (userId: string): Promise<string[]> => {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('shop_id')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data.map((item: any) => item.shop_id);
    } catch (err) {
      return [];
    }
  },

  /**
   * Toggle favorite shop in Supabase
   */
  toggleFavoriteShop: async (userId: string, shopId: string, isFav: boolean): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    try {
      if (isFav) {
        await supabase.from('favorite_shops').delete().match({ user_id: userId, shop_id: shopId });
      } else {
        await supabase.from('favorite_shops').insert({ user_id: userId, shop_id: shopId });
      }
    } catch (err) {
      console.warn('Toggle favorite error:', err);
    }
  },
};
