import { Response } from 'express';
import { BaseController, AuthenticatedRequest } from '../baseController.js';
import { postService } from '../../services/postService.js';
import { ValidationService } from '../../services/validationService.js';
import { CreatePostRequest } from '../../types/post.js';

export class CreatePostController extends BaseController {
  /**
   * Create a new post with AI-generated content
   */
  async execute(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const request: CreatePostRequest = req.body;

      // Validate request
      ValidationService.validateCreatePostRequest(request);

      // Create post
      const post = await postService.createPost(userId, request);
      
      this.sendSuccess(res, post, 'Post created successfully', 201);
    } catch (error) {
      this.handleError(res, error, 'createPost', 'Failed to create post');
    }
  }
}

// Export singleton instance
export const createPostController = new CreatePostController(); 