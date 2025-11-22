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
        error: null as string | null,
        warnings: [] as string[]
      }
    };
    
    // Test tables in order: posts (most likely to exist), then user_profiles, then scheduled_posts
    const tablesToTest = [
      { name: 'posts', key: 'posts' as const },
      { name: 'user_profiles', key: 'user_profiles' as const },
      { name: 'scheduled_posts', key: 'scheduled_posts' as const }
    ];
    
    const connectionStart = Date.now();
    let firstSuccessfulTable = false;
    
    // Test each table
    for (const table of tablesToTest) {
      const { data, error } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);
      
      if (!error) {
        healthCheckResults.database.tables[table.key] = true;
        if (!firstSuccessfulTable) {
          healthCheckResults.database.connected = true;
          firstSuccessfulTable = true;
          healthCheckResults.database.responseTime = Date.now() - connectionStart;
        }
      } else {
        // Handle specific PostgREST errors
        if (error.code === 'PGRST205') {
          healthCheckResults.database.warnings.push(
            `Table '${table.name}' not found in PostgREST schema cache. This usually means:` +
            `\n  1. The table hasn't been created yet in Supabase (run database_schema.sql)` +
            `\n  2. PostgREST schema cache needs to be refreshed (restart Supabase or wait a few minutes)` +
            `\n  3. The table exists but isn't exposed to the API`
          );
        } else if (error.code === '42P01') {
          healthCheckResults.database.warnings.push(
            `Table '${table.name}' does not exist in the database. Run database_schema.sql in Supabase SQL Editor.`
          );
        }
      }
    }
    
    // If no tables are accessible, set the error
    if (!healthCheckResults.database.connected) {
      healthCheckResults.database.responseTime = Date.now() - connectionStart;
      healthCheckResults.database.error = 'No database tables are accessible. ' +
        'Please ensure the database schema has been created in Supabase and PostgREST has been refreshed.';
      console.error('Database connection test failed:', {
        message: healthCheckResults.database.error,
        warnings: healthCheckResults.database.warnings
      });
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
        details: healthCheckResults,
        troubleshooting: {
          steps: [
            '1. Go to your Supabase Dashboard → SQL Editor',
            '2. Run the SQL from database_schema.sql to create all tables',
            '3. Run the SQL from database_migration_add_original_params.sql (if not already applied)',
            '4. Wait 1-2 minutes for PostgREST to refresh its schema cache',
            '5. If issues persist, try restarting your Supabase project or contact Supabase support'
          ],
          errorCode: healthCheckResults.database.error?.includes('PGRST205') ? 'PGRST205' : 'UNKNOWN',
          meaning: healthCheckResults.database.error?.includes('PGRST205') 
            ? 'PostgREST cannot find the table in its schema cache. The table may not exist or the cache needs refreshing.'
            : 'Database connection issue'
        }
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
