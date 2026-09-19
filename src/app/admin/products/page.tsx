import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  toggleProductPublishAction,
  deleteProductAction,
  duplicateProductAction,
} from '@/app/actions/admin';
import {
  Package,
  Plus,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
} from 'lucide-react';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; section?: string };
}) {
  const supabase = await createClient();

  const query = searchParams.q || '';
  const sectionFilter = searchParams.section || '';

  // Fetch sections for filter
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true });

  // Build product query
  let dbQuery = supabase
    .from('products')
    .select('*, sections(title)')
    .order('created_at', { ascending: false });

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }
  if (sectionFilter) {
    dbQuery = dbQuery.eq('section_id', sectionFilter);
  }

  const { data: products } = await dbQuery;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-blue-500" />
            Ürün & Video Yönetimi
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ürün kataloğunuzu yönetin, teknik künyeleri düzenleyin ve tek tıkla ürün klonlayın.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Ürün adı ile ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            name="section"
            defaultValue={sectionFilter}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Kategoriler</option>
            {sections?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 text-sm font-medium rounded-xl transition-all"
          >
            Filtrele
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            Ürün Listesi ({products?.length || 0})
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {products && products.length > 0 ? (
            products.map((product) => {
              const specsCount = product.specs ? Object.keys(product.specs).length : 0;
              return (
                <div
                  key={product.id}
                  className="px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-lg bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0 relative">
                      {product.thumbnail_url ? (
                        <img
                          src={product.thumbnail_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Title & Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-base">{product.title}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {product.video_type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span>Kategori: {product.sections?.title || 'Kategorisiz'}</span>
                        <span>•</span>
                        <span>{specsCount} Künye Özelliği</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Publish Toggle Button */}
                    <form action={toggleProductPublishAction.bind(null, product.id, product.is_published)}>
                      <button
                        type="submit"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          product.is_published
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {product.is_published ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Yayında</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Taslak</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* KLONLA / DUPLICATE BUTTON */}
                    <form action={duplicateProductAction.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                        title="Ürünü Klonla (Kopya Oluştur)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Klonla</span>
                      </button>
                    </form>

                    {/* Edit Button */}
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-all"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete Form */}
                    <form action={deleteProductAction.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Henüz ürün eklenmemiş veya arama kriterine uygun kayıt bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
