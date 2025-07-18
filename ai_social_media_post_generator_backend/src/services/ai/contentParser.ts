import { GeneratedPost } from '../../types/ai.js';

export class ContentParser {
  /**
   * Parse the generated content into structured format
   */
  parseGeneratedPosts(text: string): GeneratedPost[] {
    console.log('Parsing text:', text);
    const posts: GeneratedPost[] = [];
    const postSections = text.split(/POST \d+:/).filter(section => section.trim());
    console.log('Post sections:', postSections);
    
    for (const section of postSections) {
      const lines = section.trim().split('\n').filter(line => line.trim());
      console.log('Processing section lines:', lines);
      if (lines.length === 0) continue;
      
      // Extract content (everything before hashtags)
      const contentLines: string[] = [];
      const hashtags: string[] = [];
      
      for (const line of lines) {
        if (line.includes('#')) {
          // Extract content and hashtags from this line
          const hashtagMatches = line.match(/#\w+/g) || [];
          hashtags.push(...hashtagMatches);
          console.log('Found hashtags:', hashtagMatches);
          
          // Extract content (everything before the hashtags)
          const contentPart = line.replace(/#\w+/g, '').trim();
          if (contentPart) {
            contentLines.push(contentPart);
          }
        } else {
          contentLines.push(line);
        }
      }
      
      const content = contentLines.join(' ').trim();
      console.log('Extracted content:', content);
      console.log('Extracted hashtags:', hashtags);
      
      if (content) {
        posts.push({
          content,
          hashtags,
          imageSuggestions: [] // Will be generated separately
        });
      }
    }
    
    console.log('Final parsed posts:', posts);
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