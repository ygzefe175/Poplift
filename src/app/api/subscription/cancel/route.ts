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

// POST - Cancel subscription or addon
export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Rate limiting - 5 cancellations per hour per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`cancel_${clientIP}`, 5, 3600000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' },
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
        const { user_id, cancel_type } = body;

        // Validate user_id
        if (!user_id || !isValidUUID(user_id)) {
            return NextResponse.json(
                { error: 'Geçerli bir kullanıcı ID gerekli' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate cancel_type
        const validCancelTypes = ['plan', 'analytics', 'ai_assistant', 'custom_design', 'onboarding'];
        if (!cancel_type || !validCancelTypes.includes(cancel_type)) {
            return NextResponse.json(
                { error: 'Geçersiz iptal türü' },
                { status: 400, headers: corsHeaders }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Servis şu anda kullanılamıyor' },
                { status: 503, headers: corsHeaders }
            );
        }

        // Verify user exists
        const { data: userExists } = await supabase.auth.admin.getUserById(user_id);
        if (!userExists?.user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404, headers: corsHeaders }
            );
        }

        // Get current subscription
        const { data: currentSub, error: fetchError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Subscription fetch error:', fetchError);
            return NextResponse.json(
                { error: 'Abonelik bilgisi alınamadı' },
                { status: 500, headers: corsHeaders }
            );
        }

        if (!currentSub) {
            return NextResponse.json(
                { error: 'Aktif abonelik bulunamadı' },
                { status: 404, headers: corsHeaders }
            );
        }

        // Prepare update data
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        };

        // Calculate end of current billing period (mock - would be from payment provider in production)
        const cancellationEffectiveDate = new Date();
        cancellationEffectiveDate.setDate(cancellationEffectiveDate.getDate() + 30); // End of month

        if (cancel_type === 'plan') {
            // Downgrade to free plan at end of period
            updateData.plan_type = 'free';
            updateData.plan_cancelled_at = new Date().toISOString();
            updateData.plan_expires_at = cancellationEffectiveDate.toISOString();
        } else {
            // Cancel specific addon
            const addonField = `has_${cancel_type}`;
            const cancelledAtField = `${cancel_type}_cancelled_at`;

            if (!currentSub[addonField]) {
                return NextResponse.json(
                    { error: 'Bu eklenti aktif değil' },
                    { status: 400, headers: corsHeaders }
                );
            }

            updateData[addonField] = false;
            updateData[cancelledAtField] = new Date().toISOString();
        }

        // Update subscription
        const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update(updateData)
            .eq('user_id', user_id);

        if (updateError) {
            console.error('Subscription update error:', updateError);
            return NextResponse.json(
                { error: 'İptal işlemi başarısız oldu' },
                { status: 500, headers: corsHeaders }
            );
        }

        // Log cancellation for analytics
        try {
            await supabase.from('subscription_events').insert({
                user_id,
                event_type: 'cancellation',
                cancel_type,
                effective_date: cancellationEffectiveDate.toISOString(),
                created_at: new Date().toISOString()
            });
        } catch {
            // Table might not exist, continue silently
        }

        return NextResponse.json({
            success: true,
            message: cancel_type === 'plan'
                ? 'Aboneliğiniz iptal edildi. Dönem sonuna kadar kullanmaya devam edebilirsiniz.'
                : 'Eklenti iptal edildi.',
            effective_date: cancellationEffectiveDate.toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json(
            { error: 'Beklenmeyen bir hata oluştu' },
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
