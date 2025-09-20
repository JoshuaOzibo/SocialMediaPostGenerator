import { createApi } from 'unsplash-js';
import { promptBuilder } from './ai/promptBuilder.js';
import { geminiClient } from './ai/geminiClient.js';

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
      const usedIds = new Set<string>();

      // Try each search term and collect unique results
      for (const searchTerm of searchTerms) {
        if (results.length >= count) break;
        
        try {
          console.log(`Searching Unsplash for: "${searchTerm}"`);
          
          const response = await unsplash.search.getPhotos({
            query: searchTerm,
            page: 1,
            perPage: 3, // Get multiple options per search term
            orientation: 'landscape',
            orderBy: 'relevant', // Get most relevant images first
          });

          if (response.response && response.response.results.length > 0) {
            // Find the first unique image we haven't used yet
            for (const photo of response.response.results) {
              if (!usedIds.has(photo.id) && results.length < count) {
                usedIds.add(photo.id);
                results.push({
                  id: photo.id,
                  url: photo.urls.regular,
                  alt: photo.alt_description || searchTerm,
                  photographer: photo.user.name,
                  downloadUrl: photo.links.download_location,
                });
                console.log(`Found image: ${photo.alt_description || searchTerm} by ${photo.user.name}`);
                break; // Move to next search term after finding one image
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching image for "${searchTerm}":`, error);
          // Continue with next search term
        }
      }

      console.log(`Total images found: ${results.length} for search terms: ${searchTerms.join(', ')}`);

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
      // Build improved image search terms prompt
      const searchTermsPrompt = promptBuilder.buildImageSearchTermsPrompt(content, platform, tone);
      
      // Get AI response for image search terms
      const aiResponse = await geminiClient.generateContent(searchTermsPrompt);
      
      if (!aiResponse.success) {
        console.error('Error generating image search terms:', aiResponse.error);
        return this.extractSearchTerms(content, platform);
      }
      
      // Parse the AI response to extract search terms
      const searchTerms = this.parseImageSearchTerms(aiResponse.text);
      
      console.log(`AI generated search terms:`, searchTerms);
      
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
      console.log('Raw AI response for search terms:', aiResponse);
      
      // Look for comma-separated terms (the expected format)
      const lines = aiResponse.split('\n');
      let searchTermsText = '';
      
      // Find the line that contains comma-separated terms
      for (const line of lines) {
        if (line.includes(',') && line.length > 10) {
          searchTermsText = line.trim();
          break;
        }
      }
      
      // If no comma-separated line found, use the entire response
      if (!searchTermsText) {
        searchTermsText = aiResponse.trim();
      }
      
      // Clean and split by commas
      const cleanText = searchTermsText
        .replace(/^[^a-zA-Z]*/, '') // Remove leading non-letters
        .replace(/[^a-zA-Z0-9\s,]/g, ' ') // Keep only letters, numbers, spaces, and commas
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // Split by commas and clean each term
      const terms = cleanText.split(',')
        .map(term => term.trim())
        .filter(term => {
          // Filter out very short terms and common words
          const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'if', 'so', 'no', 'not', 'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who'];
          return term.length >= 3 && !commonWords.includes(term.toLowerCase());
        });
      
      console.log('Parsed search terms:', terms);
      
      return terms.slice(0, 5); // Return top 5 terms
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
      console.log(`Generating images for post content: "${content.substring(0, 100)}..."`);
      
      // Generate AI-powered search terms based on post content
      const searchTerms = await this.generateImageSearchTerms(content, platform, tone);
      
      console.log(`Generated image search terms for "${platform}" post:`, searchTerms);
      
      // If we have AI-generated search terms, use them
      if (searchTerms.length > 0) {
        const images = await this.fetchImages(searchTerms, count);
        console.log(`Successfully generated ${images.length} images for post`);
        return images;
      }

      // Fallback to basic extraction if AI fails
      const fallbackTerms = this.extractSearchTerms(content, platform);
      console.log(`Using fallback search terms:`, fallbackTerms);
      const images = await this.fetchImages(fallbackTerms, count);
      console.log(`Successfully generated ${images.length} fallback images for post`);
      return images;
    } catch (error) {
      console.error('Error generating images for post:', error);
      return this.getPlaceholderImages(['social media'], count);
    }
  }

  /**
   * Extract search terms from post content (improved fallback)
   */
  private extractSearchTerms(content: string, platform: string): string[] {
    const terms: string[] = [];
    
    // Remove emojis and special characters, keep spaces
    const cleanContent = content.replace(/[^\w\s]/g, ' ').toLowerCase();
    
    // Extract potential keywords
    const words = cleanContent.split(/\s+/).filter(word => word.length > 3);
    
    // Enhanced keyword mapping for better image search results
    const keywordMap: Record<string, string[]> = {
      // Technology & Development
      'flutter': ['mobile app development', 'flutter development', 'app programming'],
      'react': ['react development', 'web development', 'javascript programming'],
      'native': ['mobile development', 'app development', 'programming'],
      'development': ['software development', 'programming', 'coding'],
      'programming': ['coding', 'software development', 'programming'],
      'coding': ['programming', 'software development', 'coding'],
      
      // Business & Professional
      'business': ['business meeting', 'professional', 'corporate'],
      'startup': ['startup office', 'entrepreneurship', 'business'],
      'team': ['team collaboration', 'team meeting', 'teamwork'],
      'leadership': ['leadership', 'management', 'professional'],
      'strategy': ['business strategy', 'planning', 'professional'],
      
      // Lifestyle & Personal
      'puppy': ['puppy', 'dog training', 'puppy care'],
      'dog': ['dog', 'pet care', 'dog training'],
      'training': ['training', 'learning', 'education'],
      'tips': ['tips', 'advice', 'help'],
      'help': ['help', 'support', 'assistance'],
      
      // General
      'innovation': ['innovation', 'technology', 'modern'],
      'success': ['success', 'achievement', 'professional'],
      'growth': ['growth', 'development', 'progress'],
      'creative': ['creative', 'design', 'artistic'],
      'lifestyle': ['lifestyle', 'modern living', 'personal']
    };

    // Find matching terms and their related image search terms
    for (const word of words) {
      if (keywordMap[word]) {
        terms.push(...keywordMap[word].slice(0, 2)); // Add top 2 related terms
      }
    }

    // Add platform-specific terms if we don't have enough terms
    if (terms.length < 3) {
      const platformTerms: Record<string, string[]> = {
        linkedin: ['professional business', 'corporate meeting', 'business networking'],
        twitter: ['social media', 'digital marketing', 'trending topics'],
        instagram: ['lifestyle', 'creative design', 'visual content'],
        facebook: ['social networking', 'community', 'social engagement'],
        tiktok: ['trending', 'viral content', 'social media']
      };
      
      const platformSpecific = platformTerms[platform] || ['social media', 'digital marketing'];
      terms.push(...platformSpecific.slice(0, 2));
    }

    // Remove duplicates and limit results
    const uniqueTerms = [...new Set(terms)];
    return uniqueTerms.slice(0, 4); // Return top 4 terms
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