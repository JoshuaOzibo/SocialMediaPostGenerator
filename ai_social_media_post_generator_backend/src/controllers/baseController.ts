import { Request, Response } from 'express';

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export abstract class BaseController {
  /**
   * Get authenticated user ID
   */
  protected getUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return userId;
  }

  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response, 
    data?: T, 
    message?: string, 
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data && { data })
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response, 
    error: string | Error, 
    statusCode: number = 500
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage
    };

    res.status(statusCode).json(response);
  }

  /**
   * Handle controller errors with proper logging
   */
  protected handleError(
    res: Response, 
    error: unknown, 
    operation: string,
    defaultMessage: string = 'Operation failed'
  ): void {
    console.error(`Error in ${operation}:`, error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message === 'User not authenticated') {
        this.sendError(res, 'User not authenticated', 401);
        return;
      }
      
      if (error.message === 'Post not found') {
        this.sendError(res, 'Post not found', 404);
        return;
      }
      
      this.sendError(res, error.message, 500);
    } else {
      this.sendError(res, defaultMessage, 500);
    }
  }

  /**
   * Validate required parameters
   */
  protected validateRequiredParams(params: Record<string, any>, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!params[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  /**
   * Validate pagination parameters
   */
  protected validatePagination(page: number, limit: number): void {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error('Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100');
    }
  }

  /**
   * Parse and validate pagination from query
   */
  protected parsePagination(req: AuthenticatedRequest): { page: number; limit: number } {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    this.validatePagination(page, limit);
    
    return { page, limit };
  }
} 