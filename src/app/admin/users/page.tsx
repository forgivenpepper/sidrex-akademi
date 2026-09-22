import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Mail, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { Profile } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Admin Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Fetch users (customers and admins)
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  const typedUsers = (users || []) as Profile[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Müşteriler ve Kullanıcılar
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sisteme kayıt olan tüm üyeleri buradan görüntüleyebilirsiniz.</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <span className="text-sm text-slate-400 font-medium">Toplam Kayıt:</span>
          <span className="text-lg font-bold text-blue-400">{typedUsers.length}</span>
        </div>
      </div>

      <div className="bg-[#0d1527] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4 font-semibold">Kullanıcı</th>
                <th className="p-4 font-semibold">Meslek / Firma</th>
                <th className="p-4 font-semibold">İletişim</th>
                <th className="p-4 font-semibold">Kayıt Tarihi</th>
                <th className="p-4 font-semibold text-center">Yetki</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {typedUsers.map((u) => {
                const isCustomer = u.role === 'customer';
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${isCustomer ? 'bg-gradient-to-br from-[#58b09c] to-[#408575]' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">
                            {u.full_name || 'İsimsiz Kullanıcı'}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            ID: {u.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{u.occupation || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4 shrink-0" />
                        {new Date(u.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isCustomer 
                          ? 'bg-[#58b09c]/10 text-[#58b09c] border border-[#58b09c]/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {!isCustomer && <ShieldCheck className="w-3.5 h-3.5" />}
                        {isCustomer ? 'Müşteri' : 'Yönetici'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {typedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Sisteme kayıtlı kullanıcı bulunamadı. Veya veritabanı okuma (RLS) yetkisi eksik olabilir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
