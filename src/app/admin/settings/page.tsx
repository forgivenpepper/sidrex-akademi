import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Admin kontrolü layout'ta da yapılıyor ama burada da emin olmak iyi
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/katalog');
  }

  // Ayarları çek
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const defaultSettings = {
    hero_title: 'Sidrex Akademi',
    hero_subtitle: 'Eğitim ve Sertifikasyon Platformu',
    hero_bg_image: '',
    quick_start_title: 'Hızlı Başlangıç & Panel Oryantasyonu',
    quick_start_desc: 'Bu bölüm, tarafımıza ileten içeriklerin (video, görseller) sistemine pratik, platformun en iyi şekilde kullanılmasını sağlar.',
    quick_start_video_url: ''
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Site Ayarları</h1>
        <p className="text-gray-400">
          Ana sayfa üzerindeki metinleri, başlıkları ve arka planları buradan yönetebilirsiniz.
        </p>
      </div>

      <SettingsForm initialData={settings || defaultSettings} />
    </div>
  );
}
