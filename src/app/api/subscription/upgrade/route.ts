import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP, isValidUUID, getCorsHeaders } from '@/lib/security';

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// POST - Upgrade user plan (Pro/Growth)
export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 10 requests per minute per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`subscription_upgrade_${clientIP}`, 10, 60000);

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
        const { user_id, plan_type } = body;

        // Validate user_id is a valid UUID
        if (!user_id || !isValidUUID(user_id)) {
            return NextResponse.json(
                { error: 'Valid user_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate plan_type
        const validPlans = ['free', 'starter', 'pro', 'growth'];
        if (!plan_type || !validPlans.includes(plan_type)) {
            return NextResponse.json(
                { error: 'Invalid plan_type. Must be one of: free, starter, pro, growth' },
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
        // Get authorization header to validate session
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

        // CRITICAL: Verify user_id matches the authenticated user
        // This prevents IDOR attacks where someone upgrades another user's account
        if (authenticatedUser.id !== user_id) {
            console.warn(`[SECURITY] IDOR attempt detected: Authenticated user ${authenticatedUser.id} tried to upgrade ${user_id}`);
            return NextResponse.json(
                { error: 'You can only upgrade your own account' },
                { status: 403, headers: corsHeaders }
            );
        }

        // User is verified - they exist and are authenticated

        // Determine features based on plan
        const planFeatures: Record<string, boolean> = {
            has_ai_assistant: plan_type === 'pro' || plan_type === 'growth',
            has_analytics: plan_type === 'growth',
            has_custom_design: plan_type === 'growth',
        };

        // Calculate subscription expiry (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Check existing subscription
        const { data: existing } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (existing) {
            // Update existing subscription
            const { error } = await supabase
                .from('user_subscriptions')
                .update({
                    plan_type,
                    ...planFeatures,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user_id);

            if (error) {
                console.error('Plan update error:', error);
                return NextResponse.json(
                    { error: 'Failed to update subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            // Create new subscription
            const { error } = await supabase
                .from('user_subscriptions')
                .insert({
                    user_id,
                    plan_type,
                    ...planFeatures,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Plan insert error:', error);
                return NextResponse.json(
                    { error: 'Failed to create subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: `Plan upgraded to ${plan_type} successfully`,
            plan_type,
            features: planFeatures
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Subscription upgrade API error:', error);
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
