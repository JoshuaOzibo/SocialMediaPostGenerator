import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables");
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
