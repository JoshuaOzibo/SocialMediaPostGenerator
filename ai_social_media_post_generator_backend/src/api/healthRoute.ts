import { Router, Request, Response } from 'express';
import supabase from '../lib/config/supabaseClient.js';

const router = Router();

/**
 * Health check endpoint that pings Supabase to keep it active
 * This endpoint performs comprehensive database connectivity tests
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const healthCheckResults = {
      database: {
        connected: false,
        responseTime: 0,
        tables: {
          user_profiles: false,
          posts: false,
          scheduled_posts: false
        },
        error: null as string | null
      }
    };
    
    // Test 1: Basic connection test using a simple query
    const connectionStart = Date.now();
    const { data: connectionData, error: connectionError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    healthCheckResults.database.responseTime = Date.now() - connectionStart;
    
    if (connectionError) {
      healthCheckResults.database.error = connectionError.message;
      console.error('Database connection test failed:', connectionError);
    } else {
      healthCheckResults.database.connected = true;
      healthCheckResults.database.tables.user_profiles = true;
    }
    
    // Test 2: Test other tables if basic connection works
    if (healthCheckResults.database.connected) {
      // Test posts table
      const { error: postsError } = await supabase
        .from('posts')
        .select('id')
        .limit(1);
      
      if (!postsError) {
        healthCheckResults.database.tables.posts = true;
      }
      
      // Test scheduled_posts table
      const { error: scheduledError } = await supabase
        .from('scheduled_posts')
        .select('id')
        .limit(1);
      
      if (!scheduledError) {
        healthCheckResults.database.tables.scheduled_posts = true;
      }
    }
    
    const totalResponseTime = Date.now() - startTime;
    
    // Determine overall health status
    const isHealthy = healthCheckResults.database.connected && 
                     Object.values(healthCheckResults.database.tables).some(Boolean);
    
    if (!isHealthy) {
      console.error('Health check failed - Database issues detected');
      return res.status(503).json({
        status: 'unhealthy',
        message: 'Database connectivity issues detected',
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        details: healthCheckResults
      });
    }
    
    // Log successful health check with database details
    const connectedTables = Object.entries(healthCheckResults.database.tables)
      .filter(([_, connected]) => connected)
      .map(([table, _]) => table)
      .join(', ');
    
    console.log(`Health check passed - Response time: ${totalResponseTime}ms`);
    console.log(`Database connected - Tables accessible: ${connectedTables}`);
    
    res.status(200).json({
      status: 'healthy',
      message: 'Backend and database are operational',
      timestamp: new Date().toISOString(),
      responseTime: `${totalResponseTime}ms`,
      database: {
        connected: true,
        responseTime: `${healthCheckResults.database.responseTime}ms`,
        accessibleTables: connectedTables,
        totalTables: Object.keys(healthCheckResults.database.tables).length
      }
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
