"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Smartphone, Monitor, Tablet, Calendar, Users, Eye, MousePointer, Clock, TrendingUp, Globe, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Demo data (fallback)
const DEMO_CHART_DATA = [
    { date: 'Pzt', visitors: 1240, pageViews: 3200, conversions: 45 },
    { date: 'Sal', visitors: 1580, pageViews: 4100, conversions: 62 },
    { date: 'Çar', visitors: 1320, pageViews: 3500, conversions: 38 },
    { date: 'Per', visitors: 1890, pageViews: 4800, conversions: 71 },
    { date: 'Cum', visitors: 2100, pageViews: 5200, conversions: 89 },
    { date: 'Cmt', visitors: 1650, pageViews: 4000, conversions: 55 },
    { date: 'Paz', visitors: 1420, pageViews: 3600, conversions: 48 },
];

const DEMO_DEVICE_DATA = {
    desktop: 65,
    mobile: 30,
    tablet: 5
};

interface AnalyticsData {
    totals: {
        visitors: number;
        uniqueVisitors: number;
        pageViews: number;
        avgTimeOnSite: number;
        bounceRate: number;
        popupImpressions: number;
        popupClicks: number;
        conversionRate: number;
    };
    chartData: Array<{ date: string; visitors: number; pageViews: number; conversions: number }>;
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    topPages: Array<{ path: string; title: string; count: number }>;
    topReferrers: Array<{ domain: string; count: number }>;
}

export default function AnalyticsPage() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [hasAnalytics, setHasAnalytics] = useState<boolean | null>(null);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    // Check auth and subscription
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Check subscription
                const { data: subscription } = await supabase
                    .from('user_subscriptions')
                    .select('has_analytics, plan_type')
                    .eq('user_id', user.id)
                    .single();

                const hasPremium = subscription?.has_analytics ||
                    subscription?.plan_type === 'pro' ||
                    subscription?.plan_type === 'growth';

                setHasAnalytics(hasPremium ?? false);
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    // Fetch analytics data
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`/api/analytics/data?user_id=${user.id}&period=${period}`);
                const result = await response.json();

                if (result.success) {
                    setData(result);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        if (user?.id && hasAnalytics) {
            fetchData();
        }
    }, [user?.id, period, hasAnalytics]);

    // Use real data or demo data
    const chartData = data?.chartData?.length ? data.chartData : DEMO_CHART_DATA;
    const deviceData = data?.deviceBreakdown || DEMO_DEVICE_DATA;
    const totals = data?.totals || {
        visitors: 11200,
        uniqueVisitors: 8450,
        pageViews: 28400,
        avgTimeOnSite: 142,
        bounceRate: 42.5,
        popupImpressions: 45230,
        popupClicks: 1890,
        conversionRate: 4.2
    };

    const totalDevices = deviceData.desktop + deviceData.mobile + deviceData.tablet;
    const devicePercentages = {
        desktop: totalDevices > 0 ? Math.round((deviceData.desktop / totalDevices) * 100) : 65,
        mobile: totalDevices > 0 ? Math.round((deviceData.mobile / totalDevices) * 100) : 30,
        tablet: totalDevices > 0 ? Math.round((deviceData.tablet / totalDevices) * 100) : 5
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#000212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
            </main>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <main className="min-h-screen bg-[#000212]">
                <Navbar />
                <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                    <Lock size={64} className="mx-auto text-slate-600 mb-6" />
                    <h1 className="text-3xl font-black text-white mb-4">Giriş Yapın</h1>
                    <p className="text-slate-400 mb-8">Analitik raporlarınızı görmek için hesabınıza giriş yapın.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-black font-bold rounded-xl hover:bg-brand-orange/90 transition-all">
                        Giriş Yap
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    // No analytics subscription - show upgrade prompt
    if (hasAnalytics === false) {
        const activateAnalytics = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch('/api/subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        addon_type: 'analytics'
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('🎉 Analytics paketi aktifleştirildi! Sayfa yenileniyor...');
                    window.location.reload();
                } else {
                    alert('Hata: ' + (result.error || 'Bilinmeyen hata'));
                }
            } catch (error) {
                alert('Bağlantı hatası. Lütfen tekrar deneyin.');
            }
        };

        return (
            <main className="min-h-screen bg-[#000212]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
                            <Sparkles className="text-indigo-400" size={16} />
                            <span className="text-indigo-400 text-sm font-bold">Premium Özellik</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Web Analitik Paketi
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Ziyaretçi davranışlarını derinlemesine analiz edin, dönüşüm oranlarınızı artırın.
                        </p>
                    </div>

                    {/* Preview with blur */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000212] via-transparent to-transparent z-10" />
                        <div className="filter blur-sm opacity-50 pointer-events-none">
                            {/* Demo KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4">
                                    <p className="text-slate-500 text-xs mb-1">Ziyaretçiler</p>
                                    <p className="text-2xl font-black text-white">11.2K</p>
                                </div>
                                <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4">
                                    <p className="text-slate-500 text-xs mb-1">Sayfa Görüntüleme</p>
                                    <p className="text-2xl font-black text-white">28.4K</p>
                                </div>
                                <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4">
                                    <p className="text-slate-500 text-xs mb-1">Ort. Süre</p>
                                    <p className="text-2xl font-black text-white">2:22</p>
                                </div>
                                <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4">
                                    <p className="text-slate-500 text-xs mb-1">Dönüşüm</p>
                                    <p className="text-2xl font-black text-white">4.2%</p>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade CTA */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 text-center max-w-md shadow-2xl">
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="text-indigo-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Premium Analytics</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Detaylı raporlar, funnel analizi, cihaz dağılımı ve daha fazlası.
                                </p>
                                <div className="flex items-baseline justify-center gap-1 mb-6">
                                    <span className="text-3xl font-black text-white">₺399</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                                <button
                                    onClick={activateAnalytics}
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all cursor-pointer mb-3"
                                >
                                    <Sparkles size={18} />
                                    Paketi Aktifleştir
                                </button>
                                <Link
                                    href="/pricing#analytics"
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2 text-slate-400 hover:text-white text-sm font-medium transition-all"
                                >
                                    Fiyatlandırmayı İncele →
                                </Link>
                                <p className="text-xs text-slate-500 mt-2">
                                    Tıklayarak 30 günlük deneme başlatın
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-6">
                            <Users className="text-brand-orange mb-4" size={24} />
                            <h4 className="text-white font-bold mb-2">Ziyaretçi Analizi</h4>
                            <p className="text-slate-400 text-sm">Benzersiz ve tekrar ziyaretçileri, oturum sürelerini takip edin.</p>
                        </div>
                        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-6">
                            <Smartphone className="text-emerald-400 mb-4" size={24} />
                            <h4 className="text-white font-bold mb-2">Cihaz Dağılımı</h4>
                            <p className="text-slate-400 text-sm">Mobil, desktop ve tablet kullanım oranlarını görün.</p>
                        </div>
                        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-6">
                            <Globe className="text-blue-400 mb-4" size={24} />
                            <h4 className="text-white font-bold mb-2">Trafik Kaynakları</h4>
                            <p className="text-slate-400 text-sm">Ziyaretçilerin nereden geldiğini ve UTM kampanyalarını izleyin.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Has analytics - show full dashboard
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">Analitik Raporu</h1>
                        <p className="text-slate-400">Site performansınızı ve ziyaretçi davranışlarını analiz edin.</p>
                    </div>
                    <div className="flex gap-2">
                        {(['7d', '30d', '90d'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${period === p
                                    ? 'bg-brand-orange text-black'
                                    : 'bg-[#1C1C1E] border border-white/10 text-white hover:bg-white/5'
                                    }`}
                            >
                                <Calendar size={16} />
                                {p === '7d' ? 'Son 7 Gün' : p === '30d' ? 'Son 30 Gün' : 'Son 90 Gün'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <KpiCard
                        icon={<Users size={20} />}
                        title="Toplam Ziyaretçi"
                        value={formatNumber(totals.visitors)}
                        change="+12.5%"
                        trend="up"
                    />
                    <KpiCard
                        icon={<Eye size={20} />}
                        title="Sayfa Görüntüleme"
                        value={formatNumber(totals.pageViews)}
                        change="+8.3%"
                        trend="up"
                    />
                    <KpiCard
                        icon={<Clock size={20} />}
                        title="Ort. Oturum Süresi"
                        value={formatTime(totals.avgTimeOnSite)}
                        change="+15s"
                        trend="up"
                    />
                    <KpiCard
                        icon={<MousePointer size={20} />}
                        title="Dönüşüm Oranı"
                        value={`${totals.conversionRate}%`}
                        change="+0.5%"
                        trend="up"
                    />
                </div>

                {/* Popup Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
                        <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Popup Gösterim</h4>
                        <p className="text-3xl font-black text-white">{formatNumber(totals.popupImpressions)}</p>
                    </div>
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
                        <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Popup Tıklama</h4>
                        <p className="text-3xl font-black text-white">{formatNumber(totals.popupClicks)}</p>
                    </div>
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
                        <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Bounce Rate</h4>
                        <p className="text-3xl font-black text-white">{totals.bounceRate}%</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Traffic Chart */}
                    <div className="lg:col-span-2 bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Trafik Trendi</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(value)} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="visitors" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" name="Ziyaretçi" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Cihaz Dağılımı</h3>
                        <div className="space-y-6">
                            <DeviceBar icon={<Monitor size={16} />} name="Masaüstü" value={devicePercentages.desktop} color="#F59E0B" />
                            <DeviceBar icon={<Smartphone size={16} />} name="Mobil" value={devicePercentages.mobile} color="#10B981" />
                            <DeviceBar icon={<Tablet size={16} />} name="Tablet" value={devicePercentages.tablet} color="#6366F1" />
                        </div>

                        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <span className="text-brand-orange font-bold">İpucu:</span> Mobil trafiğiniz %{devicePercentages.mobile} oranında. Mobil öncelikli popup tasarımları dönüşümü artırabilir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Pages & Referrers */}
                {(data?.topPages?.length || data?.topReferrers?.length) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top Pages */}
                        {data?.topPages && data.topPages.length > 0 && (
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">En Çok Ziyaret Edilen Sayfalar</h3>
                                <div className="space-y-3">
                                    {data.topPages.slice(0, 5).map((page, i) => (
                                        <div key={page.path} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-600 text-sm w-6">{i + 1}.</span>
                                                <span className="text-white text-sm truncate max-w-[200px]">{page.title || page.path}</span>
                                            </div>
                                            <span className="text-slate-400 text-sm">{page.count} görüntüleme</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Referrers */}
                        {data?.topReferrers && data.topReferrers.length > 0 && (
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Trafik Kaynakları</h3>
                                <div className="space-y-3">
                                    {data.topReferrers.slice(0, 5).map((ref, i) => (
                                        <div key={ref.domain} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-600 text-sm w-6">{i + 1}.</span>
                                                <span className="text-white text-sm">{ref.domain}</span>
                                            </div>
                                            <span className="text-slate-400 text-sm">{ref.count} ziyaret</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Embed Code Reminder */}
                <div className="mt-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">Analytics Kodunuz</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Aşağıdaki kodu sitenizin {'<head>'} etiketine ekleyin:
                            </p>
                            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                                {`<script src="https://Poplift-app.vercel.app/api/pixel?id=${user.id}&analytics=true" async></script>`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function KpiCard({ icon, title, value, change, trend }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down'
}) {
    return (
        <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                {icon}
                <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-white">{value}</span>
                <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </span>
            </div>
        </div>
    );
}

function DeviceBar({ icon, name, value, color }: { icon: React.ReactNode; name: string; value: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    {icon}
                    {name}
                </span>
                <span className="text-white font-bold">{value}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
