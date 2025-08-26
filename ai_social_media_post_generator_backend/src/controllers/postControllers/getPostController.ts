import { Response, Request } from 'express';
import { BaseController } from '../baseController.js';
import { postService } from '../../services/postService.js';
import { ValidationService } from '../../services/validationService.js';

// Define AuthenticatedRequest locally to avoid import issues
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class GetPostController extends BaseController {
  /**
   * Get a single post by ID
   */
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { postId } = req.params;

      this.validateRequiredParams({ postId }, ['postId']);

      const post = await postService.getPostById(userId, postId);
      
      this.sendSuccess(res, post);
    } catch (error) {
      this.handleError(res, error, 'getPostById', 'Failed to get post');
    }
  }

  /**
   * Get posts with filtering and pagination
   */
  async getList(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { page, limit } = this.parsePagination(req);
      const filters = ValidationService.buildFiltersFromQuery(req);

      const result = await postService.getPosts(userId, page, limit, filters);
      console.log(result);
      this.sendSuccess(res, result);

    } catch (error) {
      console.log(error);
      this.handleError(res, error, 'getPosts', 'Failed to get posts');
    }
  }

  /**
   * Get post statistics for the authenticated user
   */
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const stats = await postService.getPostStats(userId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(res, error, 'getPostStats', 'Failed to get post statistics');
    }
  }

  /**
   * Get scheduled posts for the authenticated user
   */
  async getScheduledPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { page, limit } = this.parsePagination(req);
      
      const result = await postService.getScheduledPosts(userId, page, limit);
      console.log(result);
      
      this.sendSuccess(res, result);
    } catch (error) {
      console.log(error);
      this.handleError(res, error, 'getScheduledPosts', 'Failed to get scheduled posts');
    }
  }
}

// Export singleton instance
export const getPostController = new GetPostController(); 