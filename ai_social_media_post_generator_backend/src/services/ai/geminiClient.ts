import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse } from '../../types/ai.js';

export class GeminiClient {
  private model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '').getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp' 
  });

  /**
   * Generate content using Gemini AI
   */
  async generateContent(prompt: string): Promise<AIResponse> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        text,
        success: true
      };
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiClient(); 