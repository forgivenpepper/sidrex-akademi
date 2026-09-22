import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/LandingPage';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';


export default async function KatalogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch active sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Fetch published products (Joined with section details)
  const { data: products } = await supabase
    .from('products')
    .select('*, sections(id, title)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <LandingPage
      products={products || []}
      sections={sections || []}
      profile={profile}
      settings={settings}
    />
  );
}
