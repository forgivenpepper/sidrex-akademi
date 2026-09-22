-- Çoklu video eklenebilmesi için product_videos tablosunu oluşturan script

CREATE TABLE IF NOT EXISTS product_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_type TEXT NOT NULL, -- 'youtube', 'link', 'embed', 'upload'
    video_url TEXT,
    thumbnail_url TEXT,
    storage_video_path TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) ayarları (Genel okuma izni)
ALTER TABLE product_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on product_videos" 
ON product_videos FOR SELECT 
TO anon, authenticated 
USING (true);
