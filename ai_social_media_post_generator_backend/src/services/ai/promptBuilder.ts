import { PostGenerationRequest } from '../../types/ai.js';
import { PLATFORM_GUIDELINES, TONE_GUIDELINES } from '../../constants/platformGuidelines.js';

export class PromptBuilder {
  /**
   * Build the prompt for post generation
   */
  buildPostGenerationPrompt(request: PostGenerationRequest): string {
    const platformGuidelines = PLATFORM_GUIDELINES[request.platform];
    const toneGuidelines = TONE_GUIDELINES[request.tone];
    
    return `
      You are an expert social media content creator. Generate 3 different ${request.platform} posts based on these bullet points:
      
      ${request.inputBullets.map(bullet => `• ${bullet}`).join('\n')}
      
      ${request.additionalContext ? `Additional context: ${request.additionalContext}` : ''}
      
      Platform: ${request.platform}
      ${platformGuidelines}
      
      Tone: ${request.tone}
      ${toneGuidelines}
      
      Requirements:
      1. Generate exactly 3 different posts
      2. Each post should be engaging and platform-optimized
      3. Include relevant hashtags at the end of each post
      4. Make each post unique in approach and style
      5. Ensure the content flows naturally and is compelling
      
      Format your response as:
      
      POST 1:
      [Post content here]
      #hashtag1 #hashtag2 #hashtag3
      
      POST 2:
      [Post content here]
      #hashtag1 #hashtag2 #hashtag3
      
      POST 3:
      [Post content here]
      #hashtag1 #hashtag2 #hashtag3
    `;
  }

  /**
   * Build the prompt for hashtag generation
   */
  buildHashtagPrompt(content: string, platform: string): string {
    return `
      Generate 5-8 relevant hashtags for this ${platform} post. 
      Make them popular, trending, and relevant to the content.
      Return only the hashtags separated by spaces, no other text.
      
      Post content: "${content}"
    `;
  }

  /**
   * Build the prompt for image suggestions
   */
  buildImageSuggestionPrompt(content: string): string {
    return `
      Suggest 3-5 types of images that would work well with this social media post.
      Focus on visual elements, themes, and concepts that complement the content.
      Return only the image descriptions, one per line, no numbering.
      
      Post content: "${content}"
    `;
  }
}

// Export singleton instance
export const promptBuilder = new PromptBuilder(); 