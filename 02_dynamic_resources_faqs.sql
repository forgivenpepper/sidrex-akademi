-- site_settings tablosuna yeni sütunlar ekleme
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS register_guide_url text,
ADD COLUMN IF NOT EXISTS panel_guide_url text,
ADD COLUMN IF NOT EXISTS product_catalog_url text,
ADD COLUMN IF NOT EXISTS contract_center_url text;

-- SSS (FAQs) Tablosunu Oluşturma
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Aktifleştirme
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Okuma Yetkisi (Herkes okuyabilir)
CREATE POLICY "Faqs are viewable by everyone."
  ON public.faqs FOR SELECT
  USING (true);

-- Ekleme/Güncelleme/Silme Yetkisi (Sadece Admin)
CREATE POLICY "Faqs are insertable by admin only."
  ON public.faqs FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Faqs are updatable by admin only."
  ON public.faqs FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Faqs are deletable by admin only."
  ON public.faqs FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Örnek SSS Ekleme
INSERT INTO public.faqs (question, answer, sort_order)
VALUES 
('Sertifikasyon süreci nasıl işliyor?', 'Tüm eğitim modüllerini tamamladıktan sonra sistem size otomatik olarak bir dijital sertifika oluşturur. Bu sertifikayı PDF olarak indirebilirsiniz.', 1),
('Eğitim videolarını indirebilir miyim?', 'Güvenlik politikalarımız gereği eğitim videoları indirilemez, sadece platform üzerinden izlenebilir.', 2),
('Firma kodu olmadan üye olabilir miyim?', 'Hayır, sistemimize üye olabilmek için kurumunuz tarafından size verilen özel firma koduna sahip olmanız gerekmektedir.', 3)
ON CONFLICT DO NOTHING;
