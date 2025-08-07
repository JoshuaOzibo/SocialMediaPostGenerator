import { api } from './client';
import { 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest, 
  PostFilters, 
  PostListResponse 
} from './types';

// Posts API endpoints
const POSTS_ENDPOINTS = {
  BASE: '/posts',
  STATS: '/posts/stats',
  SCHEDULED: '/posts/scheduled',
} as const;

// Posts API service
export const postsApi = {
  // Get all posts with filters
  getPosts: async (filters: PostFilters = {}): Promise<PostListResponse> => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const url = `${POSTS_ENDPOINTS.BASE}?${params.toString()}`;
    const response = await api.get<PostListResponse>(url);
    return response.data!;
  },

  // Get single post by ID
  getPost: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`${POSTS_ENDPOINTS.BASE}/${id}`);
    return response.data!;
  },

  // Create new post
  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await api.post<Post>(POSTS_ENDPOINTS.BASE, postData);
    return response.data!;
  },

  // Update post
  updatePost: async (id: string, postData: UpdatePostRequest): Promise<Post> => {
    const response = await api.put<Post>(`${POSTS_ENDPOINTS.BASE}/${id}`, postData);
    return response.data!;
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`${POSTS_ENDPOINTS.BASE}/${id}`);
  },

  // Regenerate post content
  regenerateContent: async (id: string): Promise<Post> => {
    const response = await api.post<Post>(`${POSTS_ENDPOINTS.BASE}/${id}/regenerate`);
    return response.data!;
  },

  // Get post statistics
  getStats: async (): Promise<{
    total: number;
    published: number;
    scheduled: number;
    draft: number;
    archived: number;
  }> => {
    const response = await api.get(POSTS_ENDPOINTS.STATS);
    return response.data!;
  },

  // Get scheduled posts
  getScheduledPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>(POSTS_ENDPOINTS.SCHEDULED);
    return response.data!;
  },

  // Bulk operations
  bulkDelete: async (ids: string[]): Promise<void> => {
    await api.post(`${POSTS_ENDPOINTS.BASE}/bulk-delete`, { ids });
  },

  bulkUpdate: async (ids: string[], updates: Partial<UpdatePostRequest>): Promise<Post[]> => {
    const response = await api.put<Post[]>(`${POSTS_ENDPOINTS.BASE}/bulk-update`, {
      ids,
      updates,
    });
    return response.data!;
  },

  // Export posts
  exportPosts: async (filters: PostFilters = {}, format: 'csv' | 'json' = 'json'): Promise<string> => {
    const params = new URLSearchParams();
    params.append('format', format);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const response = await api.get<string>(`${POSTS_ENDPOINTS.BASE}/export?${params.toString()}`);
    return response.data!;
  },
};
