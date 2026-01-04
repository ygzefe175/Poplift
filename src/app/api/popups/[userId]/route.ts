import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP, isValidUUID, getCorsHeaders } from '@/lib/security';

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

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 100 requests per minute per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`popups_${clientIP}`, 100, 60000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { popups: [], error: 'Too many requests', code: 'RATE_LIMITED' },
                {
                    status: 200, // Return 200 to not break client
                    headers: corsHeaders
                }
            );
        }

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
                    status: 200,
                    headers: corsHeaders
                }
            );
        }

        // Validate UUID format
        if (!isValidUUID(userId)) {
            console.warn('[Popups API] Invalid UUID format:', userId.substring(0, 8) + '...');
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
                    error: 'Service temporarily unavailable',
                    code: 'SERVICE_UNAVAILABLE'
                },
                {
                    status: 200,
                    headers: corsHeaders
                }
            );
        }

        // Fetch active popups for this user
        // Only select necessary fields to minimize data exposure
        const { data: popups, error } = await supabase
            .from('popups')
            .select('id, name, type, headline, subtext, cta_text, position, is_active, cta_url, delay_seconds, scroll_percent')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(20); // Limit results

        if (error) {
            console.error('[Popups API] Database error:', error.message);
            return NextResponse.json(
                {
                    popups: [],
                    error: 'Failed to fetch popups',
                    code: 'DB_QUERY_ERROR'
                },
                {
                    status: 200,
                    headers: corsHeaders
                }
            );
        }

        // Enrich popups with safe defaults
        const enrichedPopups = (popups || []).map(popup => ({
            id: popup.id,
            name: popup.name || 'Popup',
            type: popup.type || 'standard',
            headline: popup.headline || 'Özel Teklif!',
            subtext: popup.subtext || '',
            cta_text: popup.cta_text || 'Devam Et',
            cta_url: popup.cta_url || null,
            position: popup.position || 'center',
            delay_seconds: Math.min(popup.delay_seconds || 5, 60), // Cap at 60 seconds
            scroll_percent: Math.min(Math.max(popup.scroll_percent || 50, 0), 100), // Clamp 0-100
            is_active: popup.is_active
        }));

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
                status: 200,
                headers: corsHeaders
            }
        );
    }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}
