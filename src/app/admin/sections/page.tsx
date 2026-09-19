import { createClient } from '@/lib/supabase/server';
import { createSectionAction, updateSectionAction, deleteSectionAction } from '@/app/actions/admin';
import { Layers, Plus, Trash2, CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';

export default async function AdminSectionsPage() {
  const supabase = await createClient();
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Layers className="w-7 h-7 text-blue-500" />
          Kategori (Section) Yönetimi
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Müşteri vitrinindeki ürün kategorilerini oluşturun, sıralayın ve yayın durumlarını düzenleyin.
        </p>
      </div>

      {/* Create Section Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-400" />
          Yeni Kategori Ekle
        </h2>

        <form action={createSectionAction} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Kategori Adı
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Örn: CNC Makineleri, Paketleme Sistemleri..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-32">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Sıra No
            </label>
            <input
              type="number"
              name="sort_order"
              defaultValue={sections ? sections.length + 1 : 1}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </form>
      </div>

      {/* Sections Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Mevcut Kategoriler</h2>
          <span className="text-xs text-gray-400">Toplam {sections?.length || 0} kategori</span>
        </div>

        <div className="divide-y divide-white/5">
          {sections && sections.length > 0 ? (
            sections.map((sec) => (
              <div
                key={sec.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
                    {sec.sort_order}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">{sec.title}</h3>
                    <p className="text-xs text-gray-400 font-mono">slug: {sec.slug}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Toggle Form */}
                  <form action={updateSectionAction.bind(null, sec.id)}>
                    <input type="hidden" name="title" value={sec.title} />
                    <input type="hidden" name="sort_order" value={sec.sort_order} />
                    <input type="hidden" name="is_active" value={(!sec.is_active).toString()} />
                    <button
                      type="submit"
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        sec.is_active
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      {sec.is_active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Pasif</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Delete Form */}
                  <form action={deleteSectionAction.bind(null, sec.id)}>
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Henüz kategori eklenmemiş. Yukarıdaki formdan yeni kategori ekleyebilirsiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
