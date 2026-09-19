import { createClient } from '@/lib/supabase/server';
import CustomerShowcase from '@/components/CustomerShowcase';
import { redirect } from 'next/navigation';

export default async function HomePage() {
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

  return (
    <CustomerShowcase
      products={products || []}
      sections={sections || []}
      profile={profile}
    />
  );
}
