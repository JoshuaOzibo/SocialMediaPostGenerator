import type { PostGenerationRequest, GeneratedPost, ScheduledPost } from '../types/ai.js';
import { geminiClient } from './ai/geminiClient.js';
import { promptBuilder } from './ai/promptBuilder.js';
import { contentParser } from './ai/contentParser.js';
import { imageService} from './imageService.js';

export class ContentGenerationService {
  /**
   * Generate social media posts from bullet points
   */
  async generatePosts(request: PostGenerationRequest): Promise<GeneratedPost[]> {
    try {
      console.log('Starting post generation for request:', JSON.stringify(request, null, 2));
      
      const prompt = promptBuilder.buildPostGenerationPrompt(request);
      console.log('Generated prompt:', prompt);
      
      const aiResponse = await geminiClient.generateContent(prompt);
      console.log('AI Response:', JSON.stringify(aiResponse, null, 2));
      
      if (!aiResponse.success) {
        throw new Error(aiResponse.error || 'Failed to generate posts');
      }
      
      const posts = contentParser.parseGeneratedPosts(aiResponse.text);
      console.log('Parsed posts:', JSON.stringify(posts, null, 2));
      
      // Generate real images for each post if requested
      if (request.includeImages !== false) { // Default to true if not specified
        for (const post of posts) {
          const images = await imageService.generateImagesForPost(post.content, request.platform, request.tone, 3);
          post.imageSuggestions = images.map(img => img.url); // Store image URLs
          post.images = images; // Store full image objects
        }
      } else {
        // Clear image suggestions if not requested
        for (const post of posts) {
          post.imageSuggestions = [];
          post.images = [];
        }
      }
      
      // Generate hashtags for each post if requested
      if (request.includeHashtags !== false) { // Default to true if not specified
        for (const post of posts) {
          post.hashtags = await this.generateHashtags(post.content, request.platform);
        }
      } else {
        // Clear hashtags if not requested
        for (const post of posts) {
          post.hashtags = [];
        }
      }
      
      return posts;
    } catch (error) {
      console.error('Error generating posts:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error; // Re-throw the original error instead of wrapping it
    }
  }

  /**
   * Generate scheduled posts for multiple days
   */
  async generateScheduledPosts(request: PostGenerationRequest, scheduleDate: string): Promise<ScheduledPost[]> {
    try {
      const days = request.days || 1;
      const posts: ScheduledPost[] = [];
      
      // Generate base posts
      const basePosts = await this.generatePosts(request);
      
      // Create scheduled posts for each day
      for (let day = 1; day <= days; day++) {
        const basePost = basePosts[day - 1] || basePosts[0]; // Use first post as fallback
        
        // Calculate posting date
        const postingDate = new Date(scheduleDate);
        postingDate.setDate(postingDate.getDate() + day - 1); // Start from scheduleDate
        
        const scheduledPost: ScheduledPost = {
          ...basePost,
          postingDate: postingDate.toISOString().split('T')[0], // YYYY-MM-DD format
          dayNumber: day
        };
        
        posts.push(scheduledPost);
      }
      
      return posts;
    } catch (error) {
      console.error('Error generating scheduled posts:', error);
      throw error;
    }
  }

  /**
   * Generate hashtags for a given post
   */
  async generateHashtags(content: string, platform: string): Promise<string[]> {
    try {
      const prompt = promptBuilder.buildHashtagPrompt(content, platform);
      const aiResponse = await geminiClient.generateContent(prompt);
      
      if (!aiResponse.success) {
        console.error('Error generating hashtags:', aiResponse.error);
        return [];
      }
      
      return contentParser.parseHashtags(aiResponse.text);
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return [];
    }
  }

  /**
   * Generate image suggestions for a post
   */
  async generateImageSuggestions(content: string): Promise<string[]> {
    try {
      const prompt = promptBuilder.buildImageSuggestionPrompt(content);
      const aiResponse = await geminiClient.generateContent(prompt);
      
      if (!aiResponse.success) {
        console.error('Error generating image suggestions:', aiResponse.error);
        return [];
      }
      
      return contentParser.parseImageSuggestions(aiResponse.text);
    } catch (error) {
      console.error('Error generating image suggestions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const contentGenerationService = new ContentGenerationService(); 