
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ptnorpmduyrjyficbayg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bm9ycG1kdXlyanlmaWNiYXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjQzNzAsImV4cCI6MjA5NTc0MDM3MH0.oe7ce4qkU916KeMReJRJ5W1F_mxCm5VrcEGbIRgs8nI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
