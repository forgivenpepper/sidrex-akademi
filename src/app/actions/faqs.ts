'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addFaq(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const is_active = formData.get('is_active') === 'true';

  if (!question || !answer) return { error: 'Soru ve cevap alanları zorunludur.' };

  const { error } = await supabase
    .from('faqs')
    .insert({
      question,
      answer,
      sort_order,
      is_active
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateFaq(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

  const id = formData.get('id') as string;
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const is_active = formData.get('is_active') === 'true';

  if (!id || !question || !answer) return { error: 'Soru, cevap ve ID alanları zorunludur.' };

  const { error } = await supabase
    .from('faqs')
    .update({
      question,
      answer,
      sort_order,
      is_active
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
