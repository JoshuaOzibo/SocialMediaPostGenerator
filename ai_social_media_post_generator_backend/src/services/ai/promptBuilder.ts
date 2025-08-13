import { PostGenerationRequest } from '../../types/ai.ts';
import { PLATFORM_GUIDELINES, TONE_GUIDELINES } from '../../constants/platformGuidelines.ts';

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
      7. DO NOT include any image descriptions, placeholders, or visual references in the post content
      8. Focus only on the written content - images will be handled separately
      
      Format your response as:
      
      ${Array.from({ length: days }, (_, i) => `POST ${i + 1}:
[Post content here - NO image descriptions or visual references]
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

  /**
   * Build detailed image prompts for AI image generation
   */
  buildImagePrompt(content: string, platform: string, tone: string): string {
    const platformStyles: Record<string, string> = {
      linkedin: 'professional, corporate, business, clean, modern',
      twitter: 'trending, social media, digital, contemporary',
      instagram: 'lifestyle, creative, aesthetic, visually appealing',
      facebook: 'social, community, friendly, approachable',
      tiktok: 'trendy, vibrant, dynamic, engaging'
    };

    const toneStyles: Record<string, string> = {
      professional: 'formal, sophisticated, clean, corporate',
      casual: 'relaxed, friendly, approachable, natural',
      humorous: 'fun, playful, colorful, entertaining',
      formal: 'elegant, refined, professional, polished',
      friendly: 'warm, welcoming, positive, inviting',
      enthusiastic: 'energetic, vibrant, dynamic, exciting'
    };

    const platformStyle = platformStyles[platform] || 'professional, modern';
    const toneStyle = toneStyles[tone] || 'professional';

    return `
      Generate a detailed image prompt for a social media post based on this content:
      
      Post Content: "${content}"
      Platform: ${platform}
      Tone: ${tone}
      
      Create a detailed visual description for an image that would perfectly complement this post.
      Consider the platform style (${platformStyle}) and tone (${toneStyle}).
      
      Focus on:
      - Visual elements that represent the main message
      - Colors and mood that match the tone
      - Composition that works well for ${platform}
      - Professional quality suitable for business use
      
      Return a detailed, specific image description that could be used to generate or find the perfect image.
      Make it descriptive enough to find relevant stock photos.
    `;
  }
}

// Export singleton instance
export const promptBuilder = new PromptBuilder(); 