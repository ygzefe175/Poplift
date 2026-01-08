"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    GraduationCap,
    Check,
    Zap,
    Sparkles,
    Rocket,
    Gift,
    Award,
    BookOpen,
    Code,
    Briefcase,
    Users,
    ArrowRight,
    Mail,
    Star,
    Shield,
    Clock,
    AlertCircle,
    Lock,
    PartyPopper,
    BadgeCheck,
    Crown
} from 'lucide-react';

// Konfeti Parçacığı Komponenti
const ConfettiPiece = ({ delay, left, color }: { delay: number; left: number; color: string }) => (
    <div
        className="absolute w-2 h-2 rounded-full animate-confetti"
        style={{
            left: `${left}%`,
            backgroundColor: color,
            animationDelay: `${delay}ms`,
            top: '-10px'
        }}
    />
);

// Student Badge Komponenti
const StudentBadge = ({ className = "" }: { className?: string }) => (
    <div className={`group relative inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full ${className}`}>
        <GraduationCap size={12} className="text-purple-400" />
        <span className="text-[10px] font-bold text-purple-300">Öğrenci</span>
        <BadgeCheck size={10} className="text-emerald-400" />

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            <span className="text-xs text-white">✓ Doğrulanmış öğrenci hesabı</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
    </div>
);

export default function OgrenciPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    // E-posta doğrulama fonksiyonu
    const validateEmail = (email: string): { valid: boolean; error: string } => {
        if (!email.trim()) {
            return { valid: false, error: 'E-posta adresi boş bırakılamaz.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Geçersiz e-posta formatı.' };
        }

        // Türkiye edu.tr kontrolü (öncelikli)
        if (email.includes('edu.tr')) {
            return { valid: true, error: '' };
        }

        // Global .edu kontrolü
        if (email.includes('.edu')) {
            return { valid: true, error: '' };
        }

        return { valid: false, error: 'Sadece .edu veya .edu.tr uzantılı e-postalar kabul edilmektedir.' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validation = validateEmail(email);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        setIsSubmitting(true);
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitted(true);
        setShowConfetti(true);
        setIsSubmitting(false);

        // Konfeti animasyonunu 3 saniye sonra kapat
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // Input değiştiğinde hata mesajını temizle
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    // Konfeti renkleri
    const confettiColors = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    return (
        <main className="min-h-screen font-sans overflow-x-hidden selection:bg-brand-orange/30">
            <Navbar />

            {/* Konfeti Animasyonu için CSS */}
            <style jsx global>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(400px) rotate(720deg);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation: confetti-fall 2.5s ease-out forwards;
                }
                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
                    }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                @keyframes bounce-in {
                    0% {
                        transform: scale(0.3);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s ease-out forwards;
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-8">
                        <GraduationCap size={18} className="text-purple-400" />
                        <span className="text-sm font-bold text-purple-300">Öğrenci Özel Fırsatı</span>
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full">%50 İNDİRİM</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                        Öğrenciysen,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-brand-orange">
                            Poplift Senin İçin Bedava*
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        Portfolyo siten, startup projen veya okul ödevin için <span className="text-white font-bold">profesyonel pop-up'lar</span> oluştur.
                        Öğrenci e-postan ile doğrula, <span className="text-purple-400 font-bold">%50 indirimli Pro pakete</span> eriş.
                    </p>

                    {/* Email Form veya Success State */}
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                            {/* Input Container - Düzeltilmiş */}
                            <div className="relative flex items-center">
                                <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <Mail size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="ogrenci@universite.edu.tr"
                                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-base ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10'
                                        }`}
                                    required
                                />
                            </div>

                            {/* Hata Mesajı */}
                            {error && (
                                <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg animate-bounce-in">
                                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                                    <span className="text-sm text-red-400">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Doğrulanıyor...
                                    </>
                                ) : (
                                    <>
                                        <GraduationCap size={20} />
                                        Öğrenci İndirimi Al
                                    </>
                                )}
                            </button>

                            {/* Güven ve Gizlilik Metni */}
                            <div className="mt-4 space-y-1">
                                <p className="text-xs text-slate-500">
                                    * .edu veya .edu.tr uzantılı e-posta adresi gereklidir
                                </p>
                                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600">
                                    <Lock size={10} />
                                    <span>E-posta yalnızca doğrulama amacıyla kullanılır. Veriler üçüncü kişilerle paylaşılmaz.</span>
                                </div>
                            </div>
                        </form>
                    ) : (
                        /* Doğrulama Başarılı - Konfetili Animasyon */
                        <div className="relative max-w-md mx-auto mb-12">
                            {/* Konfeti Efekti */}
                            {showConfetti && (
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <ConfettiPiece
                                            key={i}
                                            delay={i * 50}
                                            left={Math.random() * 100}
                                            color={confettiColors[i % confettiColors.length]}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="p-8 bg-gradient-to-br from-emerald-500/20 via-purple-500/10 to-pink-500/10 border border-emerald-500/30 rounded-2xl animate-bounce-in animate-pulse-glow">
                                {/* Başarı İkonu */}
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 animate-ping opacity-20" />
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <GraduationCap size={36} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#0A0B14]">
                                        <Check size={16} className="text-white" strokeWidth={3} />
                                    </div>
                                </div>

                                {/* Student Badge */}
                                <div className="flex justify-center mb-4">
                                    <StudentBadge />
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2">
                                    Öğrenci Doğrulandı! 🎓
                                </h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Tebrikler! Öğrenci statün onaylandı. Artık özel fiyatlardan yararlanabilirsin.
                                </p>

                                {/* İndirimli Fiyat Gösterimi */}
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Senin Fiyatın</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-xl text-slate-500 line-through">₺599</span>
                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">₺399</span>
                                        <span className="text-slate-400">/ay</span>
                                    </div>
                                    <div className="mt-2 inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                        <span className="text-xs font-bold text-emerald-400">₺200/ay Tasarruf</span>
                                    </div>
                                </div>

                                {/* Devam Et Butonu */}
                                <Link
                                    href="/register?plan=student-pro"
                                    className="block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 text-center"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Devam Et
                                        <ArrowRight size={18} />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-y border-white/5 py-8">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-purple-400">2.500+</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Öğrenci Kullanıcı</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-brand-orange">50+</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Üniversite</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-emerald-400">%50</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Öğrenci İndirimi</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Plans */}
            <section className="py-24 px-6 bg-gradient-to-b from-purple-500/5 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Öğrenci Paketleri</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                            Senin İçin Özel Fiyatlar
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Öğrenci e-postan ile doğrulama yaptıktan sonra bu özel fiyatlara erişebilirsin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Student */}
                        <div className="relative rounded-3xl p-8 bg-white/5 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mb-4">
                                    <BookOpen size={24} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Portfolyo</h3>
                                <p className="text-sm text-slate-400 mb-4">Kişisel projeler için</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white">₺0</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {[
                                    "500 görüntüleme/ay",
                                    "1 aktif kampanya",
                                    "Temel şablonlar",
                                    "Portfolyo siteleri için",
                                    "Poplift branding"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register?plan=student-free"
                                className="block w-full py-4 rounded-xl text-center font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                            >
                                Ücretsiz Başla
                            </Link>
                        </div>

                        {/* Student Pro - EN POPÜLER */}
                        <div className="relative rounded-3xl p-8 bg-gradient-to-b from-purple-500/20 to-purple-500/5 border-2 border-purple-500 hover:-translate-y-2 transition-all duration-300 scale-105 md:scale-110">
                            {/* Çoklu Badge */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                                <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-purple-500/30">
                                    <Crown size={14} className="text-yellow-300" />
                                    MOST POPULAR FOR STUDENTS
                                </div>
                            </div>

                            <div className="mb-6 pt-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <GraduationCap size={24} className="text-white" />
                                    </div>
                                    <StudentBadge />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Öğrenci Pro</h3>
                                <p className="text-sm text-slate-400 mb-4">Startup ve projeler için</p>

                                {/* Fiyat - Daha Belirgin */}
                                <div className="p-4 bg-white/5 rounded-xl border border-purple-500/20 mb-2">
                                    <div className="flex items-baseline gap-2 justify-center">
                                        <span className="text-xl text-slate-500 line-through decoration-red-500/50">₺599</span>
                                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">₺399</span>
                                        <span className="text-slate-400">/ay</span>
                                    </div>
                                </div>
                                <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                    <span className="text-xs font-bold text-emerald-400">%50 Öğrenci İndirimi</span>
                                </div>

                                {/* Yıllık Bonus Metni */}
                                <div className="mt-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <span className="text-xs text-yellow-400 font-medium">
                                        🎁 Yıllık ödemede 2 ay ücretsiz + özel şablonlar hediye!
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {[
                                    "25.000 görüntüleme/ay",
                                    "Sınırsız kampanya",
                                    "Tüm şablonlar",
                                    "🎡 Gamification (Çarkıfelek)",
                                    "A/B testing",
                                    "Branding kaldırma",
                                    "Öncelikli destek"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                                        <span className={`text-sm ${feature.includes('🎡') ? 'text-white font-bold' : 'text-slate-300'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register?plan=student-pro"
                                className="block w-full py-4 rounded-xl text-center font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                            >
                                Öğrenci Pro'ya Başla
                            </Link>
                        </div>

                        {/* Startup Package */}
                        <div className="relative rounded-3xl p-8 bg-white/5 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-orange to-amber-500 text-black text-xs font-black rounded-full flex items-center gap-1">
                                <Rocket size={12} /> GİRİŞİMCİ
                            </div>

                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 flex items-center justify-center mb-4">
                                    <Briefcase size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Startup</h3>
                                <p className="text-sm text-slate-400 mb-4">Öğrenci girişimciler için</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl text-slate-500 line-through">₺799</span>
                                    <span className="text-5xl font-black text-white">₺499</span>
                                    <span className="text-slate-500">/ay</span>
                                </div>
                                <div className="inline-block mt-2 px-3 py-1 bg-brand-orange/20 border border-brand-orange/30 rounded-full">
                                    <span className="text-xs font-bold text-brand-orange">₺300/ay Tasarruf</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {[
                                    "Sınırsız görüntüleme",
                                    "Sınırsız kampanya",
                                    "Growth özellikleri",
                                    "📊 Gelişmiş ROI Analizi",
                                    "📧 Otomatik E-Posta",
                                    "Öncelikli destek",
                                    "Startup mentörlüğü"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
                                        <span className={`text-sm ${feature.includes('📊') || feature.includes('📧') ? 'text-white font-bold' : 'text-slate-300'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register?plan=student-startup"
                                className="block w-full py-4 rounded-xl text-center font-bold bg-brand-orange hover:bg-amber-500 text-black shadow-lg transition-all"
                            >
                                Startup'a Başla
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Kullanım Alanları</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            Öğrenciler Poplift'i<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Nasıl Kullanıyor?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Code size={24} className="text-blue-400" />,
                                title: "Portfolyo Siteleri",
                                desc: "Kişisel portfolyo sitende ziyaretçileri yakala, CV indirtmelerini artır.",
                                badge: "En Popüler",
                                badgeClass: "bg-blue-400/10 text-blue-400 border-blue-400/20"
                            },
                            {
                                icon: <Rocket size={24} className="text-purple-400" />,
                                title: "Startup Projeleri",
                                desc: "MVP'ni test et, ilk 1000 kullanıcını pop-up'larla yakala.",
                                badge: "Girişimci",
                                badgeClass: "bg-purple-400/10 text-purple-400 border-purple-400/20"
                            },
                            {
                                icon: <BookOpen size={24} className="text-emerald-400" />,
                                title: "Okul Ödevleri",
                                desc: "Web tasarım ödevlerinde profesyonel görünüm için pop-up ekle.",
                                badge: "Üniversite",
                                badgeClass: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                            },
                            {
                                icon: <Users size={24} className="text-pink-400" />,
                                title: "Kulüp & Topluluk",
                                desc: "Öğrenci kulübü sitesinde etkinlik duyuruları ve kayıt formları.",
                                badge: "Sosyal",
                                badgeClass: "bg-pink-400/10 text-pink-400 border-pink-400/20"
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-1"
                            >
                                <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold border ${item.badgeClass}`}>
                                    {item.badge}
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Testimonials */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Öğrenciler Ne Diyor?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Ece Y.",
                                uni: "████████ Üniversitesi · CS",
                                quote: "Portfolyo sitem için mükemmel! Recruiters'lar çok beğendi, 3 staj teklifi aldım.",
                                avatar: "👩‍💻"
                            },
                            {
                                name: "Kaan D.",
                                uni: "████ · Endüstri Mühendisliği",
                                quote: "Startup projemiz için kullanıyoruz. İlk 500 kullanıcımızı pop-up'larla yakaladık.",
                                avatar: "🚀"
                            },
                            {
                                name: "Zehra A.",
                                uni: "███ Üniversitesi · İşletme",
                                quote: "Öğrenci kulübümüzün sitesinde etkinlik duyuruları için kullanıyoruz. Kayıtlar %40 arttı!",
                                avatar: "🎓"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-[#0A0B14] p-8 rounded-2xl border border-white/5 relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-4xl">{t.avatar}</span>
                                    <StudentBadge className="ml-auto" />
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                                <div className="border-t border-white/5 pt-4">
                                    <p className="font-bold text-white text-sm">{t.name}</p>
                                    <p className="text-xs text-purple-400 uppercase tracking-wider">{t.uni}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verification Process */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Nasıl Çalışır?</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            3 Adımda Öğrenci İndirimi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                icon: <Mail size={24} className="text-purple-400" />,
                                title: "E-Posta Gir",
                                desc: "Üniversitenden aldığın .edu veya .edu.tr uzantılı e-postanı gir."
                            },
                            {
                                step: "2",
                                icon: <Shield size={24} className="text-emerald-400" />,
                                title: "Doğrulama",
                                desc: "24 saat içinde öğrenci statün otomatik doğrulanır."
                            },
                            {
                                step: "3",
                                icon: <Gift size={24} className="text-brand-orange" />,
                                title: "İndirim Kodu",
                                desc: "%50 indirim kodun e-postana gönderilir. Hemen kullanmaya başla!"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                    {item.step}
                                </div>
                                <div className="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-4 mt-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-white mb-4">Sıkça Sorulan Sorular</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Hangi e-posta adresleri kabul ediliyor?",
                                a: ".edu veya .edu.tr uzantılı tüm üniversite e-postaları kabul edilmektedir. Türkiye'deki tüm devlet ve özel üniversiteler dahildir."
                            },
                            {
                                q: "Mezun olduktan sonra ne olacak?",
                                a: "Mezun olduktan sonra 6 ay daha öğrenci fiyatından yararlanabilirsin. Sonrasında normal fiyatlarımıza geçiş yapılır, ancak %20 mezun indirimi uygulanır."
                            },
                            {
                                q: "Doğrulama ne kadar sürer?",
                                a: "Otomatik doğrulama genellikle 24 saat içinde tamamlanır. Bazı durumlarda öğrenci belgesi istenebilir."
                            },
                            {
                                q: "Yüksek lisans/doktora öğrencileri dahil mi?",
                                a: "Evet! Lisans, yüksek lisans ve doktora öğrencileri tüm indirimlerden yararlanabilir."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h4 className="font-bold text-white mb-2">{item.q}</h4>
                                <p className="text-sm text-slate-400">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
                        <GraduationCap size={18} className="text-purple-400" />
                        <span className="text-sm font-bold text-purple-300">Öğrenci Özel</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        Öğrenciyken Başla,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Mezun Olunca Uç
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                        Kariyerine şimdiden yatırım yap. Pop-up mantığını öğren, portfolyonu güçlendir, fark yarat.
                    </p>

                    <Link
                        href="/register?plan=student"
                        className="inline-flex items-center gap-2 py-5 px-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-xl font-bold rounded-xl shadow-2xl shadow-purple-500/30 transition-all hover:scale-105"
                    >
                        <GraduationCap size={24} />
                        Öğrenci Olarak Başla
                        <ArrowRight size={20} />
                    </Link>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Kredi Kartı Yok</span>
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Anında Doğrulama</span>
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> %50 İndirim</span>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
