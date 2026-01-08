"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MoneyCalculator from '@/components/MoneyCalculator';
import {
    Wallet,
    TrendingUp,
    Shield,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Coffee,
    Target,
    PiggyBank,
    BarChart3,
    Zap,
    Lock,
    Users,
    Calendar,
    Award,
    Heart,
    Eye,
    Clock,
    ChevronDown,
    Calculator,
    LineChart,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import clsx from 'clsx';

// Local storage key for usage tracking
const USAGE_KEY = 'poplift_money_calc_usage';
const MAX_FREE_USAGE = 3;

interface UsageData {
    count: number;
    lastReset: string;
}

function getUsageData(): UsageData {
    if (typeof window === 'undefined') {
        return { count: 0, lastReset: new Date().toISOString() };
    }

    try {
        const stored = localStorage.getItem(USAGE_KEY);
        if (!stored) {
            return { count: 0, lastReset: new Date().toISOString() };
        }

        const data: UsageData = JSON.parse(stored);
        const lastReset = new Date(data.lastReset);
        const now = new Date();
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            return { count: 0, lastReset: now.toISOString() };
        }

        return data;
    } catch {
        return { count: 0, lastReset: new Date().toISOString() };
    }
}

function incrementUsage(): void {
    if (typeof window === 'undefined') return;
    const current = getUsageData();
    const newData: UsageData = { count: current.count + 1, lastReset: current.lastReset };
    localStorage.setItem(USAGE_KEY, JSON.stringify(newData));
}

export default function ParaYonetimiPage() {
    const [isPremium, setIsPremium] = useState(false);
    const [usageCount, setUsageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const response = await fetch(`/api/subscription?user_id=${user.id}`);
                    const data = await response.json();

                    if (data.success && data.subscription) {
                        const hasPremium = data.subscription.has_money_coach ||
                            data.subscription.plan_type === 'growth';
                        setIsPremium(hasPremium);
                    }
                }
            } catch (error) {
                console.error('Subscription check error:', error);
            }

            const usage = getUsageData();
            setUsageCount(usage.count);
            setIsLoading(false);
        };

        checkSubscription();
    }, []);

    const handleCalculate = () => {
        if (!isPremium) {
            incrementUsage();
            setUsageCount(prev => prev + 1);
        }
    };

    const handleUpgrade = () => {
        setShowPremiumModal(true);
    };

    const faqs = [
        {
            q: "Verilerim güvende mi?",
            a: "Evet, %100 güvende. Finansal verileriniz sunucumuza gönderilmez. Tüm hesaplamalar tarayıcınızda yapılır ve sadece sizin cihazınızda kalır. Biz sadece premium durumunuzu kontrol ederiz, rakamlarınızı asla görmeyiz."
        },
        {
            q: "Ücretsiz sürümde ne kadar kullanabilirim?",
            a: "Ayda 3 hesaplama ücretsiz yapabilirsiniz. Her ay başında kullanım hakkınız yenilenir. Basit grafik ve paranın biteceği tarihi görme tamamen ücretsiz."
        },
        {
            q: "Premium'u iptal edebilir miyim?",
            a: "Evet, istediğiniz zaman tek tıkla iptal edebilirsiniz. İlk 7 gün ücretsiz deneme süresidir, bu sürede ücret alınmaz. Taahhüt yok, sözleşme yok."
        },
        {
            q: "Neden ₺99.99 bu kadar ucuz?",
            a: "Amacımız para kazanmak değil, size para kazandırmak. Eğer bu araç ayda sadece bir gereksiz harcamayı önlemenize yardımcı olursa, kendini çoktan amorti etmiş olur."
        }
    ];

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            {/* ======================== HERO SECTION ======================== */}
            <section className="relative py-20 md:py-28 overflow-hidden" id="calculator">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="text-center mb-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-6">
                            <Wallet size={16} />
                            Ücretsiz Para Yönetimi Aracı
                        </div>

                        {/* HERO BAŞLIK */}
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Paran Senden Önce<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-brand-orange">
                                Bitmeyecek
                            </span>
                        </h1>

                        {/* ALT BAŞLIK */}
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
                            30 saniyede finansal durumunu gör. <strong className="text-white">Suçlamadan, yargılamadan.</strong>
                        </p>

                        {/* 3 FAYDA MADDESİ */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
                                <Eye size={16} className="text-emerald-400" />
                                <span className="text-slate-300">Net sonuç, büyük puntolarla</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
                                <Shield size={16} className="text-blue-400" />
                                <span className="text-slate-300">Verileriniz güvende</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
                                <Heart size={16} className="text-pink-400" />
                                <span className="text-slate-300">Destekleyici dil</span>
                            </div>
                        </div>
                    </div>

                    {/* ======================== CALCULATOR CARD ======================== */}
                    <div className="max-w-lg mx-auto">
                        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                            {isLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <MoneyCalculator
                                    isPremium={isPremium}
                                    usageCount={usageCount}
                                    maxFreeUsage={MAX_FREE_USAGE}
                                    onUpgrade={handleUpgrade}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================== SOSYAL PROOF ======================== */}
            <section className="py-12 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-8 flex-wrap text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span><strong className="text-white">2,847</strong> kullanıcı bu ay hesapladı</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award size={16} />
                                <span><strong className="text-white">4.8/5</strong> kullanıcı puanı</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} />
                                <span>Ortalama <strong className="text-emerald-400">₺847</strong> tasarruf</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================== ÖZELLİKLER ======================== */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <p className="text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Özellikler</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Neden Para Koçu?
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Karmaşık tablolara gerek yok. Bu site senin paranı senden daha çok düşünüyor.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Target className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Net Sonuç</h3>
                            <p className="text-slate-400 text-sm">
                                Paranın biteceği tarihi büyük puntolarla gör. Belirsizlik değil, netlik.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">"Bu Hızla vs Kısarsan"</h3>
                            <p className="text-slate-400 text-sm">
                                İki senaryo yan yana. Tasarrufun ne kadar fark yarattığını gör.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-brand-orange/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Shield className="text-brand-orange" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">%100 Gizlilik</h3>
                            <p className="text-slate-400 text-sm">
                                Finansal verilerin sunucuya gönderilmez. Tarayıcında hesaplanır, orada kalır.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Maaş Günü Takibi</h3>
                            <p className="text-slate-400 text-sm">
                                Maaş günününü gir, "gelire kadar dayanır mıyım?" sorusunun cevabını al.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-pink-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Heart className="text-pink-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Destekleyici Dil</h3>
                            <p className="text-slate-400 text-sm">
                                Seni yargılamıyoruz, suçlamıyoruz. "Kontrol sende" felsefesiyle destek oluyoruz.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="text-amber-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Aile Modu</h3>
                            <p className="text-slate-400 text-sm">
                                2-3-4 kişilik bütçe hesaplama. Kişi başı günlük bütçeni gör.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================== KARŞILAŞTIRMA BÖLÜMÜ ======================== */}
            <section className="py-20 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Karşılaştır</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Fark Bu Kadar Net
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Bu Hızla */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="text-red-400" size={32} />
                            </div>
                            <p className="text-red-400 text-sm font-bold uppercase mb-2">Bu Hızla Gidersen</p>
                            <p className="text-4xl font-black text-red-400 mb-2">18 Gün</p>
                            <p className="text-slate-500 text-sm">Paran 23 Ocak'ta bitiyor</p>
                        </div>

                        {/* Kısarsan */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <PiggyBank className="text-emerald-400" size={32} />
                            </div>
                            <p className="text-emerald-400 text-sm font-bold uppercase mb-2">Günde ₺50 Kısarsan</p>
                            <p className="text-4xl font-black text-emerald-400 mb-2">27 Gün</p>
                            <p className="text-slate-500 text-sm">+9 gün kazanırsın! 1 Şubat'a kadar</p>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        *Örnek hesaplama. Gerçek sonuçlar senin verilerine göre değişir.
                    </p>
                </div>
            </section>

            {/* ======================== FİYATLANDIRMA ======================== */}
            <section className="py-20 border-t border-white/5" id="pricing">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <p className="text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Fiyatlandırma</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Basit ve Şeffaf
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Bir kahve parası ile paranı kontrol altına al. Taahhüt yok, istediğin zaman iptal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Ücretsiz */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/10">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">Ücretsiz</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">₺0</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-2">Başlamak için mükemmel</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Paranın biteceği tarihi gör
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Basit bakiye grafiği
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Gider kategorileri
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Ayda 3 hesaplama
                                </li>
                                <li className="flex items-center gap-3 text-slate-500">
                                    <Lock size={18} className="text-slate-600 flex-shrink-0" />
                                    Tasarruf simülasyonları
                                </li>
                                <li className="flex items-center gap-3 text-slate-500">
                                    <Lock size={18} className="text-slate-600 flex-shrink-0" />
                                    Haftalık rapor
                                </li>
                            </ul>

                            <a
                                href="#calculator"
                                className="block w-full py-3 text-center bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                Ücretsiz Dene
                            </a>
                        </div>

                        {/* Premium */}
                        <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 rounded-2xl p-8 border-2 border-purple-500/30 relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full">
                                ÖNERİLEN
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles size={20} className="text-purple-400" />
                                    Para Koçu Premium
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">₺99.99</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                                    <Coffee size={14} />
                                    Bir kahve parası
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    <strong>Sınırsız</strong> hesaplama
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    "Bu hızla vs kısarsan" karşılaştırması
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Tasarruf simülasyonları
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Kişisel tasarruf önerileri
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Haftalık özet rapor
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    Aile modu (2-4 kişi)
                                </li>
                            </ul>

                            <Link
                                href="/checkout?product=money_coach"
                                className="block w-full py-3 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-purple-500/20"
                            >
                                Şimdi Başla
                            </Link>

                            <p className="text-center text-xs text-slate-500 mt-4">
                                7 gün ücretsiz dene · İstediğin zaman iptal
                            </p>
                        </div>
                    </div>

                    {/* Güven notu */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            💡 <strong className="text-white">Neden bu kadar ucuz?</strong> Amacımız para kazanmak değil, size para kazandırmak.
                        </p>
                    </div>
                </div>
            </section>

            {/* ======================== SSS ======================== */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                            Sıkça Sorulan Sorular
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-[#1C1C1E] rounded-xl border border-white/5 overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="font-bold text-white">{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={clsx(
                                            "text-slate-400 transition-transform",
                                            expandedFaq === idx && "rotate-180"
                                        )}
                                    />
                                </button>
                                {expandedFaq === idx && (
                                    <div className="px-5 pb-5 pt-0">
                                        <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======================== CTA ======================== */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl p-10 border border-purple-500/20">
                        <h2 className="text-3xl font-black text-white mb-4">
                            Paranı Kontrol Altına Al
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            30 saniyede finansal durumunu gör. Ücretsiz, kayıt gerektirmiyor.
                        </p>
                        <a
                            href="#calculator"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Calculator size={20} />
                            Hesaplamaya Başla
                        </a>
                    </div>
                </div>
            </section>

            {/* ======================== PREMIUM MODAL ======================== */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1C1C1E] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
                        <button
                            onClick={() => setShowPremiumModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <Zap size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">
                                Daha İyi Planlamak İster Misin?
                            </h3>
                            <p className="text-slate-400">
                                Premium ile paranın tam kontrolü sende.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-400">Para Koçu Premium</span>
                                <div>
                                    <span className="text-2xl font-black text-white">₺99.99</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Sınırsız hesaplama
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Tasarruf simülasyonları
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Kişisel öneriler
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Haftalık rapor
                                </li>
                            </ul>
                        </div>

                        <Link
                            href="/checkout?product=money_coach"
                            className="block w-full py-4 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 mb-3"
                        >
                            Şimdi Başla - İlk 7 Gün Ücretsiz
                        </Link>

                        <button
                            onClick={() => setShowPremiumModal(false)}
                            className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm"
                        >
                            Şimdilik gerek yok
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
