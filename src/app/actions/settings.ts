'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  // Kullanıcı yetkisini kontrol et
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

  const hero_title = formData.get('hero_title') as string;
  const hero_subtitle = formData.get('hero_subtitle') as string;
  const hero_bg_image = formData.get('hero_bg_image') as string;
  const quick_start_title = formData.get('quick_start_title') as string;
  const quick_start_desc = formData.get('quick_start_desc') as string;
  const quick_start_video_url = formData.get('quick_start_video_url') as string;

  // Önce tabloyu kontrol et - kayıt var mı?
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('id', 1)
    .single();

  let error;

  if (existing) {
    // Kayıt varsa güncelle (UPDATE)
    const result = await supabase
      .from('site_settings')
      .update({
        hero_title,
        hero_subtitle,
        hero_bg_image: hero_bg_image || null,
        quick_start_title,
        quick_start_desc,
        quick_start_video_url: quick_start_video_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);
    error = result.error;
  } else {
    // Kayıt yoksa oluştur (INSERT)
    const result = await supabase
      .from('site_settings')
      .insert({
        id: 1,
        hero_title,
        hero_subtitle,
        hero_bg_image: hero_bg_image || null,
        quick_start_title,
        quick_start_desc,
        quick_start_video_url: quick_start_video_url || null,
      });
    error = result.error;
  }

  if (error) {
    console.error('Site settings update error:', JSON.stringify(error));
    return { error: `Hata: ${error.message} (Code: ${error.code})` };
  }

  // Layout seviyesinde tüm sayfaları invalidate et
  revalidatePath('/', 'layout');

  return { success: true };
}
