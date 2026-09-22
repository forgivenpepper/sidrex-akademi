'use client';

import { useState } from 'react';
import { updateSiteSettings } from '@/app/actions/settings';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface SettingsData {
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string | null;
  quick_start_title: string;
  quick_start_desc: string;
  quick_start_video_url: string | null;
}

export default function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0d1527] p-8 rounded-2xl border border-white/5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Ayarlar başarıyla güncellendi.
        </div>
      )}

      {/* Hero Alanı */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Hero (Tepe) Alanı</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Ana Başlık</label>
            <input
              type="text"
              name="hero_title"
              defaultValue={initialData.hero_title}
              required
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Alt Başlık (Görünmeyebilir)</label>
            <input
              type="text"
              name="hero_subtitle"
              defaultValue={initialData.hero_subtitle}
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-300">Arka Plan Resmi URL (Opsiyonel)</label>
            <input
              type="url"
              name="hero_bg_image"
              defaultValue={initialData.hero_bg_image || ''}
              placeholder="https://... (Boş bırakırsanız varsayılan hero_bg.png kullanılır)"
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">Dışarıdan bir resim linki yapıştırabilirsiniz.</p>
          </div>
        </div>
      </div>

      {/* Hızlı Başlangıç */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Hızlı Başlangıç Alanı</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-300">Başlık</label>
            <input
              type="text"
              name="quick_start_title"
              defaultValue={initialData.quick_start_title}
              required
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-300">Açıklama Metni</label>
            <textarea
              name="quick_start_desc"
              defaultValue={initialData.quick_start_desc}
              required
              rows={4}
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-300">Tanıtım Videosu URL (Opsiyonel)</label>
            <input
              type="url"
              name="quick_start_video_url"
              defaultValue={initialData.quick_start_video_url || ''}
              placeholder="https://..."
              className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Ayarları Kaydet</span>
        </button>
      </div>
    </form>
  );
}
