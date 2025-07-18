import axios from 'axios';
import { AIResponse } from '../../types/ai.js';

export class GeminiClient {
  private apiKey = process.env.GEMINI_API_KEY || '';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  async generateContent(prompt: string, maxRetries = 3): Promise<AIResponse> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} - Calling Gemini API...`);
        console.log('API Key length:', this.apiKey.length);
        console.log('Request body:', JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }, null, 2));
        
        const response = await axios.post(
          `${this.baseUrl}?key=${this.apiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));

        const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          throw new Error('No generated text found in response');
        }

        return {
          text: generatedText,
          success: true,
        };
      } catch (error: any) {
        console.error(`Error generating content with Gemini (attempt ${attempt}/${maxRetries}):`, error?.message || error);

        if (error?.response?.status === 503 && attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Service overloaded, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        return {
          text: '',
          success: false,
          error: error?.message || 'Unknown error occurred',
        };
      }
    }

    return {
      text: '',
      success: false,
      error: 'Max retries exceeded',
    };
  }
}

export const geminiClient = new GeminiClient();
