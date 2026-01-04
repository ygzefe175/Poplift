"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, MessageSquare, Zap, Layout, Sparkles, MousePointer2, Timer, Gift, Eye, Lock, Settings2, Clock, Scroll, MonitorSmartphone, Smartphone, Monitor, Repeat, Target, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, headline: string, subtext: string, cta: string, position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center', type: string, settings: AdvancedSettings) => Promise<void>;
}

interface AdvancedSettings {
    triggerType: 'time' | 'scroll' | 'exit_intent' | 'click';
    delaySeconds: number;
    scrollPercentage: number;
    frequency: 'always' | 'once_per_session' | 'once_per_day' | 'once_per_week';
    showOnMobile: boolean;
    showOnDesktop: boolean;
}

const TEMPLATES = [
    { id: 'standard', name: 'Standart', icon: Layout, color: 'bg-brand-orange', description: 'Klasik pop-up tasarımı' },
    { id: 'urgency', name: 'Aciliyet (FOMO)', icon: Timer, color: 'bg-red-500', description: 'Geri sayım ile aciliyet hissi' },
    { id: 'gift', name: 'Hediye', icon: Gift, color: 'bg-purple-500', description: 'Özel hediye ve sürpriz teklif' },
    { id: 'spinwheel', name: 'Çarkıfelek 🎡', icon: Target, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', description: 'Gamification ile e-posta topla', isPro: true },
];

const TRIGGER_TYPES = [
    { id: 'time', name: 'Zamanlayıcı', icon: Clock, description: 'Belirli süre sonra göster' },
    { id: 'scroll', name: 'Scroll Tetikleyici', icon: Scroll, description: 'Sayfanın belirli bir yerine gelince' },
    { id: 'exit_intent', name: 'Exit Intent', icon: MousePointer2, description: 'Kullanıcı sayfadan çıkarken' },
    { id: 'click', name: 'Click Tetikleyici', icon: Target, description: 'Belirli bir butona tıklandığında' },
];

const FREQUENCY_OPTIONS = [
    { id: 'always', name: 'Her Ziyaret' },
    { id: 'once_per_session', name: 'Oturum Başına 1 Kez' },
    { id: 'once_per_day', name: 'Günde 1 Kez' },
    { id: 'once_per_week', name: 'Haftada 1 Kez' },
];

const AI_SUGGESTIONS = [
    {
        headline: "Özel İndirim Senini Bekliyor! 🔥",
        subtext: "Bu ürünleri şimdi alırsan sepette anında %20 indirim kazanacaksın.",
        cta: "İndirimi Kap"
    },
    {
        headline: "Süre Doluyor ⏳",
        subtext: "İndirim kodunuzun geçerlilik süresi dolmak üzere. Hemen kullanın!",
        cta: "Kodu Kullan"
    },
    {
        headline: "Sürpriz Hediye 🎁",
        subtext: "İlk siparişine özel gizli bir hediyemiz var. Paketi açmak için tıkla.",
        cta: "Hediyeyi Aç"
    }
];

// Spin Wheel Segments for Preview
const wheelSegments = [
    { label: "%10 İndirim", color: "#FF6B35" },
    { label: "Kargo Bedava", color: "#4ECDC4" },
    { label: "Pas", color: "#2C3E50" },
    { label: "%20 İndirim", color: "#9B59B6" },
    { label: "Tekrar Dene", color: "#E74C3C" },
    { label: "BÜYÜK SÜRPRİZ", color: "#F39C12" },
];

export default function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
    const [template, setTemplate] = useState('standard');
    const [name, setName] = useState('');
    const [headline, setHeadline] = useState('');
    const [subtext, setSubtext] = useState('');
    const [cta, setCta] = useState('');
    const [position, setPosition] = useState<'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center'>('center');
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Advanced Settings State
    const [triggerType, setTriggerType] = useState<'time' | 'scroll' | 'exit_intent' | 'click'>('time');
    const [delaySeconds, setDelaySeconds] = useState(3);
    const [scrollPercentage, setScrollPercentage] = useState(50);
    const [frequency, setFrequency] = useState<'always' | 'once_per_session' | 'once_per_day' | 'once_per_week'>('once_per_session');
    const [showOnMobile, setShowOnMobile] = useState(true);
    const [showOnDesktop, setShowOnDesktop] = useState(true);

    // Spin Wheel Preview
    const [wheelRotation, setWheelRotation] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // AI & Paywall States
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [showAiPaywall, setShowAiPaywall] = useState(false);

    // Dynamic subscription-based access
    const [hasAiAccess, setHasAiAccess] = useState(false);
    const [hasProAccess, setHasProAccess] = useState(false);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

    // Fetch user subscription on mount
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setIsLoadingSubscription(false);
                    return;
                }

                const response = await fetch(`/api/subscription?user_id=${user.id}`);
                const data = await response.json();

                if (data.success && data.subscription) {
                    const sub = data.subscription;
                    const planType = sub.plan_type || 'free';

                    // Pro veya Growth pakette Magic Fill otomatik dahil
                    const isPro = planType === 'pro' || planType === 'growth';

                    // AI erişimi: Pro pakette otomatik VEYA ayrı satın almışsa (has_ai_assistant)
                    setHasAiAccess(isPro || sub.has_ai_assistant === true);

                    // Pro erişimi (çarkıfelek vb. için)
                    setHasProAccess(isPro);
                }
            } catch (error) {
                console.error('Subscription fetch error:', error);
            } finally {
                setIsLoadingSubscription(false);
            }
        };

        if (isOpen) {
            fetchSubscription();
        }
    }, [isOpen]);

    // Draw wheel preview
    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 5;
        const segmentAngle = (2 * Math.PI) / wheelSegments.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        wheelSegments.forEach((segment, index) => {
            const startAngle = index * segmentAngle - Math.PI / 2;
            const endAngle = startAngle + segmentAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px "Inter", sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 2;
            ctx.fillText(segment.label, radius - 8, 3);
            ctx.restore();
        });

        // Center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', centerX, centerY);
    }, []);

    useEffect(() => {
        if (isOpen && template === 'spinwheel') {
            setTimeout(drawWheel, 100);
        }
    }, [isOpen, template, drawWheel]);

    // Animate wheel on hover
    useEffect(() => {
        if (template === 'spinwheel' && isOpen) {
            const interval = setInterval(() => {
                setWheelRotation(prev => prev + 0.5);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [template, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const advancedSettings: AdvancedSettings = {
            triggerType,
            delaySeconds,
            scrollPercentage,
            frequency,
            showOnMobile,
            showOnDesktop,
        };

        await onSubmit(name, headline, subtext, cta, position, template, advancedSettings);

        // Success Effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#ffffff', '#000000']
        });

        setLoading(false);
        onClose();
    };

    const handleAiGenerate = () => {
        if (!hasAiAccess) {
            setShowAiPaywall(true);
            return;
        }

        setIsAiGenerating(true);
        // Simulate thinking delay
        setTimeout(() => {
            const random = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
            setHeadline(random.headline);
            setSubtext(random.subtext);
            setCta(random.cta);

            // Match template to text somewhat intelligently
            if (random.headline.includes('Süre')) setTemplate('urgency');
            else if (random.headline.includes('Hediye')) setTemplate('gift');
            else setTemplate('standard');

            setIsAiGenerating(false);
        }, 1500);
    };

    // Spinwheel upgrade paywall state
    const [showSpinwheelPaywall, setShowSpinwheelPaywall] = useState(false);

    const handleTemplateSelect = (templateId: string) => {
        if (templateId === 'spinwheel' && !hasProAccess) {
            // Show upgrade prompt for spinwheel
            setShowSpinwheelPaywall(true);
            return;
        }
        setTemplate(templateId);

        // Auto-fill for spinwheel
        if (templateId === 'spinwheel') {
            setHeadline('🎡 Şansını Dene!');
            setSubtext('E-postanı gir, çarkı çevir ve sürpriz indirim kazan!');
            setCta('ÇEVİR VE KAZAN!');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 w-full max-w-6xl shadow-2xl relative overflow-hidden animate-slide-up flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <X size={20} />
                </button>

                {/* Left Side: Form */}
                <div className="w-full md:w-5/12 p-8 border-r border-white/5 overflow-y-auto custom-scrollbar relative">

                    {/* AI PAYWALL OVERLAY (Inside Form Column) */}
                    {showAiPaywall && (
                        <div className="absolute inset-0 z-50 bg-[#1C1C1E]/95 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                                    <Sparkles size={32} className="text-white animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Magic Fill ✨</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Yapay zeka asistanı, kampanya hedeflerinize uygun en etkileyici başlık ve metinleri saniyeler içinde yazar.
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-left">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-bold text-sm">AI Metin Asistanı Paketi</span>
                                        <span className="text-brand-orange font-black">₺99/ay</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Sınırsız AI metin üretimi</p>
                                </div>

                                <div className="bg-gradient-to-r from-brand-orange/10 to-amber-500/10 border border-brand-orange/30 rounded-xl p-4 mb-6 text-left">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-bold text-sm flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 bg-brand-orange text-black text-[10px] font-black rounded">PRO</span>
                                            Pro Paket
                                        </span>
                                        <span className="text-brand-orange font-black">₺399/ay</span>
                                    </div>
                                    <p className="text-xs text-emerald-400">✓ Magic Fill dahil + Çarkıfelek + Tüm Özellikler</p>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/checkout?product=ai" className="block w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors text-center">
                                        Sadece AI Paketi (₺99/ay)
                                    </Link>
                                    <Link href="/checkout?product=pro" className="block w-full py-3 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition-all text-center shadow-lg shadow-brand-orange/20">
                                        Pro Pakete Geç (Önerilen)
                                    </Link>
                                    <button
                                        onClick={() => setShowAiPaywall(false)}
                                        className="text-xs text-slate-500 hover:text-white transition-colors mt-2 w-full"
                                    >
                                        Vazgeç
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SPINWHEEL PAYWALL OVERLAY */}
                    {showSpinwheelPaywall && (
                        <div className="absolute inset-0 z-50 bg-[#1C1C1E]/95 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20">
                                    <Target size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Çarkıfelek 🎡</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Gamification ile e-posta toplama oranınızı 3x artırın! Çarkıfelek şablonu Pro pakete dahildir.
                                </p>

                                <div className="bg-gradient-to-r from-brand-orange/10 to-amber-500/10 border border-brand-orange/30 rounded-xl p-4 mb-6 text-left">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-bold text-sm flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 bg-brand-orange text-black text-[10px] font-black rounded">PRO</span>
                                            Pro Paket
                                        </span>
                                        <span className="text-brand-orange font-black">₺399/ay</span>
                                    </div>
                                    <ul className="text-xs text-slate-400 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className="text-emerald-400">✓</span> Çarkıfelek şablonu
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-emerald-400">✓</span> Magic Fill (AI)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-emerald-400">✓</span> Sınırsız kampanya
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-emerald-400">✓</span> A/B Testing
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/checkout?product=pro" className="block w-full py-3 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition-all text-center shadow-lg shadow-brand-orange/20">
                                        Pro Pakete Geç
                                    </Link>
                                    <button
                                        onClick={() => setShowSpinwheelPaywall(false)}
                                        className="text-xs text-slate-500 hover:text-white transition-colors mt-2 w-full"
                                    >
                                        Vazgeç
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Campaign Wizard</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Yeni Kampanya</h2>
                        <p className="text-slate-400 text-sm mt-2">Dönüşüm oranlarını artırmak için doğru stratejiyi seçin.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Template Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tasarım Şablonu</label>
                            <div className="grid grid-cols-2 gap-3">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => handleTemplateSelect(t.id)}
                                        className={clsx(
                                            "relative flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left",
                                            template === t.id
                                                ? "bg-white/10 border-brand-orange/50 text-white shadow-lg shadow-brand-orange/10"
                                                : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                template === t.id ? t.color : "bg-white/5"
                                            )}>
                                                <t.icon size={16} className={template === t.id ? "text-white" : ""} />
                                            </div>
                                            <span className={clsx("font-bold text-sm", template === t.id ? "text-white" : "")}>
                                                {t.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">{t.description}</span>
                                        {t.isPro && (
                                            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-[8px] font-black text-black rounded-full">
                                                PRO
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Position - Only show for non-spinwheel */}
                        {template !== 'spinwheel' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Görünüm Pozisyonu</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'top_left', label: 'Sol Üst', pos: 'items-start justify-start' },
                                        { id: 'top_center', label: 'Üst Orta', pos: 'items-start justify-center' },
                                        { id: 'top_right', label: 'Sağ Üst', pos: 'items-start justify-end' },
                                        { id: 'center', label: 'Orta', pos: 'items-center justify-center' },
                                        { id: 'bottom_left', label: 'Sol Alt', pos: 'items-end justify-start' },
                                        { id: 'bottom_center', label: 'Alt Orta', pos: 'items-end justify-center' },
                                        { id: 'bottom_right', label: 'Sağ Alt', pos: 'items-end justify-end' },
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPosition(p.id as any)}
                                            className={clsx(
                                                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all text-[10px] font-bold",
                                                position === p.id
                                                    ? "bg-white/10 border-brand-orange/50 text-white shadow-lg shadow-brand-orange/10"
                                                    : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5"
                                            )}
                                        >
                                            <div className={clsx("w-6 h-4 border border-white/10 rounded-sm mb-1 relative bg-white/5", p.pos)}>
                                                <div className="w-1.5 h-1.5 bg-brand-orange rounded-full absolute" style={{
                                                    top: p.id.includes('top') ? '2px' : p.id === 'center' ? 'calc(50% - 0.75px)' : 'auto',
                                                    bottom: p.id.includes('bottom') ? '2px' : 'auto',
                                                    left: p.id.includes('left') ? '2px' : p.id.includes('center') ? 'calc(50% - 0.75px)' : 'auto',
                                                    right: p.id.includes('right') ? '2px' : 'auto',
                                                }}></div>
                                            </div>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Campaign Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Layout size={14} /> Kampanya Adı
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Örn: Yaz İndirimi 2024"
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                            />
                        </div>

                        {/* Content Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <MessageSquare size={14} /> İçerik Detayları
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={isLoadingSubscription}
                                    className={clsx(
                                        "group flex items-center gap-1.5 text-xs font-bold text-white transition-all px-3 py-1.5 rounded-lg shadow-lg border border-white/10",
                                        hasAiAccess
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400"
                                            : "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-500",
                                        isLoadingSubscription && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isLoadingSubscription ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Yükleniyor...
                                        </>
                                    ) : isAiGenerating ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Yazıyor...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} className="group-hover:animate-pulse" />
                                            Magic Fill <span className="opacity-50 text-[10px] ml-1 font-normal">(AI)</span>
                                            {hasAiAccess ? (
                                                <span className="ml-1 px-1 py-0.5 bg-white/20 text-[8px] font-bold rounded">✓</span>
                                            ) : (
                                                <Lock size={10} className="ml-1 text-white/50" />
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>

                            <input
                                type="text"
                                required
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder={template === 'spinwheel' ? "🎡 Şansını Dene!" : "Başlık"}
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all font-bold"
                            />

                            <textarea
                                required
                                value={subtext}
                                onChange={(e) => setSubtext(e.target.value)}
                                placeholder={template === 'spinwheel' ? "E-postanı gir, çarkı çevir ve sürpriz indirim kazan!" : "Kullanıcıyı etkileyecek açıklama metni..."}
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all min-h-[80px] resize-none"
                            />

                            <input
                                type="text"
                                required
                                value={cta}
                                onChange={(e) => setCta(e.target.value)}
                                placeholder={template === 'spinwheel' ? "ÇEVİR VE KAZAN!" : "Buton Metni"}
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                            />
                        </div>

                        {/* Advanced Settings Toggle */}
                        <div className="border-t border-white/5 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                                        <Settings2 size={16} className="text-brand-orange" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-white">Gelişmiş Ayarlar</span>
                                        <p className="text-[10px] text-slate-500">Tetikleyici, zamanlama, frekans</p>
                                    </div>
                                </div>
                                {showAdvanced ? (
                                    <ChevronUp size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                ) : (
                                    <ChevronDown size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                )}
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 space-y-5 animate-fade-in">
                                    {/* Trigger Type */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            Tetikleyici Türü
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {TRIGGER_TYPES.map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setTriggerType(t.id as any)}
                                                    className={clsx(
                                                        "flex items-center gap-2 p-3 rounded-xl border transition-all",
                                                        triggerType === t.id
                                                            ? "bg-brand-orange/10 border-brand-orange/50 text-white"
                                                            : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5"
                                                    )}
                                                >
                                                    <t.icon size={16} className={triggerType === t.id ? "text-brand-orange" : ""} />
                                                    <div className="text-left">
                                                        <span className="text-xs font-bold block">{t.name}</span>
                                                        <span className="text-[9px] text-slate-500">{t.description}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delay Settings - Show for time trigger */}
                                    {triggerType === 'time' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Clock size={14} /> Gecikme Süresi
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="60"
                                                    value={delaySeconds}
                                                    onChange={(e) => setDelaySeconds(parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                                                />
                                                <div className="bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 min-w-[80px] text-center">
                                                    <span className="text-white font-bold">{delaySeconds}</span>
                                                    <span className="text-slate-500 text-xs ml-1">sn</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">
                                                Sayfa yükleninsinden {delaySeconds} saniye sonra pop-up görünecek
                                            </p>
                                        </div>
                                    )}

                                    {/* Scroll Percentage - Show for scroll trigger */}
                                    {triggerType === 'scroll' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Scroll size={14} /> Scroll Yüzdesi
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="100"
                                                    step="5"
                                                    value={scrollPercentage}
                                                    onChange={(e) => setScrollPercentage(parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                                                />
                                                <div className="bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 min-w-[80px] text-center">
                                                    <span className="text-white font-bold">%{scrollPercentage}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">
                                                Kullanıcı sayfanın %{scrollPercentage}'üne geldiğinde pop-up görünecek
                                            </p>
                                        </div>
                                    )}

                                    {/* Frequency */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Repeat size={14} /> Gösterim Sıklığı
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {FREQUENCY_OPTIONS.map((f) => (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    onClick={() => setFrequency(f.id as any)}
                                                    className={clsx(
                                                        "px-4 py-2 rounded-lg border text-xs font-bold transition-all",
                                                        frequency === f.id
                                                            ? "bg-brand-orange/10 border-brand-orange/50 text-white"
                                                            : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5"
                                                    )}
                                                >
                                                    {f.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Device Visibility */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <MonitorSmartphone size={14} /> Cihaz Görünürlüğü
                                        </label>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowOnDesktop(!showOnDesktop)}
                                                className={clsx(
                                                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                                    showOnDesktop
                                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                        : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5"
                                                )}
                                            >
                                                <Monitor size={18} />
                                                <span className="text-xs font-bold">Desktop</span>
                                                {showOnDesktop && <span className="text-[10px]">✓</span>}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowOnMobile(!showOnMobile)}
                                                className={clsx(
                                                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                                    showOnMobile
                                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                        : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5"
                                                )}
                                            >
                                                <Smartphone size={18} />
                                                <span className="text-xs font-bold">Mobile</span>
                                                {showOnMobile && <span className="text-[10px]">✓</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold transition-colors w-1/3"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-black font-black hover:brightness-110 transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 w-2/3 group"
                            >
                                {loading ? 'Oluşturuluyor...' : <><Zap size={18} fill="black" className="group-hover:scale-110 transition-transform" /> Yayına Al</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Live Interactive Preview */}
                <div className="w-full md:w-7/12 bg-[#000212] relative flex flex-col justify-center items-center p-12 border-l border-white/5 overflow-hidden">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

                    <div className="absolute top-8 left-8 flex items-center gap-3">
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-slate-400 flex items-center gap-2">
                            <Eye size={12} /> Live Preview
                        </div>
                        {showAdvanced && (
                            <div className="px-3 py-1 bg-brand-orange/10 rounded-full border border-brand-orange/30 text-xs font-bold text-brand-orange flex items-center gap-2">
                                {triggerType === 'time' && <><Clock size={12} /> {delaySeconds}sn</>}
                                {triggerType === 'scroll' && <><Scroll size={12} /> %{scrollPercentage}</>}
                                {triggerType === 'exit_intent' && <><MousePointer2 size={12} /> Exit Intent</>}
                                {triggerType === 'click' && <><Target size={12} /> Click</>}
                            </div>
                        )}
                    </div>

                    {/* SPINWHEEL PREVIEW */}
                    {template === 'spinwheel' ? (
                        <div className="relative z-10 w-full max-w-sm mx-auto">
                            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6 border border-white/10 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold mb-2">
                                        <Gift size={14} />
                                        ÖZEL FIRSAT
                                    </div>
                                    <h2 className="text-xl font-black text-white mb-1">
                                        {headline || "🎡 Şansını Dene!"}
                                    </h2>
                                    <p className="text-slate-400 text-sm">
                                        {subtext || "E-postanı gir, çarkı çevir ve sürpriz indirim kazan!"}
                                    </p>
                                </div>

                                {/* Wheel Container */}
                                <div className="relative w-44 h-44 mx-auto mb-4">
                                    {/* Pointer */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 filter drop-shadow-md">
                                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-400" />
                                    </div>

                                    {/* Wheel Canvas */}
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            transform: `rotate(${wheelRotation}deg)`,
                                            transition: 'transform 0.05s linear',
                                        }}
                                    >
                                        <canvas
                                            ref={canvasRef}
                                            width={176}
                                            height={176}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>

                                {/* Email Input & Spin Button */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            placeholder="E-posta adresinizi girin"
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                            disabled
                                        />
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                                    >
                                        🎰 {cta || "ÇEVİR VE KAZAN!"}
                                    </button>
                                </div>

                                <p className="text-center text-slate-500 text-[10px] mt-3">
                                    Powered by Poplift
                                </p>
                            </div>

                            {/* Close Button Hint */}
                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                <X size={14} className="text-slate-500" />
                            </div>
                        </div>
                    ) : (
                        /* STANDARD POPUP PREVIEW */
                        <div className={clsx(
                            "relative z-10 w-full transition-all duration-700 ease-in-out flex h-full p-4",
                            position === 'center' ? "items-center justify-center" :
                                position.includes('top') ? "items-start" : "items-end",
                            position.includes('left') ? "justify-start" :
                                position.includes('right') ? "justify-end" : "justify-center"
                        )}>
                            <div className={clsx(
                                "bg-[#1C1C1E] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500",
                                template === 'urgency' && "border-red-500/30 shadow-red-900/20",
                                template === 'gift' && "border-purple-500/30 shadow-purple-900/20",
                                template === 'standard' && "border-brand-orange/30 shadow-orange-900/20",
                                position === 'center' ? "w-full max-w-sm p-8" : "w-64 p-4 transform scale-90"
                            )}>

                                {/* Template Specific Decors */}
                                {template === 'standard' && (
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-orange/20 rounded-full blur-[60px] pointer-events-none" />
                                )}
                                {template === 'urgency' && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[loading_2s_ease-in-out_infinite]" />
                                )}
                                {template === 'gift' && (
                                    <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
                                )}

                                {/* Content */}
                                <div className={clsx(
                                    "relative z-10 flex flex-col",
                                    position === 'center' ? "items-center text-center" : "items-start text-left"
                                )}>
                                    {/* Icon/Image Area */}
                                    <div className={clsx(
                                        "rounded-2xl border shadow-lg transition-all duration-300 flex items-center justify-center",
                                        template === 'standard' && "bg-white/5 border-white/10 text-brand-orange",
                                        template === 'urgency' && "bg-red-500/10 border-red-500/20 text-red-500 animate-pulse",
                                        template === 'gift' && "bg-purple-500/10 border-purple-500/20 text-purple-400",
                                        position === 'center' ? "w-16 h-16 p-4 mb-6" : "w-10 h-10 p-2 mb-3"
                                    )}>
                                        {template === 'standard' && <Sparkles size={position === 'center' ? 32 : 20} />}
                                        {template === 'urgency' && <Timer size={position === 'center' ? 32 : 20} />}
                                        {template === 'gift' && <Gift size={position === 'center' ? 32 : 20} />}
                                    </div>

                                    <h3 className={clsx(
                                        "font-black text-white mb-2 leading-tight",
                                        position === 'top_right' ? "text-base" : "text-2xl"
                                    )}>
                                        {headline || (position === 'top_right' ? "Yeni Bildirim" : "Başlık Alanı")}
                                    </h3>

                                    <p className={clsx(
                                        "text-slate-400 leading-relaxed",
                                        position === 'top_right' ? "text-xs mb-4 line-clamp-2" : "text-sm mb-6"
                                    )}>
                                        {subtext || (position === 'top_right' ? "Kısa açıklama metni buraya gelecek." : "Kullanıcıya göstermek istediğiniz açıklama metni buraya gelecek.")}
                                    </p>

                                    {/* Template Specific Extras */}
                                    {template === 'urgency' && position === 'center' && (
                                        <div className="flex gap-2 mb-6 text-xl font-mono font-bold text-red-500">
                                            <span className="bg-red-500/10 px-2 py-1 rounded">04</span>:
                                            <span className="bg-red-500/10 px-2 py-1 rounded">59</span>
                                        </div>
                                    )}

                                    <button className={clsx(
                                        "w-full rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95",
                                        template === 'standard' && "bg-brand-orange text-black shadow-brand-orange/20 hover:bg-orange-400",
                                        template === 'urgency' && "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600",
                                        template === 'gift' && "bg-purple-600 text-white shadow-purple-600/20 hover:bg-purple-700",
                                        position === 'center' ? "py-4 text-sm" : "py-2 px-4 text-[10px]"
                                    )}>
                                        {cta || "Buton Metni"} <MousePointer2 size={position === 'center' ? 16 : 12} />
                                    </button>

                                    {position === 'center' && (
                                        <p className="text-[10px] text-slate-600 mt-4 font-medium uppercase tracking-widest">Powered by Poplift</p>
                                    )}
                                </div>

                                {/* Fake Close Button */}
                                <div className="absolute top-3 right-3 text-slate-600 cursor-pointer hover:text-white transition-colors">
                                    <X size={position === 'top_right' ? 14 : 18} />
                                </div>
                            </div>

                            {/* Reflection/Shadow under the preview for depth (only for central modal) */}
                            {position === 'center' && (
                                <div className={clsx(
                                    "absolute bottom-10 w-[60%] h-8 blur-3xl rounded-full transition-all duration-500 -z-10",
                                    template === 'standard' ? "bg-brand-orange/30" : template === 'urgency' ? "bg-red-500/30" : "bg-purple-500/30"
                                )}></div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
