import { createClient } from '@/lib/supabase/server';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';
import { LayoutDashboard, Layers, Package, LogOut, ArrowLeft, ShieldCheck, MousePointerClick, Settings } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d1527] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
        <div>
          {/* Admin Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Yönetici Paneli</h1>
              <p className="text-xs text-gray-400">{profile?.full_name || user?.email}</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-200 hover:text-blue-400 transition-all font-medium text-sm"
            >
              <Package className="w-5 h-5" />
              <span>Ürünler & Videolar</span>
            </Link>

            <Link
              href="/admin/sections"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-200 hover:text-blue-400 transition-all font-medium text-sm"
            >
              <Layers className="w-5 h-5" />
              <span>Kategoriler (Sections)</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-200 hover:text-blue-400 transition-all font-medium text-sm"
            >
              <MousePointerClick className="w-5 h-5" />
              <span>Kategori Analitiği</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-200 hover:text-blue-400 transition-all font-medium text-sm"
            >
              <Settings className="w-5 h-5" />
              <span>Site Ayarları</span>
            </Link>

            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-gray-300 transition-all font-medium text-sm mt-6"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Müşteri Vitrinine Dön</span>
            </Link>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-white/10 mt-8 md:mt-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
