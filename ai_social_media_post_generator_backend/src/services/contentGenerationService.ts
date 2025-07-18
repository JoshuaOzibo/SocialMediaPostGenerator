import { PostGenerationRequest, GeneratedPost } from '../types/ai.js';
import { geminiClient } from './ai/geminiClient.js';
import { promptBuilder } from './ai/promptBuilder.js';
import { contentParser } from './ai/contentParser.js';

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
      
      // Generate image suggestions for each post
      for (const post of posts) {
        post.imageSuggestions = await this.generateImageSuggestions(post.content);
      }
      
      return posts;
    } catch (error) {
      console.error('Error generating posts:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error; // Re-throw the original error instead of wrapping it
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