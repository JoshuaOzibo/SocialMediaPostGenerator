import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface KeepAliveConfig {
  enabled: boolean;
  intervalMinutes: number;
  baseUrl: string;
  timeout: number;
}

class KeepAliveService {
  private config: KeepAliveConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.config = {
      enabled: `${process.env.KEEP_ALIVE_ENABLED}` === 'true',
      intervalMinutes: parseInt(`${process.env.KEEP_ALIVE_INTERVAL_MINUTES}`),
      baseUrl: `http://localhost:${process.env.PORT}`, // `${process.env.KEEP_ALIVE_BASE_URL || `http://localhost:${process.env.PORT || 8080}`}`,
      timeout: parseInt(`${process.env.KEEP_ALIVE_TIMEOUT_MS}`),
    };

    console.log('🔄 Keep Alive Service initialized:', {
      enabled: this.config.enabled,
      interval: `${this.config.intervalMinutes} minutes`,
      baseUrl: this.config.baseUrl
    });
  }

  /**
   * Start the keep alive service
   */
  public start(): void {
    if (!this.config.enabled) {
      console.log(' Keep Alive Service is disabled via environment variable');
      return;
    }

    if (this.isRunning) {
      console.log(' Keep Alive Service is already running');
      return;
    }

    console.log(' Starting Keep Alive Service...');
    this.isRunning = true;

    // Perform initial health check
    this.performHealthCheck();

    // Set up interval for periodic health checks
    const intervalMs = this.config.intervalMinutes * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    console.log(` Keep Alive Service started - checking every ${this.config.intervalMinutes} minutes`);
  }

  /**
   * Stop the keep alive service
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log(' Keep Alive Service is not running');
      return;
    }

    console.log(' Stopping Keep Alive Service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log(' Keep Alive Service stopped');
  }

  /**
   * Perform a health check by calling the health endpoint
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const startTime = Date.now();
      const healthUrl = `${this.config.baseUrl}/api/v1/health/health`;
      
      console.log(` Performing health check at ${new Date().toISOString()}`);
      
      const response = await axios.get(healthUrl, {
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'KeepAliveService/1.0'
        }
      });

      const responseTime = Date.now() - startTime;
      
      if (response.status === 200) {
        console.log(` Health check successful - Status: ${response.data.status}, Response time: ${responseTime}ms`);
      } else {
        console.warn(` Health check returned status ${response.status}`);
      }

    } catch (error) {
      console.error(' Health check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });

      // If it's a network error, try the ping endpoint as a fallback
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
            console.log(' Attempting fallback ping...');
        await this.performPingCheck();
      }
    }
  }

  /**
   * Perform a simple ping check as fallback
   */
  private async performPingCheck(): Promise<void> {
    try {
      const pingUrl = `${this.config.baseUrl}/api/v1/health/ping`;
      
      const response = await axios.get(pingUrl, {
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'KeepAliveService/1.0'
        }
      });

      if (response.status === 200) {
        console.log(' Ping check successful - Server is responding');
      }
    } catch (error) {
      console.error(' Ping check also failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Get the current status of the service
   */
  public getStatus(): { running: boolean; config: KeepAliveConfig } {
    return {
      running: this.isRunning,
      config: this.config
    };
  }

  /**
   * Restart the service with new configuration
   */
  public restart(): void {
    console.log(' Restarting Keep Alive Service...');
    this.stop();
    setTimeout(() => {
      this.start();
    }, 1000);
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;
