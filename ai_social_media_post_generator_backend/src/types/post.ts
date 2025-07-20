
export interface Post {
  id: string;
  user_id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  tone: 'professional' | 'casual' | 'humorous' | 'formal' | 'friendly' | 'enthusiastic';
  input_bullets: string[];
  generated_posts: string[];
  hashtags: string[];
  images: string[];
  image_metadata?: any[]; // Full image objects with URLs and metadata
  scheduled_at?: string; // ISO Date String
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  user_id: string;
  platform: Post['platform'];
  tone: Post['tone'];
  input_bullets: string[];
  additionalContext?: string;
  scheduled_at?: string;
  days?: number; // Number of days to generate posts for
  includeHashtags?: boolean; // Whether to include hashtags
  includeImages?: boolean; // Whether to include image suggestions
  scheduleDate?: string; // The start date for posting (YYYY-MM-DD format)
}

export interface UpdatePostRequest {
  platform?: Post['platform'];
  tone?: Post['tone'];
  input_bullets?: string[];
  generated_posts?: string[];
  hashtags?: string[];
  images?: string[];
  scheduled_at?: string;
  status?: Post['status'];
}

export interface PostResponse {
  id: string;
  platform: Post['platform'];
  tone: Post['tone'];
  input_bullets: string[];
  generated_posts: string[];
  hashtags: string[];
  images: string[];
  image_metadata?: any[]; // Full image objects with URLs and metadata
  scheduled_at?: string;
  status: Post['status'];
  created_at: string;
  updated_at: string;
}

export interface PostListResponse {
  posts: PostResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GeneratePostRequest {
  inputBullets: string[];
  platform: Post['platform'];
  tone: Post['tone'];
  additionalContext?: string;
}

export interface PostFilters {
  platform?: Post['platform'];
  status?: Post['status'];
  tone?: Post['tone'];
  startDate?: string;
  endDate?: string;
  search?: string;
}
