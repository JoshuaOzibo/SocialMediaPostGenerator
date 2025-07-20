import { createApi } from 'unsplash-js';

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
  async generateImagesForPost(content: string, platform: string, count: number = 3): Promise<ImageResult[]> {
    try {
      // Extract key terms from content for better image search
      const searchTerms = this.extractSearchTerms(content, platform);
      
      // If we have specific search terms, use them
      if (searchTerms.length > 0) {
        return await this.fetchImages(searchTerms, count);
      }

      // Fallback to generic terms based on platform
      const fallbackTerms = this.getPlatformSpecificTerms(platform);
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