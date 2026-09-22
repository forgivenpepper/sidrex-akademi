export type UserRole = 'admin' | 'customer';

export type VideoType = 'embed' | 'upload' | 'youtube' | 'link';

export interface SiteSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string | null;
  quick_start_title: string;
  quick_start_desc: string;
  quick_start_video_url: string | null;
  updated_at: string;
}


export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  occupation?: string | null;
  address?: string | null;
  bio?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Section {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type ProductSpecs = Record<string, string>;

export interface ProductVideo {
  id: string;
  product_id: string;
  title: string;
  video_type: VideoType;
  video_url: string | null;
  thumbnail_url: string | null;
  storage_video_path: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  section_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  specs: ProductSpecs;
  video_type: VideoType;
  video_url: string | null;
  storage_video_path: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  sections?: Section | null;
  product_videos?: ProductVideo[];
}

export interface SectionClick {
  id: string;
  user_id: string;
  section_id: string | null;
  section_title: string;
  created_at: string;
  profiles?: Profile | null;
}
