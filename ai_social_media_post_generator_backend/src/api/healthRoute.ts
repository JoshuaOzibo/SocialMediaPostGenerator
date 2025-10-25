import { Router, Request, Response } from 'express';
import supabase from '../lib/config/supabaseClient.js';

const router = Router();

/**
 * Health check endpoint that pings Supabase to keep it active
 * This endpoint performs a simple query to prevent Supabase from suspending
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Perform a simple query to keep Supabase active
    // This query is lightweight and just checks if we can connect
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error('Health check failed:', error);
      return res.status(503).json({
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`
      });
    }
    
    // Log successful health check
    console.log(` Health check passed - Response time: ${responseTime}ms`);
    
    res.status(200).json({
      status: 'healthy',
      message: 'Backend and database are operational',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: 'connected'
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during health check',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Simple ping endpoint for basic connectivity check
 */
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
