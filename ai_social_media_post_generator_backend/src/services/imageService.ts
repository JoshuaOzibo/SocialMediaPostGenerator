import { createApi } from 'unsplash-js';
import { promptBuilder } from './ai/promptBuilder.ts';
import { geminiClient } from './ai/geminiClient.ts';

// Initialize Unsplash API
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

export interface ImageResult {
  id: string;
  url: string;
  alt: string;
  photographer: string;
  downloadUrl: string;
}

export class ImageService {
  /**
   * Fetch images from Unsplash based on search terms
   */
  async fetchImages(searchTerms: string[], count: number = 3): Promise<ImageResult[]> {
    try {
      if (!process.env.UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash API key not configured, returning placeholder images');
        return this.getPlaceholderImages(searchTerms, count);
      }

      const results: ImageResult[] = [];

      for (const searchTerm of searchTerms.slice(0, count)) {
        try {
          const response = await unsplash.search.getPhotos({
            query: searchTerm,
            page: 1,
            perPage: 1,
            orientation: 'landscape',
          });

          if (response.response && response.response.results.length > 0) {
            const photo = response.response.results[0];
            results.push({
              id: photo.id,
              url: photo.urls.regular,
              alt: photo.alt_description || searchTerm,
              photographer: photo.user.name,
              downloadUrl: photo.links.download_location,
            });
          }
        } catch (error) {
          console.error(`Error fetching image for "${searchTerm}":`, error);
          // Continue with next search term
        }
      }

      return results.length > 0 ? results : this.getPlaceholderImages(searchTerms, count);
    } catch (error) {
      console.error('Error in fetchImages:', error);
      return this.getPlaceholderImages(searchTerms, count);
    }
  }

  /**
   * Generate AI-powered image search terms based on post content
   */
  async generateImageSearchTerms(content: string, platform: string, tone: string): Promise<string[]> {
    try {
      // Build detailed image prompt
      const imagePrompt = promptBuilder.buildImagePrompt(content, platform, tone);
      
      // Get AI response for image search terms
      const aiResponse = await geminiClient.generateContent(imagePrompt);
      
      if (!aiResponse.success) {
        console.error('Error generating image search terms:', aiResponse.error);
        return this.extractSearchTerms(content, platform);
      }
      
      // Parse the AI response to extract search terms
      const searchTerms = this.parseImageSearchTerms(aiResponse.text);
      
      return searchTerms.length > 0 ? searchTerms : this.extractSearchTerms(content, platform);
    } catch (error) {
      console.error('Error generating image search terms:', error);
      return this.extractSearchTerms(content, platform);
    }
  }

  /**
   * Parse AI-generated image search terms from response
   */
  private parseImageSearchTerms(aiResponse: string): string[] {
    try {
      // Clean the response and extract key terms
      const cleanResponse = aiResponse.toLowerCase()
        .replace(/[^\w\s,]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Split into potential search terms
      const terms = cleanResponse.split(/[,.]/).map(term => term.trim()).filter(term => term.length > 2);
      
      // Filter out common words and keep relevant terms
      const relevantTerms = terms.filter(term => {
        const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'];
        return !commonWords.includes(term) && term.length > 3;
      });
      
      return relevantTerms.slice(0, 3); // Return top 3 terms
    } catch (error) {
      console.error('Error parsing image search terms:', error);
      return [];
    }
  }

  /**
   * Generate placeholder images when Unsplash is not available
   */
  private getPlaceholderImages(searchTerms: string[], count: number): ImageResult[] {
    const placeholders = [
      {
        id: 'placeholder-1',
        url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Social+Media+Image',
        alt: 'Social Media Placeholder',
        photographer: 'System',
        downloadUrl: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Social+Media+Image',
      },
      {
        id: 'placeholder-2',
        url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Content+Image',
        alt: 'Content Placeholder',
        photographer: 'System',
        downloadUrl: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Content+Image',
      },
      {
        id: 'placeholder-3',
        url: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Marketing+Image',
        alt: 'Marketing Placeholder',
        photographer: 'System',
        downloadUrl: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Marketing+Image',
      },
    ];

    return placeholders.slice(0, Math.min(count, placeholders.length));
  }

  /**
   * Generate images for a specific post content
   */
  async generateImagesForPost(content: string, platform: string, tone: string, count: number = 3): Promise<ImageResult[]> {
    try {
      // Generate AI-powered search terms based on post content
      const searchTerms = await this.generateImageSearchTerms(content, platform, tone);
      
      console.log(`Generated image search terms for "${platform}" post:`, searchTerms);
      
      // If we have AI-generated search terms, use them
      if (searchTerms.length > 0) {
        return await this.fetchImages(searchTerms, count);
      }

      // Fallback to basic extraction if AI fails
      const fallbackTerms = this.extractSearchTerms(content, platform);
      console.log(`Using fallback search terms:`, fallbackTerms);
      return await this.fetchImages(fallbackTerms, count);
    } catch (error) {
      console.error('Error generating images for post:', error);
      return this.getPlaceholderImages(['social media'], count);
    }
  }

  /**
   * Extract search terms from post content
   */
  private extractSearchTerms(content: string, platform: string): string[] {
    const terms: string[] = [];
    
    // Remove emojis and special characters
    const cleanContent = content.replace(/[^\w\s]/g, ' ').toLowerCase();
    
    // Extract potential keywords
    const words = cleanContent.split(/\s+/).filter(word => word.length > 3);
    
    // Common business/tech terms that work well for images
    const businessTerms = [
      'business', 'technology', 'innovation', 'success', 'team', 'collaboration',
      'product', 'launch', 'growth', 'strategy', 'leadership', 'development',
      'startup', 'entrepreneur', 'professional', 'workplace', 'meeting'
    ];

    // Find matching terms
    for (const word of words) {
      if (businessTerms.includes(word) && !terms.includes(word)) {
        terms.push(word);
      }
    }

    // Add platform-specific terms
    if (platform === 'linkedin') {
      terms.push('professional', 'business');
    } else if (platform === 'instagram') {
      terms.push('lifestyle', 'creative');
    } else if (platform === 'twitter') {
      terms.push('news', 'trending');
    }

    return terms.slice(0, 3); // Limit to 3 terms
  }

  /**
   * Get platform-specific image search terms
   */
  private getPlatformSpecificTerms(platform: string): string[] {
    const platformTerms: Record<string, string[]> = {
      linkedin: ['professional business', 'corporate meeting', 'team collaboration'],
      twitter: ['social media', 'digital marketing', 'trending topics'],
      instagram: ['lifestyle', 'creative design', 'visual content'],
      facebook: ['social networking', 'community', 'engagement'],
      tiktok: ['trending', 'viral content', 'social media']
    };

    return platformTerms[platform] || ['social media', 'digital marketing'];
  }
}

// Export singleton instance
export const imageService = new ImageService(); 