-- ==============================================================================
-- HOMESALE MARKETPLACE — INITIAL SEED DATA
-- ==============================================================================

-- Categories
insert into public.categories (id, name, icon_name, image_url, item_count) values
  ('fruits-vegetables', 'Fruits & Vegetables', 'Apple', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80', 24),
  ('dairy-bakery', 'Dairy & Bakery', 'Milk', 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400&auto=format&fit=crop&q=80', 18),
  ('staples-grains', 'Staples & Grains', 'Wheat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80', 32),
  ('snacks-beverages', 'Snacks & Drinks', 'Coffee', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80', 45),
  ('pharmacy-health', 'Pharmacy & Health', 'Pill', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80', 15),
  ('household-care', 'Household & Cleaning', 'Sparkles', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=80', 28)
on conflict (id) do nothing;

-- Delivery Zones
insert into public.delivery_zones (id, name, city, area, pincodes, delivery_charge, minimum_order, is_active, estimated_time_min) values
  ('b0a11111-1111-4000-8000-000000000001', 'Koramangala Central', 'Bengaluru', 'Koramangala 1st-8th Block', array['560034', '560095', '560047'], 30.00, 150.00, true, 20),
  ('b0a11111-1111-4000-8000-000000000002', 'HSR Layout Hub', 'Bengaluru', 'HSR Sectors 1-7', array['560102', '560068'], 35.00, 150.00, true, 25),
  ('b0a11111-1111-4000-8000-000000000003', 'Indiranagar Zone', 'Bengaluru', 'Indiranagar 100ft & CMH Rd', array['560038', '560008'], 30.00, 150.00, true, 25),
  ('b0a11111-1111-4000-8000-000000000004', 'Whitefield Express', 'Bengaluru', 'Whitefield & ITPL', array['560066'], 40.00, 200.00, true, 35)
on conflict (id) do nothing;
