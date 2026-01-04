import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a singleton instance for client-side
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    // Return existing instance if available
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // Check if we have valid credentials
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Supabase] Missing environment variables. Using fallback...');
        // For development/demo purposes, create a mock client that won't crash
        // In production, these should always be set
    }

    supabaseInstance = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key',
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    );

    return supabaseInstance;
}

// Export the singleton client
export const supabase = getSupabaseClient();

// Server-side client with service role (for API routes only)
export function createServerClient(): SupabaseClient | null {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.warn('[Supabase Server] Missing environment variables');
        return null;
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
