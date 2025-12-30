import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

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

// Validate UUID format
function isValidUUID(str: string): boolean {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

// Valid event types
const VALID_EVENT_TYPES = ['impression', 'click', 'close', 'conversion'];

export async function POST(request: NextRequest) {
    try {
        // Parse request body
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

        // Validate popup_id
        if (!popup_id || !isValidUUID(popup_id)) {
            return NextResponse.json(
                { success: false, error: 'Valid popup_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate event_type
        if (!event_type || !VALID_EVENT_TYPES.includes(event_type)) {
            return NextResponse.json(
                { success: false, error: 'Valid event_type is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Get Supabase client
        const supabase = getSupabaseClient();
        if (!supabase) {
            // Still return success to not break the client
            console.error('[Track API] Database connection unavailable');
            return NextResponse.json(
                { success: true, warning: 'Tracking skipped due to configuration' },
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

        // Log detailed event for analytics (optional - silently fail if table doesn't exist)
        try {
            await supabase.from('popup_events').insert({
                popup_id,
                event_type,
                url: url?.substring(0, 2000) || null, // Limit URL length
                user_agent: user_agent?.substring(0, 500) || null, // Limit user_agent length
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
        // Always return success to not break the client
        return NextResponse.json(
            { success: true, warning: 'Tracking error occurred but was handled' },
            { status: 200, headers: corsHeaders }
        );
    }
}

// Handle CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}
