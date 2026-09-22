'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  
  const hero_title = formData.get('hero_title') as string;
  const hero_subtitle = formData.get('hero_subtitle') as string;
  const hero_bg_image = formData.get('hero_bg_image') as string;
  const quick_start_title = formData.get('quick_start_title') as string;
  const quick_start_desc = formData.get('quick_start_desc') as string;
  const quick_start_video_url = formData.get('quick_start_video_url') as string;

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      id: 1,
      hero_title,
      hero_subtitle,
      hero_bg_image: hero_bg_image || null,
      quick_start_title,
      quick_start_desc,
      quick_start_video_url: quick_start_video_url || null,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating site settings:', error);
    return { error: error.message };
  }

  // Revalidate the pages that use these settings
  revalidatePath('/');
  revalidatePath('/katalog');
  revalidatePath('/admin/settings');

  return { success: true };
}
