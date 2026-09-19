-- =========================================================
-- Müşteri Video Galeri & Ürün Vitrini - Supabase SQL Migration
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

-- 2. Profiles Tablosu (Müşteri Bilgileri & Yetkileri)
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

CREATE POLICY "Kullanıcılar kendi profilini veya admin tüm profilleri okuyabilir"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir veya admin güncelleyebilir"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Adminler profil silebilir"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

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

-- 4. Sections Tablosu (Ürün Kategorileri / Bölümleri)
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Sections RLS
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Giriş yapmış tüm kullanıcılar aktif bölümleri okuyabilir"
  ON public.sections FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_active = true OR public.is_admin()));

CREATE POLICY "Sadece adminler bölüm ekleyebilir"
  ON public.sections FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Sadece adminler bölüm güncelleyebilir"
  ON public.sections FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Sadece adminler bölüm silebilir"
  ON public.sections FOR DELETE
  USING (public.is_admin());

-- 5. Products Tablosu (Ürünler & Videolar)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
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

-- Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Müşteriler yayınlanmış ürünleri, adminler tüm ürünleri okuyabilir"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_published = true OR public.is_admin()));

CREATE POLICY "Sadece adminler ürün ekleyebilir"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Sadece adminler ürün güncelleyebilir"
  ON public.products FOR UPDATE
  USING (public.is_admin());

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

CREATE POLICY "Giriş yapmış kullanıcılar kendi tıklama kaydını oluşturabilir"
  ON public.section_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sadece adminler tüm tıklama kayıtlarını okuyabilir"
  ON public.section_clicks FOR SELECT
  USING (public.is_admin());

-- 7. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-thumbnails', 'product-thumbnails', true),
  ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Product Thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-thumbnails');

CREATE POLICY "Public Read Product Videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-videos');

CREATE POLICY "Admin Insert Product Thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-thumbnails' AND public.is_admin());

CREATE POLICY "Admin Insert Product Videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-videos' AND public.is_admin());

CREATE POLICY "Admin Delete Product Media"
  ON storage.objects FOR DELETE
  USING ((bucket_id = 'product-thumbnails' OR bucket_id = 'product-videos') AND public.is_admin());

-- 8. Örnek Tohum Verileri (Seed Data)
INSERT INTO public.sections (id, title, slug, sort_order, is_active)
VALUES 
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Endüstriyel Makineler', 'endustriyel-makineler', 1, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Otomasyon Sistemleri', 'otomasyon-sistemleri', 2, true),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Laboratuvar Ekipmanları', 'laboratuvar-ekipmanlari', 3, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (section_id, title, slug, description, specs, video_type, video_url, thumbnail_url, is_published)
VALUES 
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Sidrex Pro-500 CNC Kesim Merkezi',
    'sidrex-pro-500-cnc-kesim-merkezi',
    'Yüksek hassasiyetli 5 eksenli CNC lazer ve freze kesim ünitesi. Ağır sanayi üretimine uygun yüksek hız ve dayanıklılık.',
    '{"Model Kodu": "SX-500-CNC", "Güç": "15 kW", "Çalışma Alanı": "3000 x 1500 mm", "Ağırlık": "4500 kg", "Garanti": "3 Yıl"}'::jsonb,
    'youtube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    true
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'RoboFlex-X10 Robotik Paketleme Kolu',
    'roboflex-x10-robotik-paketleme-kolu',
    'Hızlı ve hassas paletleme ve paketleme için geliştirilmiş AI destekli endüstriyel konveyör robotik kol.',
    '{"Model Kodu": "RF-X10-BOT", "Taşıma Kapasitesi": "25 kg", "Erişim Menzili": "1850 mm", "Hassasiyet": "±0.02 mm", "Hız": "120 çevrim/dk"}'::jsonb,
    'vimeo',
    'https://vimeo.com/76979871',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    true
  )
ON CONFLICT DO NOTHING;
