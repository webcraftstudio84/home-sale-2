import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DeliveryPartner, DeliveryZone } from '../types';

export const deliveryService = {
  /**
   * Fetch all delivery partners
   */
  fetchDeliveryPartners: async (): Promise<DeliveryPartner[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('delivery_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching delivery partners:', error);
        return [];
      }

      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        vehicleType: p.vehicle_type,
        vehicleNumber: p.vehicle_number || '',
        preferredArea: p.preferred_area || '',
        rating: Number(p.rating || 4.9),
        totalDeliveries: Number(p.total_deliveries || 0),
        todayEarnings: Number(p.today_earnings || 0),
        totalEarnings: Number(p.total_earnings || 0),
        status: p.status,
        approvalStatus: p.approval_status,
        currentOrderId: p.current_order_id,
        registeredAt: p.created_at,
        rejectionReason: p.rejection_reason,
      }));
    } catch (err) {
      console.error('Delivery partners fetch exception:', err);
      return [];
    }
  },

  /**
   * Create or register delivery partner
   */
  createDeliveryPartner: async (partner: Partial<DeliveryPartner>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const { error } = await supabase.from('delivery_partners').insert([
        {
          id: partner.id,
          name: partner.name,
          phone: partner.phone,
          email: partner.email,
          vehicle_type: partner.vehicleType || 'Bike',
          vehicle_number: partner.vehicleNumber || '',
          preferred_area: partner.preferredArea || '',
          status: partner.status || 'active',
          approval_status: partner.approvalStatus || 'active',
        },
      ]);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to create delivery partner' };
    }
  },

  /**
   * Update delivery partner profile/status
   */
  updateDeliveryPartner: async (id: string, updates: Partial<DeliveryPartner>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.vehicleType !== undefined) payload.vehicle_type = updates.vehicleType;
      if (updates.vehicleNumber !== undefined) payload.vehicle_number = updates.vehicleNumber;
      if (updates.preferredArea !== undefined) payload.preferred_area = updates.preferredArea;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.approvalStatus !== undefined) payload.approval_status = updates.approvalStatus;
      if (updates.rejectionReason !== undefined) payload.rejection_reason = updates.rejectionReason;
      if (updates.todayEarnings !== undefined) payload.today_earnings = updates.todayEarnings;
      if (updates.totalEarnings !== undefined) payload.total_earnings = updates.totalEarnings;
      if (updates.totalDeliveries !== undefined) payload.total_deliveries = updates.totalDeliveries;
      if (updates.currentOrderId !== undefined) payload.current_order_id = updates.currentOrderId;

      const { error } = await supabase.from('delivery_partners').update(payload).eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update delivery partner' };
    }
  },

  /**
   * Delete delivery partner (Admin only)
   */
  deleteDeliveryPartner: async (id: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const { error } = await supabase.from('delivery_partners').delete().eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to delete delivery partner' };
    }
  },

  /**
   * Fetch Delivery Zones
   */
  fetchDeliveryZones: async (): Promise<DeliveryZone[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase.from('delivery_zones').select('*').order('name');
      if (error) return [];
      return (data || []).map((z: any) => ({
        id: z.id,
        name: z.name,
        city: z.city,
        pincodes: z.pincodes || [],
        minimumOrderAmount: Number(z.minimum_order || 150),
        standardDeliveryCharge: Number(z.delivery_charge || 30),
        isActive: Boolean(z.is_active),
        estimatedTimeMin: Number(z.estimated_time_min || 25),
      }));
    } catch (err) {
      return [];
    }
  },

  /**
   * Add Delivery Zone
   */
  createDeliveryZone: async (zone: Omit<DeliveryZone, 'id'>): Promise<{ data?: DeliveryZone; error?: string }> => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .insert([
          {
            name: zone.name,
            city: zone.city,
            pincodes: zone.pincodes,
            delivery_charge: zone.standardDeliveryCharge,
            minimum_order: zone.minimumOrderAmount,
            is_active: zone.isActive,
            estimated_time_min: zone.estimatedTimeMin,
          },
        ])
        .select()
        .single();

      if (error) return { error: error.message };
      return {
        data: {
          id: data.id,
          name: data.name,
          city: data.city,
          pincodes: data.pincodes,
          minimumOrderAmount: Number(data.minimum_order),
          standardDeliveryCharge: Number(data.delivery_charge),
          isActive: data.is_active,
          estimatedTimeMin: Number(data.estimated_time_min),
        },
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create zone' };
    }
  },

  /**
   * Update Delivery Zone
   */
  updateDeliveryZone: async (id: string, updates: Partial<DeliveryZone>): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.pincodes !== undefined) payload.pincodes = updates.pincodes;
      if (updates.standardDeliveryCharge !== undefined) payload.delivery_charge = updates.standardDeliveryCharge;
      if (updates.minimumOrderAmount !== undefined) payload.minimum_order = updates.minimumOrderAmount;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;
      if (updates.estimatedTimeMin !== undefined) payload.estimated_time_min = updates.estimatedTimeMin;

      const { error } = await supabase.from('delivery_zones').update(payload).eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update zone' };
    }
  },

  /**
   * Delete Delivery Zone
   */
  deleteDeliveryZone: async (id: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};
    try {
      const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to delete zone' };
    }
  },

  /**
   * Local verification logic for deliverable pincodes
   */
  isPincodeDeliverable: (pincode: string, zones: DeliveryZone[]): { isDeliverable: boolean; zone?: DeliveryZone } => {
    const cleanPin = pincode.trim();
    for (const zone of zones) {
      if (zone.isActive && zone.pincodes.includes(cleanPin)) {
        return { isDeliverable: true, zone };
      }
    }
    return { isDeliverable: false };
  },

  /**
   * Delivery charge computation
   */
  calculateDeliveryCharge: (subtotal: number, zone?: DeliveryZone, shopCharge?: number): number => {
    if (zone && zone.standardDeliveryCharge !== undefined) {
      return zone.standardDeliveryCharge;
    }
    return shopCharge !== undefined ? shopCharge : 30;
  },
};
