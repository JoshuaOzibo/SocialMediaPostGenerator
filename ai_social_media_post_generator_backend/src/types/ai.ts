import { ImageResult } from '../services/imageService.js';

export interface PostGenerationRequest {
  inputBullets: string[];
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  tone: 'professional' | 'casual' | 'humorous' | 'formal' | 'friendly' | 'enthusiastic';
  additionalContext?: string;
  days?: number; // Number of days to generate posts for
  includeHashtags?: boolean; // Whether to include hashtags
  includeImages?: boolean; // Whether to include image suggestions
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
  imageSuggestions: string[];
  images?: ImageResult[]; // Full image objects with URLs and metadata
}

export interface ScheduledPost extends GeneratedPost {
  postingDate: string; // ISO date string for when this post should be published
  dayNumber: number; // Which day this post is for (1, 2, 3, etc.)
}

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
} 