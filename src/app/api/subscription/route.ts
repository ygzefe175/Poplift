import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP, isValidUUID, sanitizeString, getCorsHeaders } from '@/lib/security';

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// POST - Activate an addon for user (requires authentication)
export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 10 requests per minute per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`subscription_post_${clientIP}`, 10, 60000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        ...corsHeaders,
                        'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000))
                    }
                }
            );
        }

        const body = await request.json();
        const { user_id, addon_type } = body;

        // Validate user_id is a valid UUID
        if (!user_id || !isValidUUID(user_id)) {
            return NextResponse.json(
                { error: 'Valid user_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate addon_type
        const validAddons = ['analytics', 'custom_design', 'ai_assistant', 'onboarding', 'money_coach'];
        if (!addon_type || !validAddons.includes(addon_type)) {
            return NextResponse.json(
                { error: 'Invalid addon_type' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503, headers: corsHeaders }
            );
        }

        // CRITICAL SECURITY FIX: Verify the request comes from authenticated user
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401, headers: corsHeaders }
            );
        }

        const token = authHeader.split(' ')[1];
        const { data: { user: authenticatedUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authenticatedUser) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401, headers: corsHeaders }
            );
        }

        // CRITICAL: Verify user_id matches the authenticated user (IDOR prevention)
        if (authenticatedUser.id !== user_id) {
            console.warn(`[SECURITY] IDOR attempt: ${authenticatedUser.id} tried to modify ${user_id}`);
            return NextResponse.json(
                { error: 'You can only modify your own subscription' },
                { status: 403, headers: corsHeaders }
            );
        }

        // Check existing subscription
        const { data: existing } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .single();

        const addonField = `has_${addon_type}`;
        const expiresField = `${addon_type}_expires_at`;

        // Calculate expiry (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        if (existing) {
            const updateData: Record<string, unknown> = {
                [addonField]: true,
                updated_at: new Date().toISOString()
            };

            if (addon_type === 'analytics') {
                updateData[expiresField] = expiresAt.toISOString();
            }

            const { error } = await supabase
                .from('user_subscriptions')
                .update(updateData)
                .eq('user_id', user_id);

            if (error) {
                console.error('Subscription update error:', error);
                return NextResponse.json(
                    { error: 'Failed to update subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            const insertData: Record<string, unknown> = {
                user_id,
                plan_type: 'free',
                [addonField]: true
            };

            if (addon_type === 'analytics') {
                insertData[expiresField] = expiresAt.toISOString();
            }

            const { error } = await supabase
                .from('user_subscriptions')
                .insert(insertData);

            if (error) {
                console.error('Subscription insert error:', error);
                return NextResponse.json(
                    { error: 'Failed to create subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: `${sanitizeString(addon_type)} activated successfully`,
            expires_at: expiresAt.toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Subscription API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// GET - Check subscription status
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 60 requests per minute per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`subscription_get_${clientIP}`, 60, 60000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests' },
                {
                    status: 429,
                    headers: {
                        ...corsHeaders,
                        'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000))
                    }
                }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId || !isValidUUID(userId)) {
            return NextResponse.json(
                { error: 'Valid user_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503, headers: corsHeaders }
            );
        }

        const { data, error } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            return NextResponse.json(
                { error: 'Failed to fetch subscription' },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            success: true,
            subscription: data || {
                plan_type: 'free',
                has_analytics: false,
                has_custom_design: false,
                has_ai_assistant: false,
                has_onboarding: false
            }
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Subscription GET error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}
