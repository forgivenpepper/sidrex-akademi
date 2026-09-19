'use client';

import { Profile } from '@/lib/types/database';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Video, Shield, LogOut, Mail, User, Search } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Sidrex <span className="text-blue-500 font-normal">Galeri</span>
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-widest">
              Müşteri Ürün Vitrini
            </span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ürün adı veya künye (ör. CNC, 15 kW) ile ara..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* General Contact Button */}
          <a
            href={generalMailto}
            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold transition-all"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>İletişim / Bize Ulaşın</span>
          </a>

          {/* Admin Panel Link (Only if Role === 'admin') */}
          {profile?.role === 'admin' && (
            <Link
              href="/admin/products"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all shadow-md shadow-blue-500/10"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Yönetim Paneli</span>
            </Link>
          )}

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {profile?.full_name || 'Müşteri'}
              </span>
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                {profile?.role || 'customer'}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
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
