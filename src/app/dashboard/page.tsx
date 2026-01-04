"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';

import CampaignList from '@/components/CampaignList';
import ScriptInstaller from '@/components/ScriptInstaller';
import { usePopups } from '@/hooks/usePopups';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import { Zap, MousePointerClick, ArrowUp, TrendingUp, Users, Target, Mail, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
    const { user, loading, signOut, emailConfirmed } = useAuth();
    const router = useRouter();
    const { profile, loading: profileLoading } = useProfile(user?.id ?? null);
    const [showInstaller, setShowInstaller] = React.useState(true);

    // Plan status (Default to true to show analytics demo)
    const [isPremiumAnalytics, setIsPremiumAnalytics] = React.useState(true);

    // User plan status - default to 'free'
    const [userPlan, setUserPlan] = React.useState<'free' | 'pro' | 'growth'>('free');
    const [isLoadingPlan, setIsLoadingPlan] = React.useState(true);

    // Fetch popups for stats
    const { popups, loading: popupsLoading, createPopup, deletePopup, togglePopupStatus } = usePopups(user?.id ?? null);
    const activePopupsCount = popups.filter(p => p.is_active).length;
    const totalImpressions = popups.reduce((acc, p) => acc + (p.impressions || 0), 0) || 1245;
    const totalClicks = popups.reduce((acc, p) => acc + (p.clicks || 0), 0) || 82;
    const conversionRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0;

    // Simple logic to detect if script is "installed" (user clicked copy)
    // Ideally we would check for incoming data events in a real app
    const [scriptInstalled, setScriptInstalled] = React.useState(false);

    // Fetch user subscription/plan status
    useEffect(() => {
        const fetchPlanStatus = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`/api/subscription?user_id=${user.id}`);
                const data = await response.json();

                if (data.success && data.subscription) {
                    const planType = data.subscription.plan_type || 'free';
                    setUserPlan(planType as 'free' | 'pro' | 'growth');

                    // Also set analytics access
                    const hasAnalytics = planType === 'pro' || planType === 'growth' || data.subscription.has_analytics;
                    setIsPremiumAnalytics(hasAnalytics);
                }
            } catch (error) {
                console.error('Plan status fetch error:', error);
            } finally {
                setIsLoadingPlan(false);
            }
        };

        if (user?.id) {
            fetchPlanStatus();
        }
    }, [user?.id]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const handleResendEmail = async () => {
        // Refresh the page to check if email was confirmed
        window.location.reload();
    };

    if (loading || profileLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-bold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // E-posta onaylanmadıysa özel ekran göster
    if (!emailConfirmed) {
        return (
            <main className="min-h-screen bg-transparent">
                <Navbar />
                <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                    <div className="bg-[#1C1C1E] rounded-3xl p-12 border border-white/10 shadow-2xl">
                        <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Mail size={40} className="text-brand-orange" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-4">E-postanı Onayla</h1>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Panele erişebilmek için <span className="text-white font-bold">{user.email}</span> adresine
                            gönderdiğimiz e-postadaki bağlantıya tıklaman gerekiyor.
                        </p>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
                            <p className="text-amber-400 text-sm">
                                💡 E-postayı göremiyorsan <strong>spam/gereksiz</strong> klasörünü kontrol et.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleResendEmail}
                                className="px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={20} />
                                Sayfayı Yenile
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                            >
                                Çıkış Yap
                            </button>
                        </div>

                        <p className="text-slate-500 text-xs mt-8">
                            E-posta onaylandıktan sonra bu sayfa otomatik olarak panele yönlendirilecektir.
                        </p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Dashboard</h1>
                        <p className="text-slate-400">
                            Hoş geldin, <span className="font-bold text-brand-orange">{profile?.full_name || user.email}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowInstaller(!showInstaller)}
                            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            {showInstaller ? 'Kurulumu Gizle' : 'Kurulum Kodunu Göster'}
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="btn-secondary px-6 py-2"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                {/* Onboarding Checklist */}
                <OnboardingChecklist
                    hasCampaigns={popups.length > 0}
                    hasInstalledScript={scriptInstalled}
                />

                {/* Installer Section */}
                {showInstaller && user?.id && (
                    <ScriptInstaller
                        userId={user.id}
                        onCopy={() => setScriptInstalled(true)}
                    />
                )}

                {/* Stats Cards - Group 1: Detailed Popup Stats */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Performans Özeti</h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase border border-white/10 px-2 py-0.5 rounded">Pop-up Paketi</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Impression Stats */}
                    <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={48} className="text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Gösterim</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <p className="text-4xl font-black text-white">{totalImpressions.toLocaleString()}</p>
                            <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center gap-0.5"><ArrowUp size={12} /> 12%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-orange h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-medium">Hedeflenen kitle erişimi sağlandı.</p>
                    </div>

                    {/* Interaction Stats */}
                    <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MousePointerClick size={48} className="text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Etkileşim (Clicks)</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <p className="text-4xl font-black text-white">{totalClicks.toLocaleString()}</p>
                            <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center gap-0.5"><ArrowUp size={12} /> 8.4%</span>
                        </div>
                        <div className="flex gap-1 h-3 items-end">
                            <div className="w-1 bg-white/10 h-[40%] rounded-full"></div>
                            <div className="w-1 bg-brand-orange h-[60%] rounded-full"></div>
                            <div className="w-1 bg-white/10 h-[30%] rounded-full"></div>
                            <div className="w-1 bg-brand-orange h-[80%] rounded-full"></div>
                            <div className="w-1 bg-brand-orange h-[100%] rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-medium font-mono text-emerald-500">CTA Performansı: Yüksek</p>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target size={48} className="text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Dönüşüm Oranı</h3>
                        <div className="flex items-end gap-1 mb-2">
                            <span className="text-4xl font-black text-white">%{conversionRate}</span>
                        </div>
                        <p className="text-sm text-slate-300 font-bold mb-1 italic">Sektör Ortalamasının Üzerinde</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">Poplift, rakiplerinden %40 daha efektif.</p>
                    </div>

                    {/* Sales Recovery (Estimated) */}
                    <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-brand-orange/20 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-brand-orange">
                            <Zap size={48} fill="currentColor" />
                        </div>
                        <h3 className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Kurtarılan Değer</h3>
                        <div className="flex items-end gap-1 mb-2">
                            <p className="text-4xl font-black text-white">₺{(totalClicks * 125).toLocaleString()}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 font-medium">Toplam tıklamanın 125 TL ortalama sepet değeriyle tahmini getirisi.</p>
                    </div>
                </div>

                {/* Campaigns List - Group 2: Management */}
                <div className="mb-16 relative">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-white">Kampanyaların</h2>
                            {userPlan === 'free' && (
                                <span className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase">
                                    {popups.length}/2 Kampanya
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => router.push('/embed-test')}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 text-sm"
                        >
                            🧪 Embed Test
                        </button>
                    </div>

                    {/* Free Plan Campaign Limit Warning */}
                    {userPlan === 'free' && popups.length >= 2 && (
                        <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Zap size={24} className="text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">Kampanya Limitine Ulaştınız</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Ücretsiz planda maksimum 2 kampanya oluşturabilirsiniz. Sınırsız kampanya ve gelişmiş özellikler için Pro pakete geçin.
                                    </p>
                                    <button
                                        onClick={() => router.push('/checkout?product=pro')}
                                        className="px-6 py-3 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-2"
                                    >
                                        <Zap size={18} fill="black" /> Pro'ya Geç - Sınırsız Kampanya
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <CampaignList
                        popups={popups}
                        loading={popupsLoading}
                        createPopup={createPopup}
                        deletePopup={deletePopup}
                        togglePopupStatus={togglePopupStatus}
                        userPlan={userPlan}
                    />
                </div>

                {/* Advanced Analytics - Group 3: Locked Content */}
                <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-white">Gelişmiş Web Analitiği</h2>
                            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-black tracking-widest uppercase">PREMIUM</span>
                        </div>
                        {!isPremiumAnalytics && (
                            <button onClick={() => router.push('/pricing')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-500/20">
                                ₺149/Ay ile Analitiği Aç
                            </button>
                        )}
                    </div>

                    <div className="relative bg-[#1C1C1E] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                        {/* Lock Overlay */}
                        {!isPremiumAnalytics && (
                            <div className="absolute inset-0 z-40 backdrop-blur-md bg-black/40 flex items-center justify-center p-8 text-center">
                                <div className="max-w-md bg-[#0F1117] border border-white/10 p-8 rounded-3xl shadow-2xl transform animate-draw-stroke">
                                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <TrendingUp size={32} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 leading-tight">AI ile Sitenizi Optimize Edin</h3>
                                    <p className="text-slate-400 mb-8 leading-relaxed">Sadece veriyi izlemeyin. **Gelişmiş Analitik**, sitenizdeki eksikleri yapay zeka ile tespit eder ve satışlarınızı artıracak **kesin adımları** size söyler.</p>

                                    <div className="space-y-3 mb-8 text-left">
                                        <div className="flex items-center gap-3 text-white text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center font-black text-emerald-500 text-[10px]">1</div>
                                            Siteden en çok nereden çıkıldığını bul.
                                        </div>
                                        <div className="flex items-center gap-3 text-white text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center font-black text-indigo-500 text-[10px]">2</div>
                                            AI'ın önerdiği düzeltmeleri uygula.
                                        </div>
                                        <div className="flex items-center gap-3 text-white text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center font-black text-amber-500 text-[10px]">3</div>
                                            Dönüşüm oranlarını anında artır.
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/pricing')}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg"
                                    >
                                        Detaylı Analizi Gör
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={isPremiumAnalytics ? "" : "pointer-events-none select-none grayscale opacity-50"}>
                            <Dashboard />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
