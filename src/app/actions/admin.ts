'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { VideoType } from '@/lib/types/database';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Check if current user is admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Oturum açılmamış.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Bu işlem için admin yetkisi gerekiyor.');
  }

  return { supabase, user };
}

// -------------------------------------------------------------
// SECTIONS (KATEGORİ/BÖLÜM) ACTIONS
// -------------------------------------------------------------
export async function createSectionAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const title = formData.get('title') as string;
  const sort_order = parseInt((formData.get('sort_order') as string) || '0', 10);
  const slug = slugify(title) || `section-${Date.now()}`;

  const { error } = await supabase.from('sections').insert({
    title,
    slug,
    sort_order,
    is_active: true,
  });

  if (error) {
    throw new Error('Kategori eklenirken hata oluştu: ' + error.message);
  }

  revalidatePath('/admin/sections');
  revalidatePath('/');
}

export async function updateSectionAction(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const title = formData.get('title') as string;
  const sort_order = parseInt((formData.get('sort_order') as string) || '0', 10);
  const is_active = formData.get('is_active') === 'true';

  const { error } = await supabase
    .from('sections')
    .update({ title, sort_order, is_active })
    .eq('id', id);

  if (error) {
    throw new Error('Kategori güncellenirken hata oluştu: ' + error.message);
  }

  revalidatePath('/admin/sections');
  revalidatePath('/');
}

export async function deleteSectionAction(id: string): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) {
    throw new Error('Kategori silinirken hata oluştu: ' + error.message);
  }

  revalidatePath('/admin/sections');
  revalidatePath('/');
}

// -------------------------------------------------------------
// PRODUCTS (ÜRÜN & VİDEO) ACTIONS
// -------------------------------------------------------------

export async function saveProductAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const section_id = (formData.get('section_id') as string) || null;
  const description = formData.get('description') as string;
  const video_type = (formData.get('video_type') as VideoType) || 'youtube';
  const existing_video_url = (formData.get('existing_video_url') as string) || null;
  let video_url = (formData.get('video_url') as string) || '';

  if (!video_url.trim()) {
    video_url = existing_video_url || '';
  } else {
    video_url = video_url.trim();
  }

  // Prepend https:// if user entered domain without protocol (e.g. youtube.com..., youtu.be..., vimeo.com...)
  if (video_url && !video_url.startsWith('http://') && !video_url.startsWith('https://') && !video_url.startsWith('<iframe')) {
    video_url = `https://${video_url}`;
  }

  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  // Specs Key-Value JSON parsing
  const specsRaw = formData.get('specs') as string;
  let specs: Record<string, string> = {};
  try {
    if (specsRaw) {
      specs = JSON.parse(specsRaw);
    }
  } catch (e) {
    return { error: 'Teknik künye verisi geçersiz.' };
  }

  // File Uploads
  let thumbnail_url = formData.get('existing_thumbnail_url') as string || null;
  let storage_video_path = formData.get('existing_storage_video_path') as string || null;

  const thumbnail_url_input = formData.get('thumbnail_url_input') as string;

  if (thumbnail_url_input && thumbnail_url_input.trim() !== '') {
    thumbnail_url = thumbnail_url_input.trim();
  } else {
    const thumbnailFile = formData.get('thumbnail_file') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const filePath = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage
        .from('product-thumbnails')
        .upload(filePath, thumbnailFile);

      if (uploadErr) {
        return { error: 'Kapak görseli yüklenemedi: ' + uploadErr.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-thumbnails')
        .getPublicUrl(filePath);

      thumbnail_url = publicUrlData.publicUrl;
    }
  }

  const videoFile = formData.get('video_file') as File | null;
  if (video_type === 'upload' && videoFile && videoFile.size > 0) {
    const fileExt = videoFile.name.split('.').pop();
    const filePath = `videos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadErr } = await supabase.storage
      .from('product-videos')
      .upload(filePath, videoFile);

    if (uploadErr) {
      return { error: 'Video dosyası yüklenemedi: ' + uploadErr.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-videos')
      .getPublicUrl(filePath);

    storage_video_path = filePath;
    video_url = publicUrlData.publicUrl;
  }

  const slug = slugify(title) || `product-${Date.now()}`;

  const payload = {
    title,
    slug,
    section_id,
    description,
    specs,
    video_type,
    video_url,
    storage_video_path,
    thumbnail_url,
    is_published,
  };

  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) return { error: 'Ürün güncellenemedi: ' + error.message };
  } else {
    const { error } = await supabase.from('products').insert(payload);
    if (error) return { error: 'Ürün eklenemedi: ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function toggleProductPublishAction(id: string, currentState: boolean): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('products')
    .update({ is_published: !currentState })
    .eq('id', id);

  if (error) {
    throw new Error('Yayın durumu değiştirilemedi: ' + error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function deleteProductAction(id: string): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw new Error('Ürün silinemedi: ' + error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
}

/**
 * KLONLAMA / ÇOĞALTMA ÖZELLİĞİ (DUPLICATE PRODUCT)
 * Her satırda "Klonla (Duplicate)" butonu çalıştırır.
 * Mevcut ürünün başlığını "Kopya - [Ürün Adı]", künyesini, section bilgisini, 
 * video ve kapak görseli ayarlarını kopyalar ve yeni bir taslak (draft) kayıt oluşturur.
 */
export async function duplicateProductAction(id: string): Promise<void> {
  const { supabase } = await requireAdmin();

  // 1. Orijinal ürünü çek
  const { data: original, error: fetchErr } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !original) {
    throw new Error('Klonlanacak ürün bulunamadı.');
  }

  // 2. Yeni klon verilerini oluştur
  const newTitle = `Kopya - ${original.title}`;
  const newSlug = slugify(newTitle) + '-' + Math.random().toString(36).substring(2, 7);

  const duplicatePayload = {
    title: newTitle,
    slug: newSlug,
    section_id: original.section_id,
    description: original.description,
    specs: original.specs || {},
    video_type: original.video_type,
    video_url: original.video_url,
    storage_video_path: original.storage_video_path,
    thumbnail_url: original.thumbnail_url,
    is_published: false, // Her zaman taslak (draft) olarak klonlanır
  };

  const { error: insertErr } = await supabase.from('products').insert(duplicatePayload);

  if (insertErr) {
    throw new Error('Ürün klonlanırken hata oluştu: ' + insertErr.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
}
