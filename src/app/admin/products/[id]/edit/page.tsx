import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-blue-500" />
            Ürün Düzenle: {product.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Mevcut ürünün künyesini, görsel ve video kaynaklarını güncelleyin.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 text-sm rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Listeye Dön
        </Link>
      </div>

      <ProductForm product={product} sections={sections || []} />
    </div>
  );
}
