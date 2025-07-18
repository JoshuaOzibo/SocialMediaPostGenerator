export interface PostGenerationRequest {
  inputBullets: string[];
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  tone: 'professional' | 'casual' | 'humorous' | 'formal' | 'friendly' | 'enthusiastic';
  additionalContext?: string;
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
  imageSuggestions: string[];
}

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
} 