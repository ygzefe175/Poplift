"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2, CreditCard, Zap, BarChart3, Sparkles, Palette, Users, XCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subscription {
    plan_type: 'free' | 'pro' | 'growth';
    has_analytics: boolean;
    has_custom_design: boolean;
    has_ai_assistant: boolean;
    has_onboarding: boolean;
    analytics_expires_at?: string;
    plan_expires_at?: string;
    created_at?: string;
}

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { profile, updateProfile, loading: profileLoading } = useProfile(user?.id ?? null);

    // Form States
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Status States
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Subscription States
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingItem, setCancellingItem] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (profile) {
            setFullName(profile.full_name || '');
        }
    }, [user, authLoading, profile, router]);

    // Fetch subscription data
    useEffect(() => {
        const fetchSubscription = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`/api/subscription?user_id=${user.id}`);
                const data = await response.json();

                if (data.success && data.subscription) {
                    setSubscription(data.subscription);
                }
            } catch (error) {
                console.error('Error fetching subscription:', error);
            } finally {
                setLoadingSubscription(false);
            }
        };

        if (user?.id) {
            fetchSubscription();
        }
    }, [user?.id]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { error: profileError } = await updateProfile({ full_name: fullName });
            if (profileError) throw profileError;

            if (password) {
                if (password !== confirmPassword) {
                    throw new Error("Şifreler uyuşmuyor.");
                }
                const { error: passwordError } = await supabase.auth.updateUser({ password: password });
                if (passwordError) throw passwordError;
            }

            setMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi.' });
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelSubscription = async (itemType: string) => {
        setCancelLoading(true);

        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    cancel_type: itemType // 'plan', 'analytics', 'ai_assistant', etc.
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `${itemType === 'plan' ? 'Aboneliğiniz' : 'Eklentiniz'} iptal edildi. Dönem sonuna kadar kullanmaya devam edebilirsiniz.` });

                // Refresh subscription data
                const subResponse = await fetch(`/api/subscription?user_id=${user?.id}`);
                const subData = await subResponse.json();
                if (subData.success) {
                    setSubscription(subData.subscription);
                }
            } else {
                throw new Error(data.error || 'İptal işlemi başarısız');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setCancelLoading(false);
            setShowCancelModal(false);
            setCancellingItem(null);
        }
    };

    const openCancelModal = (itemType: string) => {
        setCancellingItem(itemType);
        setShowCancelModal(true);
    };

    const getPlanDisplayName = (plan: string) => {
        switch (plan) {
            case 'pro': return 'Pro Paket';
            case 'growth': return 'Growth Paket';
            default: return 'Ücretsiz Plan';
        }
    };

    const getPlanPrice = (plan: string) => {
        switch (plan) {
            case 'pro': return '₺399/ay';
            case 'growth': return '₺699/ay';
            default: return 'Ücretsiz';
        }
    };

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-bold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Hesap Ayarları</h1>
                    <p className="text-slate-400">Profil bilgilerinizi ve aboneliklerinizi yönetin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / Navigation */}
                    <div className="lg:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'profile'
                                    ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                                    : 'hover:bg-white/5 text-slate-400'
                                }`}
                        >
                            <User size={18} /> Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('subscription')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'subscription'
                                    ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                                    : 'hover:bg-white/5 text-slate-400'
                                }`}
                        >
                            <CreditCard size={18} /> Abonelik
                        </button>
                        <button disabled className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 font-medium flex items-center gap-3 opacity-50 cursor-not-allowed">
                            <Lock size={18} /> Güvenlik (Yakında)
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-8 shadow-xl">

                                {message && (
                                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                                        <p className="text-sm font-bold">{message.text}</p>
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    {/* Profile Picture Section */}
                                    <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                        <div className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-brand-orange/20">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Profil Fotoğrafı</h3>
                                            <p className="text-slate-500 text-sm mb-3">Şu an için varsayılan avatar kullanılıyor.</p>
                                            <button type="button" disabled className="text-brand-orange text-xs font-bold uppercase tracking-wider opacity-50 cursor-not-allowed">Değiştir (Yakında)</button>
                                        </div>
                                    </div>

                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                            <User size={20} className="text-brand-orange" /> Kişisel Bilgiler
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="Adınız Soyadınız"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-posta</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        value={user.email}
                                                        disabled
                                                        className="w-full bg-[#0F1117]/50 border border-white/5 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                                                    />
                                                    <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Change */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                            <Lock size={20} className="text-brand-orange" /> Şifre Değiştir
                                        </h3>
                                        <p className="text-sm text-slate-500">Sadece şifrenizi değiştirmek istiyorsanız doldurun.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yeni Şifre</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yeni Şifre (Tekrar)</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 rounded-xl bg-brand-orange text-black font-black hover:brightness-110 transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? 'Kaydediliyor...' : <><Save size={18} fill="black" /> Değişiklikleri Kaydet</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Subscription Tab */}
                        {activeTab === 'subscription' && (
                            <div className="space-y-6">

                                {message && (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                                        <p className="text-sm font-bold">{message.text}</p>
                                    </div>
                                )}

                                {/* Current Plan */}
                                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                                            <CreditCard size={24} className="text-brand-orange" />
                                            Mevcut Planınız
                                        </h3>
                                        {subscription?.plan_type !== 'free' && (
                                            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                                                AKTİF
                                            </span>
                                        )}
                                    </div>

                                    {loadingSubscription ? (
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-8 bg-white/5 rounded w-1/3"></div>
                                            <div className="h-4 bg-white/5 rounded w-1/2"></div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Zap size={24} className={subscription?.plan_type === 'free' ? 'text-slate-500' : 'text-brand-orange'} />
                                                    <span className="text-2xl font-black text-white">
                                                        {getPlanDisplayName(subscription?.plan_type || 'free')}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400">
                                                    {getPlanPrice(subscription?.plan_type || 'free')}
                                                    {subscription?.plan_expires_at && (
                                                        <span className="text-xs text-slate-500 ml-2">
                                                            • Yenileme: {new Date(subscription.plan_expires_at).toLocaleDateString('tr-TR')}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                {subscription?.plan_type === 'free' ? (
                                                    <Link
                                                        href="/pricing"
                                                        className="px-6 py-3 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-orange/20"
                                                    >
                                                        Yükselt
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => openCancelModal('plan')}
                                                        className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all text-sm"
                                                    >
                                                        İptal Et
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Add-ons */}
                                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 shadow-xl">
                                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                                        <Sparkles size={24} className="text-yellow-400" />
                                        Eklentiler
                                    </h3>

                                    <div className="space-y-4">
                                        {/* AI Assistant */}
                                        <div className={`p-4 rounded-xl border ${subscription?.has_ai_assistant ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subscription?.has_ai_assistant ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
                                                        <Sparkles size={20} className={subscription?.has_ai_assistant ? 'text-yellow-400' : 'text-slate-500'} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">AI Metin Asistanı</p>
                                                        <p className="text-slate-500 text-sm">₺99/ay</p>
                                                    </div>
                                                </div>
                                                {subscription?.has_ai_assistant ? (
                                                    <button
                                                        onClick={() => openCancelModal('ai_assistant')}
                                                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-all text-xs"
                                                    >
                                                        İptal Et
                                                    </button>
                                                ) : (
                                                    <Link href="/checkout?product=ai" className="px-3 py-1.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-xs">
                                                        Ekle
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Analytics */}
                                        <div className={`p-4 rounded-xl border ${subscription?.has_analytics ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subscription?.has_analytics ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                                                        <BarChart3 size={20} className={subscription?.has_analytics ? 'text-emerald-400' : 'text-slate-500'} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">Premium Analytics</p>
                                                        <p className="text-slate-500 text-sm">₺149/ay</p>
                                                    </div>
                                                </div>
                                                {subscription?.has_analytics ? (
                                                    <button
                                                        onClick={() => openCancelModal('analytics')}
                                                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-all text-xs"
                                                    >
                                                        İptal Et
                                                    </button>
                                                ) : (
                                                    <Link href="/checkout?product=analytics" className="px-3 py-1.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-xs">
                                                        Ekle
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Custom Design */}
                                        <div className={`p-4 rounded-xl border ${subscription?.has_custom_design ? 'bg-purple-500/5 border-purple-500/20' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subscription?.has_custom_design ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                                                        <Palette size={20} className={subscription?.has_custom_design ? 'text-purple-400' : 'text-slate-500'} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">Özel Tasarım Paketi</p>
                                                        <p className="text-slate-500 text-sm">₺499 tek seferlik</p>
                                                    </div>
                                                </div>
                                                {subscription?.has_custom_design ? (
                                                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-xs">
                                                        ✓ Satın Alındı
                                                    </span>
                                                ) : (
                                                    <Link href="/checkout?product=design" className="px-3 py-1.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-xs">
                                                        Satın Al
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Onboarding */}
                                        <div className={`p-4 rounded-xl border ${subscription?.has_onboarding ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subscription?.has_onboarding ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                                                        <Users size={20} className={subscription?.has_onboarding ? 'text-blue-400' : 'text-slate-500'} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">Özel Onboarding</p>
                                                        <p className="text-slate-500 text-sm">₺299 tek seferlik</p>
                                                    </div>
                                                </div>
                                                {subscription?.has_onboarding ? (
                                                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-xs">
                                                        ✓ Satın Alındı
                                                    </span>
                                                ) : (
                                                    <Link href="/checkout?product=onboarding" className="px-3 py-1.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-xs">
                                                        Satın Al
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Help */}
                                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6">
                                    <p className="text-slate-400 text-sm">
                                        Abonelik veya ödeme ile ilgili sorularınız için <a href="mailto:destek@poplift.com" className="text-brand-orange hover:underline">destek@poplift.com</a> adresine yazabilirsiniz.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1C1C1E] rounded-2xl border border-white/10 p-8 max-w-md text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">İptal Onayı</h3>
                        <p className="text-slate-400 mb-6">
                            {cancellingItem === 'plan'
                                ? 'Aboneliğinizi iptal etmek istediğinize emin misiniz? Dönem sonuna kadar tüm özelliklerden yararlanmaya devam edeceksiniz.'
                                : 'Bu eklentiyi iptal etmek istediğinize emin misiniz?'
                            }
                        </p>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
                            <p className="text-amber-400 text-sm">
                                ⚠️ İptal sonrası:
                            </p>
                            <ul className="text-slate-400 text-sm mt-2 space-y-1">
                                <li>• Mevcut dönem sonunda erişiminiz sona erecek</li>
                                <li>• Verileriniz 30 gün boyunca saklanacak</li>
                                <li>• İstediğiniz zaman tekrar abone olabilirsiniz</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={() => handleCancelSubscription(cancellingItem || '')}
                                disabled={cancelLoading}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {cancelLoading ? (
                                    'İptal Ediliyor...'
                                ) : (
                                    <>
                                        <XCircle size={18} />
                                        İptal Et
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
