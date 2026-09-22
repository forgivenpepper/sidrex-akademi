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
    .select('*, sections(id, title)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return <LandingPage products={products || []} sections={sections || []} />;
}
