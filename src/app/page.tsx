import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch active sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const { data: products } = await supabase
    .from('products')
    .select('*, sections(id, title), product_videos(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return <LandingPage products={products || []} sections={sections || []} settings={settings} />;
}
