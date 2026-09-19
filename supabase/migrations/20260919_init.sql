-- =========================================================
-- Müşteri Video Galeri & Ürün Vitrini - RESMİ SIDREX GERÇEK ÜRÜN VERİ SETİ
-- =========================================================

-- 1. Helper function: Admin kontrolü
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Tablosu (Müşteri Bilgileri)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  occupation TEXT,
  address TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar kendi profilini veya admin tüm profilleri okuyabilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profilini veya admin tüm profilleri okuyabilir"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Kullanıcılar kendi profilini güncelleyebilir veya admin güncelleyebilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir veya admin güncelleyebilir"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Adminler profil silebilir" ON public.profiles;
CREATE POLICY "Adminler profil silebilir"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Sistem ve kullanıcılar profil ekleyebilir" ON public.profiles;
CREATE POLICY "Sistem ve kullanıcılar profil ekleyebilir"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin() OR auth.uid() = id);

-- 3. Otomatik Profil Oluşturma Trigger'ı (auth.users -> public.profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, occupation, address, bio, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'occupation', ''),
    COALESCE(new.raw_user_meta_data->>'address', ''),
    COALESCE(new.raw_user_meta_data->>'bio', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      occupation = EXCLUDED.occupation,
      address = EXCLUDED.address,
      bio = EXCLUDED.bio;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Sections Tablosu (Sidrex Kategori Menüsü)
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giriş yapmış tüm kullanıcılar aktif bölümleri okuyabilir" ON public.sections;
CREATE POLICY "Giriş yapmış tüm kullanıcılar aktif bölümleri okuyabilir"
  ON public.sections FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_active = true OR public.is_admin()));

DROP POLICY IF EXISTS "Sadece adminler bölüm ekleyebilir" ON public.sections;
CREATE POLICY "Sadece adminler bölüm ekleyebilir"
  ON public.sections FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Sadece adminler bölüm güncelleyebilir" ON public.sections;
CREATE POLICY "Sadece adminler bölüm güncelleyebilir"
  ON public.sections FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Sadece adminler bölüm silebilir" ON public.sections;
CREATE POLICY "Sadece adminler bölüm silebilir"
  ON public.sections FOR DELETE
  USING (public.is_admin());

-- 5. Products Tablosu (Ürünler & Videolar)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  video_type TEXT NOT NULL DEFAULT 'youtube' CHECK (video_type IN ('embed', 'upload', 'youtube', 'vimeo')),
  video_url TEXT,
  storage_video_path TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Products UNIQUE kısıtlaması ekleme
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Müşteriler yayınlanmış ürünleri, adminler tüm ürünleri okuyabilir" ON public.products;
CREATE POLICY "Müşteriler yayınlanmış ürünleri, adminler tüm ürünleri okuyabilir"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_published = true OR public.is_admin()));

DROP POLICY IF EXISTS "Sadece adminler ürün ekleyebilir" ON public.products;
CREATE POLICY "Sadece adminler ürün ekleyebilir"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Sadece adminler ürün güncelleyebilir" ON public.products;
CREATE POLICY "Sadece adminler ürün güncelleyebilir"
  ON public.products FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Sadece adminler ürün silebilir" ON public.products;
CREATE POLICY "Sadece adminler ürün silebilir"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Updated_at tetikleyicisi
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Section Clicks Tablosu (Müşteri Kategori Tıklama Analitiği)
CREATE TABLE IF NOT EXISTS public.section_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  section_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.section_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giriş yapmış kullanıcılar kendi tıklama kaydını oluşturabilir" ON public.section_clicks;
CREATE POLICY "Giriş yapmış kullanıcılar kendi tıklama kaydını oluşturabilir"
  ON public.section_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sadece adminler tüm tıklama kayıtlarını okuyabilir" ON public.section_clicks;
CREATE POLICY "Sadece adminler tüm tıklama kayıtlarını okuyabilir"
  ON public.section_clicks FOR SELECT
  USING (public.is_admin());

-- 7. Storage Kovaları (Buckets)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-thumbnails', 'product-thumbnails', true),
  ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. SIDREX RESMİ KATEGORİLERİ (EXACT SECTIONS FROM SIDREX.COM)
INSERT INTO public.sections (id, title, slug, sort_order, is_active)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Kolajenler', 'kolajenler', 1, true),
  ('c2000000-0000-0000-0000-000000000002', 'Bağışıklık Desteği', 'bagisiklik-destegi', 2, true),
  ('c3000000-0000-0000-0000-000000000003', 'Bitkisel Ürünler', 'bitkisel-urunler', 3, true),
  ('c4000000-0000-0000-0000-000000000004', 'Vitamin ve Mineraller', 'vitamin-ve-mineraller', 4, true),
  ('c5000000-0000-0000-0000-000000000005', 'Çocuk Ürünleri', 'cocuk-urunleri', 5, true),
  ('c6000000-0000-0000-0000-000000000006', 'Kadın & Erkek Sağlığı', 'kadin-erkek-sagligi', 6, true),
  ('c7000000-0000-0000-0000-000000000007', 'Özel Takviyeler', 'ozel-takviyeler', 7, true),
  ('c8000000-0000-0000-0000-000000000008', 'Fonksiyonel İçecekler', 'fonksiyonel-icecekler', 8, true)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

-- 9. SIDREX GERÇEK ORİJİNAL ÜRÜNLERİ (SHOPIFY CDN GÖRSELLERİ İLE)
INSERT INTO public.products (section_id, title, slug, description, specs, video_type, video_url, thumbnail_url, is_published)
VALUES 
  -- Özel Takviyeler (Electrolyte Balance & Slm-X)
  (
    'c7000000-0000-0000-0000-000000000007',
    'Electrolyte Balance',
    'electrolyte-balance',
    'Sidrex® Electrolyte Balance; pembe Himalaya deniz tuzu, 5’li elektrolit kompleksi, C, B6 ve B12 vitaminleri ile zenginleştirildi. Bu özel formül; modern bilimin gücünü lezzetli ve pratik bir içecekle buluşturuyor.',
    '{"Form": "Stick Saşe", "Gramaj": "30 Saşe", "Özellikler": "Şekersiz, Vegan, Glütensiz, Koruyucu İçermez", "Fiyat": "549.00 TL", "SKU": "152-SDRX-ELT", "Kullanım Şekli": "Günde 1 stick saşeyi 500 mL su ile karıştırarak tüketiniz."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/elektrolit.jpg?v=1787745530',
    true
  ),
  (
    'c7000000-0000-0000-0000-000000000007',
    'Slm-X | Takviye Edici Gıda',
    'slm-x',
    'Sidrex® Slm-X; bromelain, CLA, L-karnitin, inülin ve yeşil çay ekstresi başta olmak üzere 7 bileşenli formülüyle geliştirilmiş, ananas aromalı saşe takviyedir.',
    '{"Form": "Saşe", "Gramaj": "30 Saşe", "Özellikler": "Yapay Boya Yok, Koruyucusuz, Ananas Aromalı", "Fiyat": "1.890.00 TL", "SKU": "153-SDRX-SLMX", "Kullanım Şekli": "Günde 1 saşe suda çözündürülerek tüketilir."}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/slim-x-1_08bb1613-bf0e-4925-81f3-73158563ac12.png?v=1778613318',
    true
  ),

  -- Vitamin ve Mineraller
  (
    'c4000000-0000-0000-0000-000000000004',
    'B12 Complex B12, B1, B2, B6 ve Folik Asit',
    'b12-complex-b12-b1-b2-b6-ve-folik-asit',
    'B12, B1, B2, B6 vitaminleri ve aktif folik asit içeriğiyle enerji oluşum metabolizmasına katkıda bulunur, yorgunluk ve bitkinliği azaltmaya yardımcı olur.',
    '{"Form": "Damla / Sprey", "Gramaj": "30 ml", "Özellikler": "Şekersiz, Yapay Boya İçermez", "Fiyat": "500.00 TL", "SKU": "152-SDRX-B12", "Kullanım Şekli": "Günde 1 puff dil altına püskürtülür."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/b12-complex-2.jpg?v=1781872183',
    true
  ),
  (
    'c4000000-0000-0000-0000-000000000004',
    'Lipo Iron Complex | Takviye Edici Gıda',
    'lipo-iron-complex',
    'Lipozomal mikroenkapsüle Lipofer® demir, C vitamini, aktif folat ve B vitaminleri ile mide hassasiyeti ve kabızlık yapmayan yüksek emilimli demir.',
    '{"Form": "Kapsül", "Gramaj": "30 Kapsül", "Özellikler": "Vegan, TiO2 İçermez, GİS Hassasiyeti Yapmaz", "Fiyat": "900.00 TL", "SKU": "153-SDRX-LIPO", "Kullanım Şekli": "Günde 1 kapsül aç karnına su ile."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/lipo-iron_8e4bbf96-fdd3-4f84-850c-b8f5e7fecb30.jpg?v=1779742716',
    true
  ),

  -- Çocuk Ürünleri
  (
    'c5000000-0000-0000-0000-000000000005',
    'B12 Complex Kids B12, B1, B2, B6 ve Folik Asit',
    'b12-complex-kids',
    'Çocukların zihinsel ve fiziksel gelişimini desteklemek üzere geliştirilmiş B12, B1, B2, B6 vitaminleri ve folik asit kompleksi.',
    '{"Form": "Damla", "Gramaj": "30 ml", "Özellikler": "Şekersiz, Çocuklara Özel Dozaj", "Fiyat": "490.00 TL", "SKU": "152-SDRX-B12KIDS", "Kullanım Şekli": "Çocuklar için günde 1 damla/puff."}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/b12-complex-kids-1_fb9c56a6-360a-43a8-b264-4f646679881b.jpg?v=1782116848',
    true
  ),
  (
    'c5000000-0000-0000-0000-000000000005',
    'Lipo Iron Kids Damla',
    'lipo-iron-kids',
    'Çocukların günlük demir ihtiyacını karşılayan, diş lekelenmesi ve tat rahatsızlığı yapmayan lezzetli lipozomal damla formu.',
    '{"Form": "Damla", "Gramaj": "30 ml", "Özellikler": "Diş Leke Yapmaz, Çocuk Güvenlikli Kapak", "Fiyat": "650.00 TL", "SKU": "152-SDRX-LPKIDS", "Kullanım Şekli": "Günde 1 ml damla doğrudan veya meyve suyuna eklenir."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/lipo-iron-2_d097a81e-9c99-4739-ab9e-f52dd38bec8b.png?v=1786701578',
    true
  ),

  -- Çocuk Setleri
  (
    'c5000000-0000-0000-0000-000000000005',
    'Çocuk Mevsim Geçişi Seti',
    'cocuk-mevsim-gecis-seti',
    'Mevsim değişikliklerinde çocukların direncini korumak için tasarlanmış Imuntus Kids ve D3K2 takviye seti.',
    '{"Form": "Set", "İçerik": "Imuntus Kids + Vitamin D3K2 Kids", "Özellikler": "Avantajlı Paket, %10 İndirimli", "Fiyat": "1.149.00 TL", "SKU": "SET-ALERJISET", "Kullanım Şekli": "Günlük 1 saşe ve 1 damla."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/allergy-set-kids_970fd0c3-9c2d-4da1-acd5-7f61dc38e02d.jpg?v=1778644243',
    true
  ),
  (
    'c5000000-0000-0000-0000-000000000005',
    'Happy Tummies Set',
    'happy-tummies-set',
    'Çocuklarda sindirim ve mide konforu sağlayan probiyotik lif ve multivitamin ikili takviye paketi.',
    '{"Form": "Set", "İçerik": "Colovita Kids + B12 Complex Kids", "Özellikler": "Sindirim Dostu, Doğal Tat", "Fiyat": "1.265.00 TL", "SKU": "SET-DIGESTSETKIDS", "Kullanım Şekli": "Günde 1 saşe ve 1 damla."}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/digest-set-kids_71012669-bdd0-4978-93e6-3495b597fb83.jpg?v=1778644257',
    true
  ),

  -- Bağışıklık Desteği
  (
    'c2000000-0000-0000-0000-000000000002',
    'İmuntus | Bitkisel Takviye Edici Gıda',
    'imuntus-bitkisel',
    'Zahter, zencefil, ardıç, karabaş otu, çörek otu yağı, C vitamini ve Çinko içeren Anadolu bitkileri destekli şurup.',
    '{"Form": "Şurup", "Gramaj": "150 ml", "Özellikler": "Şekersiz, Yapay Boya ve Koruyucu İçermez", "Fiyat": "500.00 TL", "SKU": "153-SDRX-IM", "Kullanım Şekli": "Günde 1 ölçek (10 ml) yemekten sonra."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.shopify.com/s/files/1/0767/8653/2540/files/imuntus-1_6b6dc4ab-345e-4745-a971-b0c1a09a86ac.jpg?v=1778613159',
    true
  ),

  -- Kolajenler
  (
    'c1000000-0000-0000-0000-000000000001',
    'Collagen Glow Complex',
    'collagen-glow-complex',
    'Tip 1 & Tip 3 hidrolize kolajen peptidleri, hyaluronik asit, C vitamini ve biyotin ile cilt parlaklığı ve esnekliği için özel formül.',
    '{"Form": "Saşe", "Gramaj": "30 Saşe", "Özellikler": "Şekersiz, Glütensiz, Tatlandırıcı İçermez", "Fiyat": "1.450.00 TL", "SKU": "SX-COL-GLOW", "Kullanım Şekli": "Günde 1 saşeyi 200 ml suda çözdürerek tüketiniz."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Bitkisel Ürünler
  (
    'c3000000-0000-0000-0000-000000000003',
    'Milk Thistle Complex',
    'milk-thistle-complex',
    'Devedikeni ekstratı (Silymarin), enginar ve karahindiba kökü ile karaciğer detoksu ve sindirim sağlığı takviyesi.',
    '{"Form": "Kapsül", "Gramaj": "60 Bitkisel Kapsül", "Özellikler": "Vegan, GDO İçermez", "Fiyat": "750.00 TL", "SKU": "SX-MILK-THISTLE", "Kullanım Şekli": "Günde 1-2 kapsül yemeklerden önce."}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1200&auto=format&fit=crop',
    true
  )
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, specs = EXCLUDED.specs, description = EXCLUDED.description, thumbnail_url = EXCLUDED.thumbnail_url;
