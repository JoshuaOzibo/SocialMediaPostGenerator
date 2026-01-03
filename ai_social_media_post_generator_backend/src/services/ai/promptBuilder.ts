import type { PostGenerationRequest } from '../../types/ai.js';
import { PLATFORM_GUIDELINES, TONE_GUIDELINES } from '../../constants/platformGuidelines.js';

export class PromptBuilder {
  /**
   * Build the prompt for post generation
   */
  buildPostGenerationPrompt(request: PostGenerationRequest): string {
    const platformGuidelines = PLATFORM_GUIDELINES[request.platform];
    const toneGuidelines = TONE_GUIDELINES[request.tone];
    const days = request.days || 1;
    const includeHashtags = request.includeHashtags !== false; 
    const includeImages = request.includeImages !== false; 
    
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
   * Build the prompt for post regeneration with variation instructions
   */
  buildRegenerationPrompt(request: PostGenerationRequest, existingContent?: string): string {
    const platformGuidelines = PLATFORM_GUIDELINES[request.platform];
    const toneGuidelines = TONE_GUIDELINES[request.tone];
    const days = request.days || 1;
    const includeHashtags = request.includeHashtags !== false; // Default to true
    const includeImages = request.includeImages !== false; // Default to true
    
    const variationInstructions = existingContent 
      ? `IMPORTANT: You are regenerating content for this topic. The previous content was: "${existingContent}". Create a COMPLETELY DIFFERENT approach, angle, or style while keeping the same core message. Use different words, structure, and perspective.`
      : 'IMPORTANT: Create a COMPLETELY DIFFERENT approach, angle, or style for this content. Use fresh perspectives, different vocabulary, and unique presentation.';
    
    return `
      You are an expert social media content creator. Generate ${days} different ${request.platform} posts based on these bullet points:
      
      ${request.inputBullets.map(bullet => `• ${bullet}`).join('\n')}
      
      ${request.additionalContext ? `Additional context: ${request.additionalContext}` : ''}
      
      Platform: ${request.platform}
      ${platformGuidelines}
      
      Tone: ${request.tone}
      ${toneGuidelines}
      
      ${variationInstructions}
      
      Requirements:
      1. Generate exactly ${days} different posts
      2. Each post should be engaging and platform-optimized
      3. ${includeHashtags ? 'Include relevant hashtags at the end of each post' : 'Do not include hashtags'}
      4. Make each post unique in approach and style - try different angles, perspectives, or storytelling methods
      5. Ensure the content flows naturally and is compelling
      6. Each post should be suitable for posting on consecutive days
      7. DO NOT include any image descriptions, placeholders, or visual references in the post content
      8. Focus only on the written content - images will be handled separately
      9. VARY your approach: try questions, statements, stories, tips, comparisons, or different emotional angles
      
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
   * Build image search terms prompt for better image matching
   */
  buildImageSearchTermsPrompt(content: string, platform: string, tone: string): string {
    return `
      Analyze this social media post content and generate 3-5 specific, searchable image search terms that would find the most relevant and visually appealing images for this post.

      Post Content: "${content}"
      Platform: ${platform}
      Tone: ${tone}

      Requirements:
      1. Extract the MAIN TOPIC/SUBJECT of the post
      2. Identify KEY VISUAL ELEMENTS that would represent this content
      3. Consider the PLATFORM STYLE (${platform})
      4. Match the TONE (${tone})
      5. Think about what images would make someone stop scrolling and engage

      Guidelines:
      - Use specific, concrete terms that work well in image search engines
      - Focus on visual concepts, not abstract ideas
      - Include relevant objects, scenes, or activities mentioned
      - Consider the emotional tone and visual mood
      - Make terms broad enough to find good images but specific enough to be relevant

      Examples of good search terms:
      - "puppy training" (not "dog advice")
      - "mobile app development" (not "technology")
      - "team meeting" (not "collaboration")
      - "startup office" (not "entrepreneurship")

      Return ONLY the search terms, separated by commas, like this:
      search term 1, search term 2, search term 3, search term 4, search term 5

      Do not include any other text or explanations.
    `;
  }

  /**
   * Build detailed image prompts for AI image generation (legacy method)
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