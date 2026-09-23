import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch user and profile
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  // Fetch active sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const { data: products } = await supabase
    .from('products')
    .select('*, sections(id, title)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // Güvenli video çekimi (Tablo henüz oluşturulmamışsa ana sorguyu bozmamak için)
  let allVideos: any[] = [];
  try {
    const { data: vids, error: vidsError } = await supabase.from('product_videos').select('*');
    if (!vidsError && vids) {
      allVideos = vids;
    }
  } catch (e) {
    console.log('product_videos table might not exist yet');
  }

  // Videoları ürünlere eşleştir
  const productsWithVideos = products?.map(p => ({
    ...p,
    product_videos: allVideos.filter(v => v.product_id === p.id).sort((a, b) => a.sort_order - b.sort_order)
  }));

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return <LandingPage products={productsWithVideos || []} sections={sections || []} settings={settings} profile={profile} />;
}
