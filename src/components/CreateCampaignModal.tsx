"use client";

import React, { useState } from 'react';
import { X, MessageSquare, Zap, Layout, Sparkles, MousePointer2, Timer, Gift, Eye, Lock } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, headline: string, subtext: string, cta: string, position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center', type: string) => Promise<void>;
}

const TEMPLATES = [
    { id: 'standard', name: 'Standart', icon: Layout, color: 'bg-brand-orange' },
    { id: 'urgency', name: 'Aciliyet (FOMO)', icon: Timer, color: 'bg-red-500' },
    { id: 'gift', name: 'Hediye', icon: Gift, color: 'bg-purple-500' },
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

export default function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
    const [template, setTemplate] = useState('standard');
    const [name, setName] = useState('');
    const [headline, setHeadline] = useState('');
    const [subtext, setSubtext] = useState('');
    const [cta, setCta] = useState('');
    const [position, setPosition] = useState<'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center'>('center');
    const [loading, setLoading] = useState(false);

    // AI & Paywall States
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [showAiPaywall, setShowAiPaywall] = useState(false);
    // Simulating user plan status (Free tier by default to show upsell)
    const hasAiAccess = false;

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await onSubmit(name, headline, subtext, cta, position, template);

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

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-bold text-sm">AI Metin Asistanı Paketi</span>
                                        <span className="text-brand-orange font-black">₺99/ay</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Sınırsız AI metin üretimi</p>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/register?addon=ai" className="block w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                        Paketi Satın Al (₺99)
                                    </Link>
                                    <Link href="/register?plan=pro" className="block w-full py-3 bg-brand-orange/10 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/20 transition-colors">
                                        Pro Pakete Geç (Tüm Özellikler)
                                    </Link>
                                    <button
                                        onClick={() => setShowAiPaywall(false)}
                                        className="text-xs text-slate-500 hover:text-white transition-colors mt-2"
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tasarım Şablonu</label>
                            <div className="grid grid-cols-3 gap-3">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTemplate(t.id)}
                                        className={clsx(
                                            "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                            template === t.id
                                                ? "bg-white/10 border-brand-orange/50 text-white shadow-lg shadow-brand-orange/10"
                                                : "bg-[#0F1117] border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <t.icon size={20} className={template === t.id ? "text-brand-orange" : ""} />
                                    </button>
                                ))}
                            </div>
                        </div>

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

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <MessageSquare size={14} /> İçerik Detayları
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    className="group flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-500/20 border border-white/10"
                                >
                                    {isAiGenerating ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Yazıyor...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} className="group-hover:animate-pulse" />
                                            Magic Fill <span className="opacity-50 text-[10px] ml-1 font-normal">(AI)</span>
                                            {!hasAiAccess && <Lock size={10} className="ml-1 text-white/50" />}
                                        </>
                                    )}
                                </button>
                            </div>

                            <input
                                type="text"
                                required
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder="Başlık"
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all font-bold"
                            />

                            <textarea
                                required
                                value={subtext}
                                onChange={(e) => setSubtext(e.target.value)}
                                placeholder="Kullanıcıyı etkileyecek açıklama metni..."
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all min-h-[100px] resize-none"
                            />

                            <input
                                type="text"
                                required
                                value={cta}
                                onChange={(e) => setCta(e.target.value)}
                                placeholder="Buton Metni"
                                className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                            />
                        </div>

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
                    </div>

                    {/* The Popup Container */}
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
                </div>
            </div>
        </div>
    );
}
