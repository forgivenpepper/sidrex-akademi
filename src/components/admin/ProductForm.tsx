'use client';

import { useState } from 'react';
import { saveProductAction } from '@/app/actions/admin';
import { useFormState } from 'react-dom';
import { Product, Section, VideoType } from '@/lib/types/database';
import {
  Package,
  Plus,
  Trash2,
  Video,
  Link as LinkIcon,
  Code,
  Youtube,
  FileImage,
  Save,
  CheckSquare,
  Square
} from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  sections: Section[];
}

interface SpecItem {
  id: string;
  key: string;
  value: string;
}

export default function ProductForm({ product, sections }: ProductFormProps) {
  const [state, formAction] = useFormState(saveProductAction, null);

  const initialSpecs: SpecItem[] = product?.specs
    ? Object.entries(product.specs).map(([key, value], idx) => ({
        id: `spec-${idx}-${Date.now()}`,
        key,
        value: String(value),
      }))
    : [
        { id: '1', key: 'Model Kodu', value: '' },
        { id: '2', key: 'Malzeme / Güç', value: '' },
      ];

  const [specs, setSpecs] = useState<SpecItem[]>(initialSpecs);
  const [videoType, setVideoType] = useState<VideoType>(product?.video_type || 'youtube');
  const [isPublished, setIsPublished] = useState<boolean>(product?.is_published ?? true);

  const addSpecRow = () => {
    setSpecs([...specs, { id: `spec-${Date.now()}`, key: '', value: '' }]);
  };

  const removeSpecRow = (id: string) => {
    setSpecs(specs.filter((s) => s.id !== id));
  };

  const updateSpecRow = (id: string, field: 'key' | 'value', val: string) => {
    setSpecs(
      specs.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const getSpecsJSON = () => {
    const dict: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) {
        dict[s.key.trim()] = s.value.trim();
      }
    });
    return JSON.stringify(dict);
  };

  return (
    <form action={formAction} className="space-y-8">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="specs" value={getSpecsJSON()} />
      <input type="hidden" name="is_published" value={isPublished ? 'true' : 'false'} />
      {product?.thumbnail_url && (
        <input type="hidden" name="existing_thumbnail_url" value={product.thumbnail_url} />
      )}
      {product?.video_url && (
        <input type="hidden" name="existing_video_url" value={product.video_url} />
      )}
      {product?.storage_video_path && (
        <input type="hidden" name="existing_storage_video_path" value={product.storage_video_path} />
      )}

      {state?.error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* Main Info Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Package className="w-5 h-5 text-blue-400" />
          Temel Ürün Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Ürün Başlığı *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={product?.title || ''}
              placeholder="Örn: Sidrex Pro-500 CNC Kesim Merkezi"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Kategori / Bölüm (Section)
            </label>
            <select
              name="section_id"
              defaultValue={product?.section_id || ''}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Kategori Seçiniz --</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Ürün / Video Açıklaması
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description || ''}
            placeholder="Ürünün öne çıkan özellikleri ve kullanım detayları..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Video & Media Source Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Video className="w-5 h-5 text-blue-400" />
          Video & Kapak Görseli Ayarları
        </h2>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Video Kaynağı Tipi
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'youtube', label: 'YouTube', icon: Youtube },
              { type: 'link', label: 'Link (MP4 / Video URL)', icon: LinkIcon },
              { type: 'embed', label: 'Embed İframe Kodu', icon: Code },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = videoType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setVideoType(item.type as VideoType)}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <input type="hidden" name="video_type" value={videoType} />
        </div>

        {videoType === 'embed' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              İframe Embed Kodu
            </label>
            <textarea
              name="video_url"
              rows={3}
              defaultValue={product?.video_url || ''}
              placeholder='<iframe width="560" height="315" src="..." ...></iframe>'
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              {videoType === 'youtube' ? 'YouTube Video Linki' : 'Video Linki (MP4, WebM veya herhangi bir video URL)'}
            </label>
            <input
              type="text"
              name="video_url"
              defaultValue={product?.video_url || ''}
              placeholder={
                videoType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
                  : 'https://example.com/video.mp4'
              }
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {videoType === 'link' && (
              <p className="text-xs text-slate-400 mt-1.5">
                💡 MP4, WebM linklerini buraya yapıştırın. Video direkt oynatılır, sağ tık ve indirme engellidir.
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Kapak Görseli Yükle (Thumbnail)
            </label>
            <input
              type="file"
              name="thumbnail_file"
              accept="image/*"
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 file:cursor-pointer bg-slate-900 border border-slate-700 rounded-xl p-2"
            />
          </div>

          {product?.thumbnail_url && (
            <div className="flex items-center space-x-3">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/20">
                <img
                  src={product.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-400">Mevcut kapak görseli</span>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC SPECS MANAGER CARD */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileImage className="w-5 h-5 text-blue-400" />
              Dinamik Teknik Künye Alanı (Key-Value)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Ürünün ölçü, malzeme, model kodu gibi tüm teknik özelliklerini dinamik olarak tanımlayın.
            </p>
          </div>

          <button
            type="button"
            onClick={addSpecRow}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Özellik Ekle
          </button>
        </div>

        <div className="space-y-3">
          {specs.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <input
                type="text"
                value={s.key}
                onChange={(e) => updateSpecRow(s.id, 'key', e.target.value)}
                placeholder="Özellik Adı (Örn: Güç)"
                className="w-1/3 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={s.value}
                onChange={(e) => updateSpecRow(s.id, 'value', e.target.value)}
                placeholder="Değer (Örn: 15 kW)"
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeSpecRow(s.id)}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                title="Satırı Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Status & Submit Footer */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => setIsPublished(!isPublished)}
          className="flex items-center space-x-3 text-sm font-medium text-gray-300"
        >
          {isPublished ? (
            <CheckSquare className="w-6 h-6 text-emerald-400" />
          ) : (
            <Square className="w-6 h-6 text-gray-500" />
          )}
          <span>
            Yayın Durumu: <strong className={isPublished ? 'text-emerald-400' : 'text-amber-400'}>{isPublished ? 'YAYINDA' : 'TASLAK (Draft)'}</strong>
          </span>
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{product?.id ? 'Ürünü Güncelle' : 'Ürünü Kaydet'}</span>
        </button>
      </div>
    </form>
  );
}
