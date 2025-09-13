
export interface Post {
  id: string;
  user_id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  tone: 'professional' | 'casual' | 'humorous' | 'formal' | 'friendly' | 'enthusiastic';
  input_bullets: string[];
  generated_posts: string[];
  hashtags: string[];
  images: string[];
  image_metadata?: any[];
  individual_posts?: IndividualPostContent[];
  include_hashtags?: boolean;
  include_images?: boolean;
  days?: number;
  additional_context?: string;
  scheduled_at?: string; // ISO Date String
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// New interface for individual post content with its own hashtags and images
export interface IndividualPostContent {
  id: string; // Unique ID for each individual post
  content: string;
  hashtags: string[];
  images: string[];
  image_metadata?: any[];
  day_number?: number;
  posting_date?: string;
}

export interface CreatePostRequest {
  user_id: string;
  platform: Post['platform'];
  tone: Post['tone'];
  input_bullets: string[];
  additionalContext?: string;
  scheduled_at?: string;
  days?: number;
  includeHashtags?: boolean;
  includeImages?: boolean;
  scheduleDate?: string;
}

export interface UpdatePostRequest {
  platform?: Post['platform'];
  tone?: Post['tone'];
  input_bullets?: string[];
  generated_posts?: string[];
  hashtags?: string[];
  images?: string[];
  individual_posts?: IndividualPostContent[];
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
  image_metadata?: any[];
  individual_posts?: IndividualPostContent[];
 
  includeHashtags?: boolean;
  includeImages?: boolean;
  days?: number;
  additionalContext?: string;
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
