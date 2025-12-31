import supabase from '../lib/config/supabaseClient.js';

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    console.log('🔄 Keep Alive Service initialized - will maintain single activity record every 4 days');
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
      // Check for existing records
      const { data: existingRecords, error: fetchError } = await supabase
        .from('db_keepalive')
        .select('id, created_at')
        .eq('message', 'goodmorning db')
        .order('created_at', { ascending: false });

      if (fetchError) {
        // console.error('❌ Keep Alive CHECK failed:', fetchError.message);
        return;
      }

      if (existingRecords && existingRecords.length > 0) {
        // Records exist - use the most recent one
        const recordToKeep = existingRecords[0];

        // Update the timestamp of the existing record to keep DB active
        const { error: updateError } = await supabase
          .from('db_keepalive')
          .update({ created_at: new Date().toISOString() })
          .eq('id', recordToKeep.id);

        if (updateError) {
          console.error('❌ Keep Alive UPDATE failed:', updateError.message);
        } else {
          console.log(`✅ Keep Alive UPDATE successful for record ${recordToKeep.id} at ${new Date().toISOString()}`);
        }

        // Clean up duplicates if any
        if (existingRecords.length > 1) {
          const idsToDelete = existingRecords.slice(1).map(r => r.id);
          const { error: deleteError } = await supabase
            .from('db_keepalive')
            .delete()
            .in('id', idsToDelete);

          if (deleteError) {
            console.error('❌ Keep Alive CLEANUP failed:', deleteError.message);
          } else {
            console.log(`🧹 Keep Alive CLEANUP successful - removed ${idsToDelete.length} duplicate records`);
          }
        }
      } else {
        // No records exist - Insert new one
        const { error: insertError } = await supabase
          .from('db_keepalive')
          .insert([{ message: 'goodmorning db' }]);

        if (insertError) {
          console.error('❌ Keep Alive INSERT failed:', insertError.message);
        } else {
          console.log(`✅ Keep Alive INSERT successful at ${new Date().toISOString()}`);
        }
      }
    } catch (error) {
      console.error('❌ Keep Alive operation failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  public getStatus(): { running: boolean; mode: string } {
    return {
      running: this.isRunning,
      mode: 'maintenance'
    };
  }
}

const keepAliveService = new KeepAliveService();

export default keepAliveService;
