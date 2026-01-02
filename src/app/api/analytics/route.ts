import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Create Supabase client  
function getSupabaseClient(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Analytics API] Missing Supabase configuration');
        return null;
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// Device detection helper
function detectDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();
    if (/ipad|tablet|playbook|silk/.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) return 'mobile';
    return 'desktop';
}

// Browser detection helper
function detectBrowser(userAgent: string): { name: string; version: string } {
    const ua = userAgent;
    let match;

    // Chrome
    if ((match = ua.match(/Chrome\/(\d+)/))) {
        if (ua.includes('Edg')) return { name: 'Edge', version: match[1] };
        if (ua.includes('OPR')) return { name: 'Opera', version: match[1] };
        return { name: 'Chrome', version: match[1] };
    }
    // Firefox
    if ((match = ua.match(/Firefox\/(\d+)/))) {
        return { name: 'Firefox', version: match[1] };
    }
    // Safari
    if ((match = ua.match(/Version\/(\d+).*Safari/))) {
        return { name: 'Safari', version: match[1] };
    }
    // IE
    if ((match = ua.match(/MSIE (\d+)/)) || (match = ua.match(/rv:(\d+)/))) {
        return { name: 'IE', version: match[1] };
    }

    return { name: 'Unknown', version: '0' };
}

// OS detection helper
function detectOS(userAgent: string): { name: string; version: string } {
    const ua = userAgent;
    let match;

    if ((match = ua.match(/Windows NT (\d+\.\d+)/))) {
        const versions: Record<string, string> = {
            '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista'
        };
        return { name: 'Windows', version: versions[match[1]] || match[1] };
    }
    if ((match = ua.match(/Mac OS X (\d+[._]\d+)/))) {
        return { name: 'macOS', version: match[1].replace('_', '.') };
    }
    if ((match = ua.match(/Android (\d+)/))) {
        return { name: 'Android', version: match[1] };
    }
    if (ua.includes('iPhone') || ua.includes('iPad')) {
        const iosMatch = ua.match(/OS (\d+)/);
        return { name: 'iOS', version: iosMatch ? iosMatch[1] : 'Unknown' };
    }
    if (ua.includes('Linux')) {
        return { name: 'Linux', version: '' };
    }

    return { name: 'Unknown', version: '' };
}

// Extract domain from URL
function extractDomain(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return '';
    }
}

// Valid event types for analytics
type AnalyticsEventType = 'pageview' | 'scroll' | 'exit' | 'heartbeat' | 'session_start' | 'session_end';

interface AnalyticsPayload {
    user_id: string; // Site owner's user ID
    event_type: AnalyticsEventType;
    session_id: string;
    visitor_id: string;
    // Page info
    page_url: string;
    page_title?: string;
    referrer?: string;
    // Device info
    user_agent: string;
    screen_width?: number;
    screen_height?: number;
    // Behavior
    scroll_depth?: number;
    time_on_page?: number;
    // UTM
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}

export async function POST(request: NextRequest) {
    try {
        let body: AnalyticsPayload;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, error: 'Invalid JSON body' },
                { status: 400, headers: corsHeaders }
            );
        }

        const {
            user_id,
            event_type,
            session_id,
            visitor_id,
            page_url,
            page_title,
            referrer,
            user_agent,
            screen_width,
            screen_height,
            scroll_depth,
            time_on_page,
            utm_source,
            utm_medium,
            utm_campaign
        } = body;

        // Validate required fields
        if (!user_id || !session_id || !visitor_id || !page_url) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400, headers: corsHeaders }
            );
        }

        const validEvents: AnalyticsEventType[] = ['pageview', 'scroll', 'exit', 'heartbeat', 'session_start', 'session_end'];
        if (!validEvents.includes(event_type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid event_type' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { success: true, warning: 'Tracking skipped - no database' },
                { status: 200, headers: corsHeaders }
            );
        }

        // Check if user has analytics addon
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('has_analytics, plan_type')
            .eq('user_id', user_id)
            .single();

        // If no subscription or no analytics = still track but limited
        const hasFullAnalytics = subscription?.has_analytics ||
            subscription?.plan_type === 'pro' ||
            subscription?.plan_type === 'growth';

        // Parse device info
        const deviceType = detectDevice(user_agent || '');
        const browser = detectBrowser(user_agent || '');
        const os = detectOS(user_agent || '');
        const referrerDomain = referrer ? extractDomain(referrer) : null;
        const pagePath = (() => {
            try { return new URL(page_url).pathname; } catch { return '/'; }
        })();

        // Handle different event types
        if (event_type === 'pageview' || event_type === 'session_start') {
            // Create page view record
            await supabase.from('page_views').insert({
                user_id,
                session_id,
                visitor_id,
                page_url: page_url.substring(0, 2000),
                page_title: page_title?.substring(0, 255) || null,
                page_path: pagePath,
                referrer: referrer?.substring(0, 2000) || null,
                referrer_domain: referrerDomain,
                device_type: deviceType,
                browser: browser.name,
                browser_version: browser.version,
                os: os.name,
                os_version: os.version,
                screen_width: screen_width || null,
                screen_height: screen_height || null,
                scroll_depth: 0,
                time_on_page: 0,
                is_bounce: true
            });

            // Create or update session
            if (event_type === 'session_start') {
                await supabase.from('sessions').upsert({
                    session_id,
                    user_id,
                    visitor_id,
                    first_page: page_url,
                    last_page: page_url,
                    pages_viewed: 1,
                    total_time: 0,
                    utm_source: utm_source || null,
                    utm_medium: utm_medium || null,
                    utm_campaign: utm_campaign || null,
                    referrer_domain: referrerDomain,
                    device_type: deviceType,
                    browser: browser.name,
                    os: os.name,
                    started_at: new Date().toISOString(),
                    last_activity_at: new Date().toISOString()
                }, { onConflict: 'session_id' });
            } else {
                // Update existing session - increment pages via direct update
                // First get current value
                const { data: currentSession } = await supabase
                    .from('sessions')
                    .select('pages_viewed')
                    .eq('session_id', session_id)
                    .single();

                await supabase
                    .from('sessions')
                    .update({
                        last_page: page_url,
                        pages_viewed: (currentSession?.pages_viewed || 0) + 1,
                        last_activity_at: new Date().toISOString()
                    })
                    .eq('session_id', session_id);
            }
        }

        if (event_type === 'scroll' && hasFullAnalytics) {
            // Update scroll depth for the current page view
            await supabase
                .from('page_views')
                .update({
                    scroll_depth: scroll_depth || 0,
                    is_bounce: false // User scrolled = not a bounce
                })
                .eq('session_id', session_id)
                .eq('page_url', page_url)
                .order('created_at', { ascending: false })
                .limit(1);
        }

        if (event_type === 'heartbeat' && hasFullAnalytics) {
            // Update time on page
            await supabase
                .from('page_views')
                .update({
                    time_on_page: time_on_page || 0,
                    is_bounce: (time_on_page || 0) > 10 ? false : true
                })
                .eq('session_id', session_id)
                .eq('page_url', page_url)
                .order('created_at', { ascending: false })
                .limit(1);

            // Update session total time
            await supabase
                .from('sessions')
                .update({
                    total_time: time_on_page || 0,
                    last_activity_at: new Date().toISOString()
                })
                .eq('session_id', session_id);
        }

        if (event_type === 'exit' || event_type === 'session_end') {
            // Finalize page view
            await supabase
                .from('page_views')
                .update({
                    exited_at: new Date().toISOString(),
                    time_on_page: time_on_page || 0,
                    scroll_depth: scroll_depth || 0
                })
                .eq('session_id', session_id)
                .eq('page_url', page_url)
                .order('created_at', { ascending: false })
                .limit(1);

            // Finalize session
            if (event_type === 'session_end') {
                await supabase
                    .from('sessions')
                    .update({
                        ended_at: new Date().toISOString(),
                        total_time: time_on_page || 0
                    })
                    .eq('session_id', session_id);
            }
        }

        return NextResponse.json(
            { success: true, full_tracking: hasFullAnalytics },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('[Analytics API] Error:', error);
        return NextResponse.json(
            { success: true, warning: 'Error handled gracefully' },
            { status: 200, headers: corsHeaders }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}
