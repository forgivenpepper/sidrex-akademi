-- Site Settings Tablosu Oluşturma
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  hero_title text NOT NULL DEFAULT 'Sidrex Akademi',
  hero_subtitle text NOT NULL DEFAULT 'Eğitim ve Sertifikasyon Platformu',
  hero_bg_image text,
  quick_start_title text NOT NULL DEFAULT 'Hızlı Başlangıç & Panel Oryantasyonu',
  quick_start_desc text NOT NULL DEFAULT 'Bu bölüm, tarafımıza ileten içeriklerin (video, görseller) sistemine pratik, platformun en iyi şekilde kullanılmasını sağlar.',
  quick_start_video_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- RLS (Row Level Security) Aktifleştirme
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Okuma Yetkisi (Herkes okuyabilir)
CREATE POLICY "Site settings are viewable by everyone."
  ON public.site_settings FOR SELECT
  USING (true);

-- Güncelleme Yetkisi (Sadece Admin güncelleyebilir)
CREATE POLICY "Site settings are updatable by admin only."
  ON public.site_settings FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Ekleme Yetkisi (Sadece Admin ekleyebilir - İlk satır için)
CREATE POLICY "Site settings are insertable by admin only."
  ON public.site_settings FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Varsayılan (Başlangıç) Verisini Ekleme
INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
