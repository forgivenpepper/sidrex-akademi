import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FaqList from './FaqList';

export default async function FaqsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sıkça Sorulan Sorular (SSS)</h1>
          <p className="text-gray-400">
            Ana sayfadaki SSS bölümünü buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <FaqList initialFaqs={faqs || []} />
    </div>
  );
}
