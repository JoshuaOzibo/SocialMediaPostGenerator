import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: Log which key is being used
// console.log('Supabase URL:', supabaseUrl);
// console.log('Anon Key length:', supabaseAnonKey?.length || 0);
// console.log('Service Key length:', supabaseServiceKey?.length || 0);
// console.log('Using key type:', supabaseServiceKey ? 'SERVICE_ROLE' : 'ANON');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables");
}

// Create Supabase client with service role key for backend operations
// This bypasses RLS policies for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// If service role key is not available, log a warning
if (!supabaseServiceKey) {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using anon key which may cause RLS issues.');
  console.warn('   Add SUPABASE_SERVICE_ROLE_KEY to your .env file to bypass RLS policies.');
}

export default supabase;
