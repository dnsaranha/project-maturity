// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uukooogzeldwmudkazxj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a29vb2d6ZWxkd211ZGthenhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzEyNjcsImV4cCI6MjA1NjcwNzI2N30.ipN-qLeY_vJtWlpfILQ2UwVz3xMrDjAYEeWXXyCTPCc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);