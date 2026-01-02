import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

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

        // Calculate date range
        const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch daily stats
        const { data: dailyStats } = await supabase
            .from('daily_stats')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

        // Fetch sessions for device breakdown
        const { data: sessions } = await supabase
            .from('sessions')
            .select('device_type, browser, os, referrer_domain, had_popup_click, converted')
            .eq('user_id', userId)
            .gte('started_at', startDate.toISOString());

        // Fetch page views for top pages
        const { data: pageViews } = await supabase
            .from('page_views')
            .select('page_path, page_title')
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString());

        // Calculate aggregates
        const totals = {
            visitors: 0,
            uniqueVisitors: 0,
            pageViews: 0,
            avgTimeOnSite: 0,
            bounceRate: 0,
            popupImpressions: 0,
            popupClicks: 0,
            popupConversions: 0
        };

        if (dailyStats && dailyStats.length > 0) {
            dailyStats.forEach(day => {
                totals.visitors += day.total_visitors || 0;
                totals.uniqueVisitors += day.unique_visitors || 0;
                totals.pageViews += day.page_views || 0;
                totals.popupImpressions += day.popup_impressions || 0;
                totals.popupClicks += day.popup_clicks || 0;
                totals.popupConversions += day.popup_conversions || 0;
            });
            totals.avgTimeOnSite = Math.round(
                dailyStats.reduce((sum, d) => sum + (d.avg_time_on_site || 0), 0) / dailyStats.length
            );
            totals.bounceRate = Math.round(
                dailyStats.reduce((sum, d) => sum + (d.bounce_rate || 0), 0) / dailyStats.length * 10
            ) / 10;
        }

        // Device breakdown
        const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
        const browserBreakdown: Record<string, number> = {};
        const referrerBreakdown: Record<string, number> = {};

        if (sessions) {
            sessions.forEach(s => {
                if (s.device_type) {
                    deviceBreakdown[s.device_type as keyof typeof deviceBreakdown]++;
                }
                if (s.browser) {
                    browserBreakdown[s.browser] = (browserBreakdown[s.browser] || 0) + 1;
                }
                if (s.referrer_domain) {
                    referrerBreakdown[s.referrer_domain] = (referrerBreakdown[s.referrer_domain] || 0) + 1;
                }
            });
        }

        // Top pages
        const pageCount: Record<string, { count: number; title: string }> = {};
        if (pageViews) {
            pageViews.forEach(pv => {
                const path = pv.page_path || '/';
                if (!pageCount[path]) {
                    pageCount[path] = { count: 0, title: pv.page_title || path };
                }
                pageCount[path].count++;
            });
        }

        const topPages = Object.entries(pageCount)
            .map(([path, data]) => ({ path, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Top referrers
        const topReferrers = Object.entries(referrerBreakdown)
            .map(([domain, count]) => ({ domain, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Top browsers
        const topBrowsers = Object.entries(browserBreakdown)
            .map(([browser, count]) => ({ browser, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Format chart data
        const chartData = dailyStats?.map(day => ({
            date: day.date,
            visitors: day.total_visitors || 0,
            pageViews: day.page_views || 0,
            conversions: day.popup_conversions || 0
        })) || [];

        // Calculate conversion rate
        const conversionRate = totals.popupImpressions > 0
            ? Math.round((totals.popupClicks / totals.popupImpressions) * 1000) / 10
            : 0;

        return NextResponse.json({
            success: true,
            period,
            totals: {
                ...totals,
                conversionRate
            },
            chartData,
            deviceBreakdown,
            topPages,
            topReferrers,
            topBrowsers
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('[Analytics Data API] Error:', error);
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
