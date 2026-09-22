import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/LandingPage';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, image_url, video_url')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return <LandingPage products={products || []} />;
}
