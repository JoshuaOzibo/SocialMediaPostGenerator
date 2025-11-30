import supabase from '../lib/config/supabaseClient.js';

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private isInsertMode = true; 

  constructor() {
    console.log('🔄 Keep Alive Service initialized - will alternate between insert and delete every 4 days');
  }

  public start(): void {
    if (this.isRunning) {
      console.log('⚠️  Keep Alive Service is already running');
      return;
    }

    console.log('🚀 Starting Keep Alive Service...');
    this.isRunning = true;

    this.performKeepAlive();

    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.performKeepAlive();
    }, fourDaysInMs);

    console.log('✅ Keep Alive Service started - will perform operation every 4 days');
  }

  /**
   * Stop the keep alive service
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('⚠️  Keep Alive Service is not running');
      return;
    }

    console.log('🛑 Stopping Keep Alive Service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('✅ Keep Alive Service stopped');
  }

  /**
   * Perform keep alive operation
   * Alternates between inserting and deleting "goodmorning db"
   */
  private async performKeepAlive(): Promise<void> {
    try {
      if (this.isInsertMode) {
        // Insert mode: Insert "goodmorning db" into the database
        const { data, error } = await supabase
          .from('db_keepalive')
          .insert([{ message: 'goodmorning db' }])
          .select();

        if (error) {
          console.error('❌ Keep Alive INSERT failed:', error.message);
        } else {
          console.log(`✅ Keep Alive INSERT successful at ${new Date().toISOString()}`);
        }
      } else {
        // Delete mode: Find and delete "goodmorning db" records
        const { error } = await supabase
          .from('db_keepalive')
          .delete()
          .eq('message', 'goodmorning db');

        if (error) {
          console.error('❌ Keep Alive DELETE failed:', error.message);
        } else {
          console.log(`✅ Keep Alive DELETE successful at ${new Date().toISOString()}`);
        }
      }

      // Toggle between insert and delete mode
      this.isInsertMode = !this.isInsertMode;
    } catch (error) {
      console.error('❌ Keep Alive operation failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Get the current status of the service
   */
  public getStatus(): { running: boolean; nextOperation: 'insert' | 'delete' } {
    return {
      running: this.isRunning,
      nextOperation: this.isInsertMode ? 'insert' : 'delete'
    };
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;
