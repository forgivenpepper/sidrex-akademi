'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır.'),
  occupation: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'E-posta veya şifre hatalı!' };
  }

  redirect('/');
}

export async function registerAction(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const occupation = (formData.get('occupation') as string) || '';
  const address = (formData.get('address') as string) || '';
  const bio = (formData.get('bio') as string) || '';
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = registerSchema.safeParse({
    fullName,
    occupation,
    address,
    bio,
    email,
    password,
  });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sidrex-akademi.vercel.app';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: fullName,
        occupation,
        address,
        bio,
        role: 'customer',
      },
    },
  });

  if (error) {
    return { error: error.message || 'Kayıt yapılırken bir hata oluştu.' };
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      occupation,
      address,
      bio,
      role: 'customer',
    });
  }

  redirect('/');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
