import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// POST - Activate an addon for user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, addon_type } = body;

        if (!user_id || !addon_type) {
            return NextResponse.json(
                { error: 'user_id and addon_type are required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const validAddons = ['analytics', 'custom_design', 'ai_assistant', 'onboarding'];
        if (!validAddons.includes(addon_type)) {
            return NextResponse.json(
                { error: 'Invalid addon_type' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Database unavailable' },
                { status: 500, headers: corsHeaders }
            );
        }

        // Check if user subscription exists
        const { data: existing } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .single();

        const addonField = `has_${addon_type}`;
        const expiresField = `${addon_type}_expires_at`;

        // Calculate expiry (30 days from now for monthly)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        if (existing) {
            // Update existing subscription
            const updateData: Record<string, unknown> = {
                [addonField]: true,
                updated_at: new Date().toISOString()
            };

            // Add expiry for analytics
            if (addon_type === 'analytics') {
                updateData[expiresField] = expiresAt.toISOString();
            }

            const { error } = await supabase
                .from('user_subscriptions')
                .update(updateData)
                .eq('user_id', user_id);

            if (error) {
                console.error('Update error:', error);
                return NextResponse.json(
                    { error: 'Failed to update subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        } else {
            // Create new subscription
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
                console.error('Insert error:', error);
                return NextResponse.json(
                    { error: 'Failed to create subscription' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: `${addon_type} activated successfully`,
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
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Database unavailable' },
                { status: 500, headers: corsHeaders }
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

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}
