import { CreatePostRequest, UpdatePostRequest, PostFilters } from '../types/post.js';

export class ValidationService {
  /**
   * Validate create post request
   */
  static validateCreatePostRequest(request: CreatePostRequest): void {
    // Check required fields
    if (!request.platform || !request.tone || !request.input_bullets) {
      throw new Error('Missing required fields: platform, tone, and input_bullets are required');
    }

    // Validate input_bullets
    this.validateInputBullets(request.input_bullets);

    // Validate additionalContext if provided
    if (request.additionalContext) {
      this.validateAdditionalContext(request.additionalContext);
    }

    // Validate scheduled_at if provided
    if (request.scheduled_at) {
      this.validateScheduledDate(request.scheduled_at);
    }

    // Validate days if provided
    if (request.days !== undefined) {
      this.validateDays(request.days);
    }

    // Validate includeHashtags if provided
    if (request.includeHashtags !== undefined) {
      this.validateBoolean(request.includeHashtags, 'includeHashtags');
    }

    // Validate includeImages if provided
    if (request.includeImages !== undefined) {
      this.validateBoolean(request.includeImages, 'includeImages');
    }

    // Validate scheduleDate if provided
    if (request.scheduleDate) {
      this.validateScheduleDate(request.scheduleDate);
    }
  }

  /**
   * Validate update post request
   */
  static validateUpdatePostRequest(updates: UpdatePostRequest): void {
    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    // Validate individual fields if provided
    if (updates.input_bullets) {
      this.validateInputBullets(updates.input_bullets);
    }

    if (updates.generated_posts) {
      this.validateGeneratedPosts(updates.generated_posts);
    }

    if (updates.hashtags) {
      this.validateHashtags(updates.hashtags);
    }

    if (updates.scheduled_at) {
      this.validateScheduledDate(updates.scheduled_at);
    }
  }

  /**
   * Validate input bullets
   */
  private static validateInputBullets(inputBullets: string[]): void {
    if (!Array.isArray(inputBullets)) {
      throw new Error('Input bullets must be an array');
    }

    if (inputBullets.length === 0) {
      throw new Error('Input bullets cannot be empty');
    }

    if (inputBullets.length > 10) {
      throw new Error('Maximum 10 input bullets allowed');
    }

    // Validate each bullet point
    for (let i = 0; i < inputBullets.length; i++) {
      const bullet = inputBullets[i];
      if (typeof bullet !== 'string' || bullet.trim().length === 0) {
        throw new Error(`Bullet point ${i + 1} cannot be empty`);
      }
      if (bullet.length > 500) {
        throw new Error(`Bullet point ${i + 1} is too long (max 500 characters)`);
      }
    }
  }

  /**
   * Validate generated posts
   */
  private static validateGeneratedPosts(generatedPosts: string[]): void {
    if (!Array.isArray(generatedPosts)) {
      throw new Error('Generated posts must be an array');
    }

    for (let i = 0; i < generatedPosts.length; i++) {
      const post = generatedPosts[i];
      if (typeof post !== 'string' || post.trim().length === 0) {
        throw new Error(`Generated post ${i + 1} cannot be empty`);
      }
    }
  }

  /**
   * Validate hashtags
   */
  private static validateHashtags(hashtags: string[]): void {
    if (!Array.isArray(hashtags)) {
      throw new Error('Hashtags must be an array');
    }

    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];
      if (typeof hashtag !== 'string' || !hashtag.startsWith('#')) {
        throw new Error(`Hashtag ${i + 1} must start with #`);
      }
    }
  }

  /**
   * Validate additional context
   */
  private static validateAdditionalContext(context: string): void {
    if (typeof context !== 'string') {
      throw new Error('Additional context must be a string');
    }

    if (context.length > 1000) {
      throw new Error('Additional context is too long (max 1000 characters)');
    }
  }

  /**
   * Validate scheduled date
   */
  private static validateScheduledDate(dateString: string): void {
    const date = new Date(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid scheduled_at date format');
    }

    const now = new Date();
    if (date <= now) {
      throw new Error('Scheduled date must be in the future');
    }
  }

  /**
   * Validate days
   */
  private static validateDays(days: number): void {
    if (typeof days !== 'number' || days < 1 || days > 365) {
      throw new Error('Days must be a number between 1 and 365');
    }
  }

  /**
   * Validate boolean
   */
  private static validateBoolean(value: boolean, fieldName: string): void {
    if (typeof value !== 'boolean') {
      throw new Error(`${fieldName} must be a boolean`);
    }
  }

  /**
   * Validate scheduleDate
   */
  private static validateScheduleDate(dateString: string): void {
    const date = new Date(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid scheduleDate date format');
    }

    const now = new Date();
    if (date <= now) {
      throw new Error('ScheduleDate must be in the future');
    }
  }

  /**
   * Build filters from query parameters
   */
  static buildFiltersFromQuery(req: any): PostFilters {
    const filters: PostFilters = {};
    
    if (req.query.platform) filters.platform = req.query.platform as any;
    if (req.query.status) filters.status = req.query.status as any;
    if (req.query.tone) filters.tone = req.query.tone as any;
    if (req.query.startDate) filters.startDate = req.query.startDate as string;
    if (req.query.endDate) filters.endDate = req.query.endDate as string;
    if (req.query.search) filters.search = req.query.search as string;

    return filters;
  }
}

// Export singleton instance
export const validationService = new ValidationService(); 