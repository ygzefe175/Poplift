"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, Sparkles, Target, Zap, BarChart3 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Product configurations
const PRODUCTS = {
    ai: {
        name: 'AI Metin Asistanı',
        description: 'Magic Fill - Sınırsız AI metin üretimi',
        price: 99,
        icon: Sparkles,
        color: 'from-indigo-500 to-purple-600',
        addonType: 'ai_assistant',
        features: [
            'Sınırsız AI metin üretimi',
            'Kampanya başlıkları ve açıklamaları',
            'Dönüşüm odaklı CTA önerileri',
            'Türkçe optimizeli içerikler'
        ]
    },
    pro: {
        name: 'Pro Paket',
        description: 'Tüm özellikler dahil',
        price: 399,
        icon: Zap,
        color: 'from-brand-orange to-amber-500',
        planType: 'pro',
        features: [
            'Sınırsız pop-up kampanyası',
            'Çarkıfelek (Gamification)',
            'Magic Fill (AI) dahil',
            'Gelişmiş hedefleme',
            'Öncelikli destek'
        ]
    },
    growth: {
        name: 'Growth Paket',
        description: 'Kurumsal çözümler',
        price: 799,
        icon: BarChart3,
        color: 'from-emerald-500 to-teal-500',
        planType: 'growth',
        features: [
            'Pro paketteki tüm özellikler',
            'Gelişmiş ROI ve kâr analizi',
            'A/B Test desteği',
            'API erişimi',
            'Özel entegrasyon desteği'
        ]
    },
    analytics: {
        name: 'Web Analitik Paketi',
        description: 'Detaylı ziyaretçi analitiği',
        price: 149,
        icon: BarChart3,
        color: 'from-cyan-500 to-blue-500',
        addonType: 'analytics',
        features: [
            'Gerçek zamanlı ziyaretçi takibi',
            'Sayfa görüntüleme analitiği',
            'Cihaz ve tarayıcı dağılımı',
            'Dönüşüm hunisi analizi'
        ]
    },
    money_coach: {
        name: 'Para Koçu Premium',
        description: 'Paranı kontrol altına al',
        price: 99.99,
        icon: BarChart3,
        color: 'from-purple-500 to-indigo-600',
        addonType: 'money_coach',
        features: [
            'Sınırsız finansal hesaplama',
            'Tasarruf simülasyonları',
            'Kişisel tasarruf önerileri',
            'Geçmiş hesaplama karşılaştırması',
            'Haftalık özet e-posta'
        ]
    }
};

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // Get product from URL params
    const productKey = searchParams.get('product') || searchParams.get('addon') || searchParams.get('plan') || 'pro';
    const product = PRODUCTS[productKey as keyof typeof PRODUCTS] || PRODUCTS.pro;
    const ProductIcon = product.icon;

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                } else {
                    // Not logged in, redirect to register with return URL
                    router.push(`/register?redirect=/checkout?product=${productKey}`);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/login');
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [productKey, router]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            // Get session token for authenticated API requests
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                router.push('/login');
                return;
            }

            // ⚠️ IMPORTANT: This is a DEMO payment flow!
            // In production, integrate a real payment provider like:
            // - Stripe (stripe.com)
            // - iyzico (iyzico.com) for Turkey
            // - PayTR (paytr.com) for Turkey
            // 
            // The flow should be:
            // 1. Create payment intent on server
            // 2. Process payment with provider
            // 3. Verify payment via webhook
            // 4. Only then activate subscription
            //
            // Current demo: simulates successful payment for testing
            console.warn('[DEMO MODE] Simulating payment - No real payment processed!');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const authHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            };

            // Update subscription based on product type
            if ('addonType' in product && product.addonType) {
                // It's an addon
                const response = await fetch('/api/subscription', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        user_id: userId,
                        addon_type: product.addonType
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Subscription update failed');
                }
            } else if ('planType' in product && product.planType) {
                // It's a plan upgrade
                const response = await fetch('/api/subscription/upgrade', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        user_id: userId,
                        plan_type: product.planType
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Plan update error:', errorData);
                    throw new Error(errorData.error || 'Plan update failed');
                }
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard?payment=success');
            }, 2000);
        } catch (error) {
            console.error('Payment error:', error);
            alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    // Simple formatting functions
    const formatCardNumber = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    };

    if (isCheckingAuth) {
        return (
            <main className="min-h-screen bg-[#000212] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Yükleniyor...</p>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="min-h-screen bg-[#000212] flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
                        <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Ödeme Başarılı!</h1>
                    <p className="text-slate-400">{product.name} aktif edildi. Yönlendiriliyorsunuz...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#000212] font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left: Order Summary */}
                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-white mb-2">Ödemeyi Tamamla</h1>
                            <p className="text-slate-400">Güvenli ödeme altyapısı ile aboneliğinizi başlatın.</p>
                        </div>

                        <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 mb-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Sipariş Özeti</h3>

                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                                        <ProductIcon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{product.name}</h4>
                                        <p className="text-sm text-slate-400">{product.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white">₺{product.price}</div>
                                    <div className="text-xs text-slate-500">/ay</div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="py-4 border-b border-white/5">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Dahil Özellikler</p>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <span className="text-slate-400 font-medium">Toplam Tutar</span>
                                <span className="text-2xl font-black text-brand-orange">₺{product.price}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <ShieldCheck size={24} className="text-emerald-500 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-emerald-400 text-sm">30 Gün Para İade Garantisi</h4>
                                <p className="text-xs text-emerald-500/80 mt-1">Hizmetimizden memnun kalmazsanız, ilk 30 gün içinde sorgusuz sualsiz iade talep edebilirsiniz.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Form */}
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CreditCard size={20} className="text-brand-orange" /> Kart Bilgileri
                            </h2>
                            <div className="flex gap-2 opacity-50">
                                <div className="w-8 h-5 bg-white rounded"></div>
                                <div className="w-8 h-5 bg-white rounded"></div>
                                <div className="w-8 h-5 bg-white rounded"></div>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kart Sahibinin Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="Ad Soyad"
                                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kart Numarası</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all font-mono"
                                    />
                                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Son Kullanma (AA/YY)</label>
                                    <input
                                        type="text"
                                        required
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="AA/YY"
                                        maxLength={5}
                                        className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all font-mono text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CVC / CVV</label>
                                    <input
                                        type="text"
                                        required
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="123"
                                        maxLength={3}
                                        className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all font-mono text-center"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl bg-gradient-to-r ${product.color} text-white font-black text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            İşleniyor...
                                        </>
                                    ) : (
                                        <>Ödemeyi Yap (₺{product.price}) <ShieldCheck size={20} /></>
                                    )}
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                                    <Lock size={10} />
                                    256-bit SSL ile güvenli ödeme
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#000212] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Yükleniyor...</p>
                </div>
            </main>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
