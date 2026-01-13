import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // We log a warning but don't throw, to prevent build failures if env vars are missing
    console.warn('Supabase URL or Key is missing. Using placeholders to prevent build crash.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
