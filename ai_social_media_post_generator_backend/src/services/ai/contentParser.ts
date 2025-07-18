import { GeneratedPost } from '../../types/ai.js';

export class ContentParser {
  /**
   * Parse the generated content into structured format
   */
  parseGeneratedPosts(text: string): GeneratedPost[] {
    const posts: GeneratedPost[] = [];
    const postSections = text.split(/POST \d+:/).filter(section => section.trim());
    
    for (const section of postSections) {
      const lines = section.trim().split('\n').filter(line => line.trim());
      if (lines.length === 0) continue;
      
      // Extract content (everything before hashtags)
      const contentLines: string[] = [];
      const hashtags: string[] = [];
      
      for (const line of lines) {
        if (line.includes('#')) {
          // Extract hashtags from this line
          const hashtagMatches = line.match(/#\w+/g) || [];
          hashtags.push(...hashtagMatches);
        } else {
          contentLines.push(line);
        }
      }
      
      const content = contentLines.join('\n').trim();
      
      if (content) {
        posts.push({
          content,
          hashtags,
          imageSuggestions: [] // Will be generated separately
        });
      }
    }
    
    return posts;
  }

  /**
   * Parse hashtags from AI response
   */
  parseHashtags(text: string): string[] {
    const hashtags = text.trim().split(/\s+/);
    return hashtags.filter((tag: string) => tag.startsWith('#'));
  }

  /**
   * Parse image suggestions from AI response
   */
  parseImageSuggestions(text: string): string[] {
    const suggestions = text.trim().split('\n').filter((line: string) => line.trim());
    return suggestions.slice(0, 5);
  }
}

// Export singleton instance
export const contentParser = new ContentParser(); 