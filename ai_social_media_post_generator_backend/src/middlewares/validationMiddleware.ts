import { Request, Response, NextFunction } from 'express';
import { CreatePostRequest, UpdatePostRequest } from '../types/post.js';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Validate platform values
 */
const isValidPlatform = (platform: string): boolean => {
  const validPlatforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'];
  return validPlatforms.includes(platform);
};

/**
 * Validate tone values
 */
const isValidTone = (tone: string): boolean => {
  const validTones = ['professional', 'casual', 'humorous', 'formal', 'friendly', 'enthusiastic'];
  return validTones.includes(tone);
};

/**
 * Validate status values
 */
const isValidStatus = (status: string): boolean => {
  const validStatuses = ['draft', 'scheduled', 'published', 'archived'];
  return validStatuses.includes(status);
};

/**
 * Validate date format (ISO string)
 */
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate create post request
 */
export const validatePostRequest = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const request: CreatePostRequest = req.body;

    // Check required fields
    if (!request.platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    if (!request.tone) {
      return res.status(400).json({ error: 'Tone is required' });
    }

    if (!request.input_bullets) {
      return res.status(400).json({ error: 'Input bullets are required' });
    }

    // Validate platform
    if (!isValidPlatform(request.platform)) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be one of: twitter, facebook, instagram, linkedin, tiktok' 
      });
    }

    // Validate tone
    if (!isValidTone(request.tone)) {
      return res.status(400).json({ 
        error: 'Invalid tone. Must be one of: professional, casual, humorous, formal, friendly, enthusiastic' 
      });
    }

    // Validate input_bullets
    if (!Array.isArray(request.input_bullets)) {
      return res.status(400).json({ error: 'Input bullets must be an array' });
    }

    if (request.input_bullets.length === 0) {
      return res.status(400).json({ error: 'Input bullets cannot be empty' });
    }

    if (request.input_bullets.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 input bullets allowed' });
    }

    // Validate each bullet point
    for (let i = 0; i < request.input_bullets.length; i++) {
      const bullet = request.input_bullets[i];
      if (typeof bullet !== 'string' || bullet.trim().length === 0) {
        return res.status(400).json({ error: `Bullet point ${i + 1} cannot be empty` });
      }
      if (bullet.length > 500) {
        return res.status(400).json({ error: `Bullet point ${i + 1} is too long (max 500 characters)` });
      }
    }

    // Validate additionalContext if provided
    if (request.additionalContext && typeof request.additionalContext !== 'string') {
      return res.status(400).json({ error: 'Additional context must be a string' });
    }

    if (request.additionalContext && request.additionalContext.length > 1000) {
      return res.status(400).json({ error: 'Additional context is too long (max 1000 characters)' });
    }

    // Validate scheduled_at if provided
    if (request.scheduled_at && !isValidDate(request.scheduled_at)) {
      return res.status(400).json({ error: 'Invalid scheduled_at date format' });
    }

    if (request.scheduled_at) {
      const scheduledDate = new Date(request.scheduled_at);
      const now = new Date();
      if (scheduledDate <= now) {
        return res.status(400).json({ error: 'Scheduled date must be in the future' });
      }
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
};

/**
 * Validate update post request
 */
export const validateUpdateRequest = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updates: UpdatePostRequest = req.body;

    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Validate platform if provided
    if (updates.platform && !isValidPlatform(updates.platform)) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be one of: twitter, facebook, instagram, linkedin, tiktok' 
      });
    }

    // Validate tone if provided
    if (updates.tone && !isValidTone(updates.tone)) {
      return res.status(400).json({ 
        error: 'Invalid tone. Must be one of: professional, casual, humorous, formal, friendly, enthusiastic' 
      });
    }

    // Validate status if provided
    if (updates.status && !isValidStatus(updates.status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: draft, scheduled, published, archived' 
      });
    }

    // Validate input_bullets if provided
    if (updates.input_bullets) {
      if (!Array.isArray(updates.input_bullets)) {
        return res.status(400).json({ error: 'Input bullets must be an array' });
      }

      if (updates.input_bullets.length === 0) {
        return res.status(400).json({ error: 'Input bullets cannot be empty' });
      }

      if (updates.input_bullets.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 input bullets allowed' });
      }

      // Validate each bullet point
      for (let i = 0; i < updates.input_bullets.length; i++) {
        const bullet = updates.input_bullets[i];
        if (typeof bullet !== 'string' || bullet.trim().length === 0) {
          return res.status(400).json({ error: `Bullet point ${i + 1} cannot be empty` });
        }
        if (bullet.length > 500) {
          return res.status(400).json({ error: `Bullet point ${i + 1} is too long (max 500 characters)` });
        }
      }
    }

    // Validate generated_posts if provided
    if (updates.generated_posts) {
      if (!Array.isArray(updates.generated_posts)) {
        return res.status(400).json({ error: 'Generated posts must be an array' });
      }

      for (let i = 0; i < updates.generated_posts.length; i++) {
        const post = updates.generated_posts[i];
        if (typeof post !== 'string' || post.trim().length === 0) {
          return res.status(400).json({ error: `Generated post ${i + 1} cannot be empty` });
        }
      }
    }

    // Validate hashtags if provided
    if (updates.hashtags) {
      if (!Array.isArray(updates.hashtags)) {
        return res.status(400).json({ error: 'Hashtags must be an array' });
      }

      for (let i = 0; i < updates.hashtags.length; i++) {
        const hashtag = updates.hashtags[i];
        if (typeof hashtag !== 'string' || !hashtag.startsWith('#')) {
          return res.status(400).json({ error: `Hashtag ${i + 1} must start with #` });
        }
      }
    }

    // Validate images if provided
    if (updates.images) {
      if (!Array.isArray(updates.images)) {
        return res.status(400).json({ error: 'Images must be an array' });
      }
    }

    // Validate scheduled_at if provided
    if (updates.scheduled_at && !isValidDate(updates.scheduled_at)) {
      return res.status(400).json({ error: 'Invalid scheduled_at date format' });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
};

/**
 * Validate query parameters for post listing
 */
export const validateQueryParams = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Validate page parameter
    if (req.query.page) {
      const page = parseInt(req.query.page as string);
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: 'Page must be a positive integer' });
      }
    }

    // Validate limit parameter
    if (req.query.limit) {
      const limit = parseInt(req.query.limit as string);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ error: 'Limit must be between 1 and 100' });
      }
    }

    // Validate platform parameter
    if (req.query.platform && !isValidPlatform(req.query.platform as string)) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be one of: twitter, facebook, instagram, linkedin, tiktok' 
      });
    }

    // Validate status parameter
    if (req.query.status && !isValidStatus(req.query.status as string)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: draft, scheduled, published, archived' 
      });
    }

    // Validate tone parameter
    if (req.query.tone && !isValidTone(req.query.tone as string)) {
      return res.status(400).json({ 
        error: 'Invalid tone. Must be one of: professional, casual, humorous, formal, friendly, enthusiastic' 
      });
    }

    // Validate date parameters
    if (req.query.startDate && !isValidDate(req.query.startDate as string)) {
      return res.status(400).json({ error: 'Invalid startDate format' });
    }

    if (req.query.endDate && !isValidDate(req.query.endDate as string)) {
      return res.status(400).json({ error: 'Invalid endDate format' });
    }

    // Validate search parameter
    if (req.query.search && typeof req.query.search !== 'string') {
      return res.status(400).json({ error: 'Search must be a string' });
    }

    if (req.query.search && req.query.search.length > 100) {
      return res.status(400).json({ error: 'Search term is too long (max 100 characters)' });
    }

    next();
  } catch (error) {
    console.error('Query validation error:', error);
    res.status(400).json({ error: 'Invalid query parameters' });
  }
}; 