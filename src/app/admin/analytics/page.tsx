import { createClient } from '@/lib/supabase/server';
import { MousePointerClick, Users, Layers, Clock, Search, Briefcase, MapPin } from 'lucide-react';

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createClient();
  const query = searchParams.q || '';

  // Query section clicks joined with user profile
  let dbQuery = supabase
    .from('section_clicks')
    .select('*, profiles(full_name, email, occupation, address, bio)')
    .order('created_at', { ascending: false });

  const { data: rawClicks } = await dbQuery;

  // Filter client side or by query
  const clicks = rawClicks
    ? rawClicks.filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        const profile = item.profiles;
        const nameMatch = profile?.full_name?.toLowerCase().includes(q);
        const emailMatch = profile?.email?.toLowerCase().includes(q);
        const secMatch = item.section_title?.toLowerCase().includes(q);
        return nameMatch || emailMatch || secMatch;
      })
    : [];

  const totalClicks = rawClicks?.length || 0;
  const uniqueUsersCount = rawClicks
    ? new Set(rawClicks.map((c) => c.user_id)).size
    : 0;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MousePointerClick className="w-7 h-7 text-blue-500" />
          Kullanıcı Kategori Tıklama Analitiği
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Hangi müşterinin ne zaman hangi kategoriye (section) tıkladığını ve ilgilendiğini gerçek zamanlı takip edin.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Toplam Kategori Tıklaması
            </span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalClicks} Tıklama</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Farklı Aktif Müşteri Sayısı
            </span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{uniqueUsersCount} Müşteri</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <form className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Müşteri adı, e-posta veya kategori adı ile ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 text-sm font-medium rounded-xl transition-all"
          >
            Filtrele
          </button>
        </form>
      </div>

      {/* Clicks Log Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            Tıklama Geçmişi ({clicks.length})
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {clicks.length > 0 ? (
            clicks.map((click) => {
              const profile = click.profiles;
              const formattedDate = new Date(click.created_at).toLocaleString('tr-TR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={click.id}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  {/* User Profile Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white text-base">
                        {profile?.full_name || 'İsimsiz Müşteri'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">({profile?.email})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      {profile?.occupation && (
                        <span className="flex items-center gap-1 text-gray-300">
                          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                          {profile.occupation}
                        </span>
                      )}
                      {profile?.address && (
                        <span className="flex items-center gap-1 text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          {profile.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Click Details */}
                  <div className="flex items-center space-x-4">
                    <div className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>{click.section_title}</span>
                    </div>

                    <div className="text-right text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Henüz kategori tıklama kaydı yok. Müşteriler vitrindeki kategori tab'larına tıkladığında burada canlı listelenecektir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
