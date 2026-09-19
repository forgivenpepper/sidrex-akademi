-- =========================================================
-- Müşteri Video Galeri & Ürün Vitrini - SIDREX GERÇEK VERİ SETİ
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

-- Existing tables safety constraint update if slug was not unique
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

-- 8. SIDREX RESMİ KATEGORİLERİ (SECTIONS SEED)
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

-- 9. SIDREX GERÇEK ÜRÜNLERİ VE TEKNİK KÜNYELERİ (PRODUCTS SEED)
INSERT INTO public.products (section_id, title, slug, description, specs, video_type, video_url, thumbnail_url, is_published)
VALUES 
  -- Kolajenler
  (
    'c1000000-0000-0000-0000-000000000001',
    'Collagen Glow Complex',
    'collagen-glow-complex',
    'Tip 1 & Tip 3 hidrolize kolajen peptidleri, hyaluronik asit, C vitamini ve biyotin ile cilt parlaklığı ve esnekliği için özel formül.',
    '{"Form": "Saşe", "Gramaj": "30 Saşe", "Özellikler": "Şekersiz, Glütensiz, Tatlandırıcı İçermez", "Kullanım Şekli": "Günde 1 saşeyi 200 ml suda çözdürerek tüketeniz.", "Model Kodu": "SX-COL-GLOW"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000001',
    'Olivia — Eklem & Kemik Desteği',
    'olivia-eklem-kemik-destegi',
    'Tip 2 kolajen, akgünlük ekstratı (Boswellia), zencefil ve magnezyum ile eklem hareket kabiliyetini ve kıkırdak yapısını destekler.',
    '{"Form": "Kapsül", "Gramaj": "60 Kapsül", "Özellikler": "Glütensiz, Koruyucu İçermez", "Kullanım Şekli": "Günde 2 kapsül bol su ile alınır.", "Model Kodu": "SX-OLIVIA-EKL"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Bağışıklık Desteği
  (
    'c2000000-0000-0000-0000-000000000002',
    'Imuntus',
    'imuntus',
    'Kara mürver (Sambucus Nigra), C vitamini, Çinko ve Propolis içeren güçlü bağışıklık ve direnç takviyesi.',
    '{"Form": "Efervesan Tablet", "Gramaj": "20 Tablet", "Özellikler": "Vegan, Şekersiz, Glütensiz", "Kullanım Şekli": "Günde 1 tablet 200 ml suda eritilir.", "Model Kodu": "SX-IMUNTUS-EF"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c2000000-0000-0000-0000-000000000002',
    'Imuntus Sprey',
    'imuntus-sprey',
    'Propolis, meyan kökü ve nane aroması içeren ağız Boğaz spreyi. Hızlı emilim ve koruma sağlar.',
    '{"Form": "Sprey", "Gramaj": "30 ml", "Özellikler": "Alkol İçermez, Doğal Aroma", "Kullanım Şekli": "Günde 3 kez boğaza 2 puf püskürtülür.", "Model Kodu": "SX-IMUNTUS-SPR"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Bitkisel Ürünler
  (
    'c3000000-0000-0000-0000-000000000003',
    'Milk Thistle Complex',
    'milk-thistle-complex',
    'Devedikeni ekstratı (Silymarin), enginar ve karahindiba kökü ile karaciğer detoksu ve sindirim sağlığı takviyesi.',
    '{"Form": "Kapsül", "Gramaj": "60 Bitkisel Kapsül", "Özellikler": "Vegan, GDO İçermez", "Kullanım Şekli": "Günde 1-2 kapsül yemeklerden önce.", "Model Kodu": "SX-MILK-THISTLE"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c3000000-0000-0000-0000-000000000003',
    'Zzen',
    'zzen',
    'Passiflora (Çarkıfelek meyvesi ekstratı), L-Theanine ve Valerian kökü ile doğal rahatlama ve kaliteli uyku desteği.',
    '{"Form": "Kapsül", "Gramaj": "30 Kapsül", "Özellikler": "Bağımlılık Yapmaz, Vegan", "Kullanım Şekli": "Yatmadan 30 dk önce 1 kapsül.", "Model Kodu": "SX-ZZEN-STRESS"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c3000000-0000-0000-0000-000000000003',
    'Colovita',
    'colovita',
    'Sindirim enzim kompleksi ve bitkisel lifler ile mide ve bağırsak konforu sağlayan probiyotik ve prebiyotik formül.',
    '{"Form": "Saşe", "Gramaj": "14 Saşe", "Özellikler": "Glütensiz, Maya İçermez", "Kullanım Şekli": "Günde 1 saşe ılık suda çözdürülür.", "Model Kodu": "SX-COLOVITA-DIG"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Vitamin ve Mineraller
  (
    'c4000000-0000-0000-0000-000000000004',
    'Lipo Iron Complex – Demir',
    'lipo-iron-complex-demir',
    'Mide ve bağırsak hassasiyeti yaratmayan lipozomal teknolojiye sahip yüksek emilimli demir ve C vitamini.',
    '{"Form": "Kapsül", "Gramaj": "30 Kapsül", "Özellikler": "Lipozomal, Kabızlık Yapmaz", "Kullanım Şekli": "Günde 1 kapsül aç karnına.", "Model Kodu": "SX-LIPO-IRON"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c4000000-0000-0000-0000-000000000004',
    'Mag4Ever - Magnezyum',
    'mag4ever-magnezyum',
    'Magnezyum Sitrat, Bisglisinat, Malat ve Taurat bileşiminden oluşan 4 farklı magnezyum formu ile kas ve sinir sistemi takviyesi.',
    '{"Form": "Tablet", "Gramaj": "60 Tablet", "Özellikler": "4 Farklı Form, Yüksek Emilim", "Kullanım Şekli": "Günde 1-2 tablet tok karnına.", "Model Kodu": "SX-MAG4EVER-COMP"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c4000000-0000-0000-0000-000000000004',
    'Vitamin D3K2 Complex',
    'vitamin-d3k2-complex',
    'Zeytinyağı bazlı 1000 IU Vitamin D3 ve Menaquinon-7 (K2 vitamini) damla formu. Kalsiyum emilimini ve kemik sağlığını destekler.',
    '{"Form": "Damla", "Gramaj": "20 ml", "Özellikler": "Sızma Zeytinyağı Bazlı, Koruyucusuz", "Kullanım Şekli": "Günde 1 damla dil altına.", "Model Kodu": "SX-VIT-D3K2"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Kadın & Erkek Sağlığı
  (
    'c6000000-0000-0000-0000-000000000006',
    'Pro Men’s Once Daily',
    'pro-mens-once-daily',
    'Erkeklerin günlük enerji, performans ve hormon dengesini destekleyen 30 farklı vitamin, mineral ve Saw Palmetto kompleksi.',
    '{"Form": "Tablet", "Gramaj": "30 Tablet", "Özellikler": "Erkeklere Özel, Koenzim Q10 Destekli", "Kullanım Şekli": "Günde 1 tablet sabah tok karnına.", "Model Kodu": "SX-PRO-MENS"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c6000000-0000-0000-0000-000000000006',
    'Repro Women’s Once Daily',
    'repro-womens-once-daily',
    'Kadın sağlığı için folik asit, inositol, demir ve antioksidanlar içeren günlük multivitamin ve hormonal denge desteği.',
    '{"Form": "Tablet", "Gramaj": "30 Tablet", "Özellikler": "Kadınlara Özel, Folik Asit & Inositol", "Kullanım Şekli": "Günde 1 tablet tok karnına.", "Model Kodu": "SX-REPRO-WOMENS"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Özel Takviyeler
  (
    'c7000000-0000-0000-0000-000000000007',
    'Electrolyte Balance',
    'electrolyte-balance',
    'Pembe Himalaya deniz tuzu, 5 elekrolit kompleksi, C vitamini ve magnezyum ile hidrasyon ve dayanıklılık desteği.',
    '{"Form": "Stick Saşe", "Gramaj": "30 Saşe", "Özellikler": "Şekersiz, Vegan, Glütensiz, Koruyucu İçermez", "Kullanım Şekli": "Günde 1 stick saşeyi 500 ml suda çözdürünüz.", "Model Kodu": "SX-ELECTRO-BAL"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'c7000000-0000-0000-0000-000000000007',
    'Slm-X',
    'slm-x',
    'Yeşil çay ekstratı, L-Karnitin, Krom Pikolinat ve CLA içeren metabolizma hızlandırıcı ve kilo yönetimi takviyesi.',
    '{"Form": "Kapsül", "Gramaj": "60 Kapsül", "Özellikler": "Metabolizma Destekleyici, L-Karnitin", "Kullanım Şekli": "Spor öncesi veya yemekten önce 2 kapsül.", "Model Kodu": "SX-SLM-X-FIT"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1200&auto=format&fit=crop',
    true
  ),

  -- Fonksiyonel İçecekler
  (
    'c8000000-0000-0000-0000-000000000008',
    'Green Coffee Detox',
    'green-coffee-detox',
    'Kavrulmamış yeşil kahve çekirdeği ekstratı ve hindiba içeren antioksidan zengini detoks ve form içeceği.',
    '{"Form": "Toz Saşe", "Gramaj": "15 Saşe", "Özellikler": "Doğal Antioksidan, Ödem Atıcı", "Kullanım Şekli": "Günde 1 saşe sıcak veya soğuk suda karıştırılır.", "Model Kodu": "SX-GREEN-COFFEE"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    true
  )
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, specs = EXCLUDED.specs, description = EXCLUDED.description;
