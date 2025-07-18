import { Response, Request } from 'express';
import { BaseController } from '../baseController.js';
import { postService } from '../../services/postService.js';
import { ValidationService } from '../../services/validationService.js';
import { UpdatePostRequest } from '../../types/post.js';

// Define AuthenticatedRequest locally to avoid import issues
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class UpdatePostController extends BaseController {
  /**
   * Update a post
   */
  async execute(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId } = req.params;
      const updates: UpdatePostRequest = req.body;

      this.validateRequiredParams({ postId }, ['postId']);
      ValidationService.validateUpdatePostRequest(updates);

      const post = await postService.updatePost(userId, postId, updates);
      
      this.sendSuccess(res, post, 'Post updated successfully');
    } catch (error) {
      this.handleError(res, error, 'updatePost', 'Failed to update post');
    }
  }

  /**
   * Regenerate content for an existing post
   */
  async regenerateContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId } = req.params;

      this.validateRequiredParams({ postId }, ['postId']);

      const post = await postService.regenerateContent(userId, postId);
      
      this.sendSuccess(res, post, 'Content regenerated successfully');
    } catch (error) {
      this.handleError(res, error, 'regenerateContent', 'Failed to regenerate content');
    }
  }
}

// Export singleton instance
export const updatePostController = new UpdatePostController(); 