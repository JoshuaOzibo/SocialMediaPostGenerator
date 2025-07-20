import { PostGenerationRequest } from '../../types/ai.js';
import { PLATFORM_GUIDELINES, TONE_GUIDELINES } from '../../constants/platformGuidelines.js';

export class PromptBuilder {
  /**
   * Build the prompt for post generation
   */
  buildPostGenerationPrompt(request: PostGenerationRequest): string {
    const platformGuidelines = PLATFORM_GUIDELINES[request.platform];
    const toneGuidelines = TONE_GUIDELINES[request.tone];
    const days = request.days || 1;
    const includeHashtags = request.includeHashtags !== false; // Default to true
    const includeImages = request.includeImages !== false; // Default to true
    
    return `
      You are an expert social media content creator. Generate ${days} different ${request.platform} posts based on these bullet points:
      
      ${request.inputBullets.map(bullet => `• ${bullet}`).join('\n')}
      
      ${request.additionalContext ? `Additional context: ${request.additionalContext}` : ''}
      
      Platform: ${request.platform}
      ${platformGuidelines}
      
      Tone: ${request.tone}
      ${toneGuidelines}
      
      Requirements:
      1. Generate exactly ${days} different posts
      2. Each post should be engaging and platform-optimized
      3. ${includeHashtags ? 'Include relevant hashtags at the end of each post' : 'Do not include hashtags'}
      4. Make each post unique in approach and style
      5. Ensure the content flows naturally and is compelling
      6. Each post should be suitable for posting on consecutive days
      
      Format your response as:
      
      ${Array.from({ length: days }, (_, i) => `POST ${i + 1}:
[Post content here]
${includeHashtags ? '#hashtag1 #hashtag2 #hashtag3' : ''}`).join('\n\n')}
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