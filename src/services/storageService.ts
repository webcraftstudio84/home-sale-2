import { supabase, isSupabaseConfigured } from './supabaseClient';

export const storageService = {
  /**
   * Upload an image file to Supabase Storage and get back the public URL
   */
  uploadImage: async (
    bucket: 'shop-assets' | 'product-images' | 'avatars',
    path: string,
    file: File | Blob
  ): Promise<{ url?: string; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Fallback: return a temporary object URL or existing URL
      if (typeof file === 'object' && 'name' in file) {
        return { url: URL.createObjectURL(file) };
      }
      return { url: '' };
    }

    try {
      const fileExt = (file as File).name ? (file as File).name.split('.').pop() : 'jpg';
      const cleanPath = `${path}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage.from(bucket).upload(cleanPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        console.error(`Supabase storage upload error on ${bucket}:`, error);
        return { error: error.message };
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { url: urlData.publicUrl };
    } catch (err: any) {
      console.error('Storage upload exception:', err);
      return { error: err?.message || 'Failed to upload image' };
    }
  },
};
