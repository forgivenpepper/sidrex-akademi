'use client';

import { Profile } from '@/lib/types/database';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Video, Shield, LogOut, Mail, Search } from 'lucide-react';

interface HeaderProps {
  profile: Profile | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ profile, searchQuery, onSearchChange }: HeaderProps) {
  const generalMailto = `mailto:info@sidrex.com?subject=${encodeURIComponent(
    'Sidrex Platformu Genel Bilgi Talebi'
  )}&body=${encodeURIComponent('Merhaba Sidrex Ekibi,\n\nÜrün galeriniz hakkında detaylı görüşmek istiyorum.')}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#edf7f3] border border-[#d1eae1] text-[#58b09c] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#0b2545] group-hover:text-[#58b09c] transition-colors">
              Sidrex <span className="text-[#58b09c] font-normal">Galeri</span>
            </span>
            <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Premium Ürün & Video Kataloğu
            </span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ürün adı veya künye (ör. CNC, 15 kW) ile ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* General Contact Button */}
          <a
            href={generalMailto}
            className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#edf7f3] hover:bg-[#e2f3ec] border border-[#d1eae1] text-[#0b2545] text-xs font-semibold transition-all shadow-sm"
          >
            <Mail className="w-4 h-4 text-[#58b09c]" />
            <span>İletişim / Bize Ulaşın</span>
          </a>

          {/* Admin Panel Link (Only if Role === 'admin') */}
          {profile?.role === 'admin' && (
            <Link
              href="/admin/products"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#58b09c] hover:bg-[#449784] text-white text-xs font-semibold transition-all shadow-md shadow-[#58b09c]/20"
            >
              <Shield className="w-4 h-4" />
              <span>Yönetim Paneli</span>
            </Link>
          )}

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#0b2545] truncate max-w-[130px]">
                {profile?.full_name || 'Müşteri'}
              </span>
              <span className="text-[10px] text-[#58b09c] uppercase font-bold tracking-wider">
                {profile?.role || 'customer'}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
