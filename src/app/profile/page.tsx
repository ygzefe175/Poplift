"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import {
    User, Mail, Phone, Building2, Globe,
    Save, Loader2, CheckCircle2, AlertCircle,
    Camera, Crown, Zap, Calendar, Shield,
    Bell, Moon, Key, Trash2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile(user?.id ?? null);
    const router = useRouter();

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [website, setWebsite] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Subscription state
    const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'growth'>('free');
    const [planLoading, setPlanLoading] = useState(true);

    // Preferences
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    // Load profile data
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setPhone(profile.phone || '');
            setCompany(profile.company || '');
            setWebsite(profile.website || '');
        }
    }, [profile]);

    // Load subscription
    useEffect(() => {
        const fetchPlan = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`/api/subscription?user_id=${user.id}`);
                const data = await response.json();
                if (data.success && data.subscription) {
                    setUserPlan(data.subscription.plan_type || 'free');
                }
            } catch (error) {
                console.error('Plan fetch error:', error);
            } finally {
                setPlanLoading(false);
            }
        };
        if (user?.id) fetchPlan();
    }, [user?.id]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleSave = async () => {
        if (!user?.id) return;

        setSaving(true);
        setSaveError('');
        setSaveSuccess(false);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    phone,
                    company,
                    website,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Bir hata oluştu';
            setSaveError(message);
        } finally {
            setSaving(false);
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

    const getPlanBadge = () => {
        switch (userPlan) {
            case 'growth':
                return (
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-black rounded-full flex items-center gap-1.5">
                        <Crown size={14} /> GROWTH
                    </span>
                );
            case 'pro':
                return (
                    <span className="px-3 py-1 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-black rounded-full flex items-center gap-1.5">
                        <Zap size={14} /> PRO
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-white/10 border border-white/20 text-slate-400 text-xs font-black rounded-full">
                        ÜCRETSİZ
                    </span>
                );
        }
    };

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2">Profil Ayarları</h1>
                    <p className="text-slate-400">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 sticky top-24">
                            {/* Avatar */}
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-white">
                                            {fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                    <Camera size={14} />
                                </button>
                            </div>

                            {/* Name & Email */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-1">{fullName || 'İsimsiz Kullanıcı'}</h3>
                                <p className="text-slate-500 text-sm">{user.email}</p>
                            </div>

                            {/* Plan Badge */}
                            <div className="flex justify-center mb-6">
                                {planLoading ? (
                                    <div className="skeleton w-24 h-6"></div>
                                ) : (
                                    getPlanBadge()
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-3 border-t border-white/5 pt-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <Calendar size={14} /> Üyelik Tarihi
                                    </span>
                                    <span className="text-white font-medium">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <Shield size={14} /> E-posta Onaylı
                                    </span>
                                    <span className={user.email_confirmed_at ? 'text-emerald-400' : 'text-amber-400'}>
                                        {user.email_confirmed_at ? '✓ Evet' : '⏳ Bekliyor'}
                                    </span>
                                </div>
                            </div>

                            {/* Upgrade CTA */}
                            {userPlan === 'free' && (
                                <Link
                                    href="/pricing"
                                    className="mt-6 block w-full py-3 px-4 bg-gradient-to-r from-brand-orange to-amber-500 text-black text-center font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={18} fill="black" /> Pro'ya Geç
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Settings Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Information */}
                        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User size={20} className="text-brand-orange" />
                                Kişisel Bilgiler
                            </h2>

                            {saveError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                    <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{saveError}</p>
                                </div>
                            )}

                            {saveSuccess && (
                                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                                    <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-emerald-400">Değişiklikler başarıyla kaydedildi!</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">Ad Soyad</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0F0F10] border border-white/10 text-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">E-posta</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            value={user.email || ''}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0F0F10] border border-white/10 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">E-posta değiştirmek için destek ile iletişime geçin</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">Telefon</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0F0F10] border border-white/10 text-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="+90 555 123 4567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-2">Şirket</label>
                                    <div className="relative">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0F0F10] border border-white/10 text-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="Şirket Adı"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-white mb-2">Website</label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="url"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0F0F10] border border-white/10 text-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-3 bg-brand-orange hover:bg-amber-500 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Değişiklikleri Kaydet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-purple-400" />
                                Bildirim Tercihleri
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                    <div>
                                        <p className="text-white font-medium">E-posta Bildirimleri</p>
                                        <p className="text-slate-500 text-sm">Kampanya performansı ve önemli güncellemeler</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                        className="w-5 h-5 rounded accent-brand-orange"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                    <div>
                                        <p className="text-white font-medium">Pazarlama E-postaları</p>
                                        <p className="text-slate-500 text-sm">Yeni özellikler, ipuçları ve promosyonlar</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={marketingEmails}
                                        onChange={(e) => setMarketingEmails(e.target.checked)}
                                        className="w-5 h-5 rounded accent-brand-orange"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Key size={20} className="text-emerald-400" />
                                Güvenlik
                            </h2>

                            <div className="space-y-4">
                                <Link
                                    href="/reset-password"
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                    <div>
                                        <p className="text-white font-medium">Şifre Değiştir</p>
                                        <p className="text-slate-500 text-sm">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-[#1C1C1E] rounded-3xl border border-red-500/20 p-6">
                            <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                <Trash2 size={20} />
                                Tehlikeli Bölge
                            </h2>

                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-white font-medium mb-1">Hesabı Sil</p>
                                        <p className="text-slate-500 text-sm">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all text-sm whitespace-nowrap">
                                        Hesabı Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
