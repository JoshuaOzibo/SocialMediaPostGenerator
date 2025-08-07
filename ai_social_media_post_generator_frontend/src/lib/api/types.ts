// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

// Post Types
export type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
export type Tone = 'professional' | 'casual' | 'humorous' | 'formal' | 'friendly' | 'enthusiastic';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface Post {
  id: string;
  user_id: string;
  platform: Platform;
  tone: Tone;
  input_bullets: string[];
  generated_posts: string[];
  hashtags: string[];
  images: string[];
  image_metadata?: unknown[];
  scheduled_at?: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  platform: Platform;
  tone: Tone;
  input_bullets: string[];
  additionalContext?: string;
  scheduled_at?: string;
  days?: number;
  includeHashtags?: boolean;
  includeImages?: boolean;
  scheduleDate?: string;
}

export interface UpdatePostRequest {
  platform?: Platform;
  tone?: Tone;
  input_bullets?: string[];
  generated_posts?: string[];
  hashtags?: string[];
  images?: string[];
  scheduled_at?: string;
  status?: PostStatus;
}

export interface PostFilters {
  platform?: Platform;
  status?: PostStatus;
  tone?: Tone;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Query Keys for React Query
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: PostFilters) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    stats: () => [...queryKeys.posts.all, 'stats'] as const,
    scheduled: () => [...queryKeys.posts.all, 'scheduled'] as const,
  },
} as const;
