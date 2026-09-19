'use client';

import { loginAction } from '@/app/actions/auth';
import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { Lock, Mail, Video, ArrowRight, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-[#58b09c]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Giriş Yapılıyor...</span>
        </>
      ) : (
        <>
          <span>Giriş Yap</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#edf7f3] border border-[#d1eae1] text-[#58b09c] mb-4 shadow-sm">
            <Video className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2545]">Sidrex Galeri</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">Müşteri Video Galeri & Ürün Vitrini Platformu</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#58b09c] via-[#449784] to-[#0b2545]" />

          <h2 className="text-lg font-bold text-[#0b2545] mb-6">Hesabınıza Giriş Yapın</h2>

          {state?.error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ornek@domain.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <SubmitButton />
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-[#58b09c] font-bold hover:underline transition-colors">
                Hemen Kaydolun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
