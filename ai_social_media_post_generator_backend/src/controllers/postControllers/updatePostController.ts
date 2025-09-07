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

  /**
   * Regenerate a specific individual post content
   */
  async regenerateIndividualPost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId, individualPostId } = req.params;

      this.validateRequiredParams({ postId, individualPostId }, ['postId', 'individualPostId']);

      const post = await postService.regenerateIndividualPost(userId, postId, individualPostId);
      
      this.sendSuccess(res, post, 'Individual post regenerated successfully');
    } catch (error) {
      this.handleError(res, error, 'regenerateIndividualPost', 'Failed to regenerate individual post');
    }
  }

  /**
   * Update images for a specific post
   */
  async updateImages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId } = req.params;
      const { contentIndex, images, action } = req.body; // action: 'add', 'remove', 'replace'

      this.validateRequiredParams({ postId }, ['postId']);

      if (!action || !['add', 'remove', 'replace'].includes(action)) {
        throw new Error('Invalid action. Must be "add", "remove", or "replace"');
      }

      if (action === 'remove' && contentIndex === undefined) {
        throw new Error('contentIndex is required for remove action');
      }

      if ((action === 'add' || action === 'replace') && (!images || !Array.isArray(images))) {
        throw new Error('images array is required for add/replace actions');
      }

      const post = await postService.updatePostImages(userId, postId, contentIndex, images, action);
      
      this.sendSuccess(res, post, 'Images updated successfully');
    } catch (error) {
      this.handleError(res, error, 'updateImages', 'Failed to update images');
    }
  }
}

// Export singleton instance
export const updatePostController = new UpdatePostController(); 