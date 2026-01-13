import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    // We log a warning but don't throw, to prevent build failures if env vars are missing
    console.warn('Supabase URL or Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
