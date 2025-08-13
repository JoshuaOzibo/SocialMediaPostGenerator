import { Response, Request } from 'express';
import { BaseController } from '../baseController.js';
import { postService } from '../../services/postService.js';

// Define AuthenticatedRequest locally to avoid import issues
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class DeletePostController extends BaseController {
  /**
   * Delete a post
   */
  async execute(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId } = req.params;

      this.validateRequiredParams({ postId }, ['postId']);

      await postService.deletePost(userId, postId);
      
      this.sendSuccess(res, undefined, 'Post deleted successfully');
    } catch (error) {
      this.handleError(res, error, 'deletePost', 'Failed to delete post');
    }
  }
}

// Export singleton instance
export const deletePostController = new DeletePostController(); 