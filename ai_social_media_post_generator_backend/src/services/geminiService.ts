// This file is now a compatibility layer that delegates to the new structured services
// For new code, use contentGenerationService directly

import { PostGenerationRequest, GeneratedPost } from '../types/ai.ts';
import { contentGenerationService } from './contentGenerationService.ts';

// Re-export types for backward compatibility
export type { PostGenerationRequest, GeneratedPost } from '../types/ai.ts';

/**
 * @deprecated Use contentGenerationService directly instead
 */
export class GeminiService {
  /**
   * Generate social media posts from bullet points
   */
  async generatePosts(request: PostGenerationRequest): Promise<GeneratedPost[]> {
    return contentGenerationService.generatePosts(request);
  }

  /**
   * Generate hashtags for a given post
   */
  async generateHashtags(content: string, platform: string): Promise<string[]> {
    return contentGenerationService.generateHashtags(content, platform);
  }

  /**
   * Generate image suggestions for a post
   */
  async generateImageSuggestions(content: string): Promise<string[]> {
    return contentGenerationService.generateImageSuggestions(content);
  }
}

// Export singleton instance for backward compatibility
export const geminiService = new GeminiService();

// Also export the new service for direct use
export { contentGenerationService };