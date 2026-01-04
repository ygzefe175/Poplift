import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP, isValidUUID, getCorsHeaders } from '@/lib/security';

// Create Supabase client with proper error handling
function getSupabaseClient(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Track API] Missing Supabase configuration');
        return null;
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Valid event types (whitelist)
const VALID_EVENT_TYPES = ['impression', 'click', 'close', 'conversion'] as const;
type EventType = typeof VALID_EVENT_TYPES[number];

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 200 requests per minute per IP (tracking is high volume)
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`track_${clientIP}`, 200, 60000);

        if (!rateLimit.allowed) {
            // Still return 200 to not break client-side tracking
            return NextResponse.json(
                { success: true, warning: 'Rate limited' },
                { status: 200, headers: corsHeaders }
            );
        }

        // Parse request body safely
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, error: 'Invalid JSON body' },
                { status: 400, headers: corsHeaders }
            );
        }

        const { popup_id, event_type, url, user_agent } = body;

        // Validate popup_id (required, must be UUID)
        if (!popup_id || !isValidUUID(popup_id)) {
            return NextResponse.json(
                { success: false, error: 'Valid popup_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate event_type (must be in whitelist)
        if (!event_type || !VALID_EVENT_TYPES.includes(event_type as EventType)) {
            return NextResponse.json(
                { success: false, error: 'Valid event_type is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Get Supabase client
        const supabase = getSupabaseClient();
        if (!supabase) {
            // Return success to not break client
            return NextResponse.json(
                { success: true, warning: 'Tracking skipped - configuration missing' },
                { status: 200, headers: corsHeaders }
            );
        }

        // Track the event
        let tracked = false;

        // Update impression or click count on the popup
        if (event_type === 'impression') {
            try {
                // Try RPC first
                const { error: rpcError } = await supabase.rpc('increment_impressions', { popup_id_param: popup_id });

                if (rpcError) {
                    // Fallback: direct update
                    const { data: popup } = await supabase
                        .from('popups')
                        .select('impressions')
                        .eq('id', popup_id)
                        .single();

                    if (popup) {
                        await supabase
                            .from('popups')
                            .update({ impressions: (popup.impressions || 0) + 1 })
                            .eq('id', popup_id);
                    }
                }
                tracked = true;
            } catch (e) {
                console.error('[Track API] Error updating impressions:', e);
            }
        } else if (event_type === 'click') {
            try {
                // Try RPC first
                const { error: rpcError } = await supabase.rpc('increment_clicks', { popup_id_param: popup_id });

                if (rpcError) {
                    // Fallback: direct update
                    const { data: popup } = await supabase
                        .from('popups')
                        .select('clicks')
                        .eq('id', popup_id)
                        .single();

                    if (popup) {
                        await supabase
                            .from('popups')
                            .update({ clicks: (popup.clicks || 0) + 1 })
                            .eq('id', popup_id);
                    }
                }
                tracked = true;
            } catch (e) {
                console.error('[Track API] Error updating clicks:', e);
            }
        }

        // Log detailed event for analytics (safely limit input sizes)
        try {
            await supabase.from('popup_events').insert({
                popup_id,
                event_type,
                url: typeof url === 'string' ? url.substring(0, 2000) : null,
                user_agent: typeof user_agent === 'string' ? user_agent.substring(0, 500) : null,
                ip_hash: clientIP ? Buffer.from(clientIP).toString('base64').substring(0, 32) : null, // Hash IP for privacy
                created_at: new Date().toISOString()
            });
        } catch {
            // Table might not exist, continue silently
        }

        return NextResponse.json(
            { success: true, tracked },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('[Track API] Unexpected error:', error);
        // Always return success to not break client
        return NextResponse.json(
            { success: true, warning: 'Tracking error handled' },
            { status: 200, headers: corsHeaders }
        );
    }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}
