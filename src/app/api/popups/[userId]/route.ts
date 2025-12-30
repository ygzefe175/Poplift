import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Create Supabase client with proper error handling
function getSupabaseClient(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Popups API] Missing Supabase configuration');
        return null;
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Validate UUID format
function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        // Parse userId from params
        const { userId } = await context.params;

        // Validate userId
        if (!userId || userId === 'null' || userId === 'undefined' || userId === '') {
            return NextResponse.json(
                {
                    popups: [],
                    error: 'Invalid user ID provided',
                    code: 'INVALID_USER_ID'
                },
                {
                    status: 200, // Return 200 with empty popups to prevent client errors
                    headers: corsHeaders
                }
            );
        }

        // Validate UUID format
        if (!isValidUUID(userId)) {
            console.warn('[Popups API] Invalid UUID format:', userId);
            return NextResponse.json(
                {
                    popups: [],
                    error: 'Invalid user ID format',
                    code: 'INVALID_UUID_FORMAT'
                },
                {
                    status: 200,
                    headers: corsHeaders
                }
            );
        }

        // Get Supabase client
        const supabase = getSupabaseClient();
        if (!supabase) {
            console.error('[Popups API] Supabase client not available');
            return NextResponse.json(
                {
                    popups: [],
                    error: 'Database connection unavailable',
                    code: 'DB_CONNECTION_ERROR'
                },
                {
                    status: 200, // Return 200 to prevent client errors
                    headers: corsHeaders
                }
            );
        }

        // Fetch active popups for this user
        const { data: popups, error } = await supabase
            .from('popups')
            .select('id, name, type, headline, subtext, cta_text, position, is_active, cta_url, delay_seconds, scroll_percent')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Popups API] Database error:', error.message);
            return NextResponse.json(
                {
                    popups: [],
                    error: 'Database query failed',
                    code: 'DB_QUERY_ERROR'
                },
                {
                    status: 200, // Return 200 to prevent client errors
                    headers: corsHeaders
                }
            );
        }

        // Enrich popups with defaults
        const enrichedPopups = (popups || []).map(popup => ({
            id: popup.id,
            name: popup.name || 'Popup',
            type: popup.type || 'standard',
            headline: popup.headline || 'Özel Teklif!',
            subtext: popup.subtext || '',
            cta_text: popup.cta_text || 'Devam Et',
            cta_url: popup.cta_url || null,
            position: popup.position || 'center',
            delay_seconds: popup.delay_seconds || 5,
            scroll_percent: popup.scroll_percent || 50,
            is_active: popup.is_active
        }));

        console.log(`[Popups API] Returning ${enrichedPopups.length} popup(s) for user ${userId.substring(0, 8)}...`);

        return NextResponse.json(
            {
                popups: enrichedPopups,
                count: enrichedPopups.length,
                timestamp: new Date().toISOString()
            },
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
                },
            }
        );

    } catch (error) {
        console.error('[Popups API] Unexpected error:', error);
        return NextResponse.json(
            {
                popups: [],
                error: 'Unexpected server error',
                code: 'INTERNAL_ERROR'
            },
            {
                status: 200, // Return 200 to prevent client errors
                headers: corsHeaders
            }
        );
    }
}

// Handle CORS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}
