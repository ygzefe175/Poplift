"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SmartPopup from '@/components/SmartPopup';
import SpinWheel from '@/components/SpinWheel';
import { MousePointer2, Clock, MoveDown, RefreshCw, ShoppingCart, ShieldCheck, Tag, Info, AlertCircle, Heart, Zap, Sparkles, Mail, Gift } from 'lucide-react';
import { useVisitorTracker } from '@/hooks/useVisitorTracker';
import clsx from 'clsx';
import { VisitorTag } from '@/lib/types';

interface AiLogEntry {
    id: number;
    text: string;
    type: 'detect' | 'analysis' | 'action';
    timestamp: string;
}

export default function DemoPage() {
    const { setTag } = useVisitorTracker();
    const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
    const [activeTag, setActiveTag] = useState<VisitorTag>('standard');
    const [activePosition, setActivePosition] = useState<'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center'>('center');
    const [aiLogs, setAiLogs] = useState<AiLogEntry[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showSpinWheel, setShowSpinWheel] = useState(false);

    const addLog = (text: string, type: AiLogEntry['type']) => {
        setAiLogs(prev => [
            { id: Date.now(), text, type, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
            ...prev
        ].slice(0, 5));
    };

    const simulateTrigger = (type: VisitorTag, triggerName: string) => {
        setIsSimulating(true);
        setAiLogs([]);
        setActiveTrigger(null);

        // Simulation sequence
        setTimeout(() => addLog("Ziyaretçi davranışı izleniyor...", "analysis"), 500);

        if (type === 'indecisive') {
            setTimeout(() => addLog("Sepete ekleme yapmadı, tereddüt var", "detect"), 1500);
            setTimeout(() => addLog("💰 İndirim kodu taktik olarak seçildi", "analysis"), 2500);
        } else if (type === 'trust_seeking') {
            setTimeout(() => addLog("Satın almadan sayfada 45 saniye geçirdi", "detect"), 1500);
            setTimeout(() => addLog("📧 Mail toplama ve retargeting başlatılıyor", "analysis"), 2500);
        } else if (type === 'benefit_oriented') {
            setTimeout(() => addLog("Ürün sayfasını tekrar tekrar görüntülüyor", "detect"), 1500);
            setTimeout(() => addLog("⚡ FOMO (stok azlığı) mesajı gösteriliyor", "analysis"), 2500);
        } else if (type === 'newsletter') {
            setTimeout(() => addLog("Sayfanın %90'ını okudu", "detect"), 1500);
            setTimeout(() => addLog("🎁 VIP listeye davet kampanyası aktif", "analysis"), 2500);
        }

        setTimeout(() => {
            addLog(`${triggerName} Pop-up tetiklendi`, "action");
            setActiveTrigger(triggerName);
            setActiveTag(type);
            setIsSimulating(false);
        }, 3500);
    };

    const resetDemo = () => {
        setActiveTrigger(null);
        setActivePosition('center');
        setAiLogs([]);
        setIsSimulating(false);
    };
    return (
        <main className="min-h-screen bg-[#000212] font-sans selection:bg-indigo-500/30 pt-24">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 h-[calc(100vh-100px)]">

                {/* Sidebar Controls */}
                <div className="lg:col-span-1 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-4">Canlı Demo: Satış Senaryoları</h1>
                        <p className="text-slate-400">Gerçek e-ticaret durumlarını test et. Pop-up'lar nasıl satışa dönüşüyor gör.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 'indecisive', name: '%10 İndirim', desc: 'Sepete eklemedi ama sayfada dolaşıyor → İndirim kodu ver', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
                            { id: 'trust_seeking', name: 'Mail Toplama', desc: 'Ziyaretçi güveniyor ama almıyor → Mail al, sonra sat', icon: Mail, color: 'text-sky-500', bg: 'bg-sky-500/20' },
                            { id: 'benefit_oriented', name: 'Aciliyet (FOMO)', desc: 'Ürünü inceliyor → "3 adet kaldı" mesajı göster', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/20' },
                            { id: 'newsletter', name: 'VIP Liste', desc: 'Sayfanın sonuna geldi → VIP kampanyalara davet et', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/20' },
                        ].map((s) => (
                            <div key={s.id} className={clsx(
                                "p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden",
                                activeTag === s.id && activeTrigger && "border-white/30 bg-white/10"
                            )}
                                onClick={() => simulateTrigger(s.id as VisitorTag, s.name)}
                            >
                                <div className="flex items-center gap-4 mb-2 relative z-10">
                                    <div className={clsx("p-2 rounded-lg", s.bg, s.color)}><s.icon size={20} /></div>
                                    <h3 className="font-bold text-white">{s.name}</h3>
                                </div>
                                <p className="text-sm text-slate-400 relative z-10">{s.desc}</p>
                                {activeTag === s.id && activeTrigger && (
                                    <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                )}
                            </div>
                        ))}

                        {/* Çarkıfelek Butonu */}
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all cursor-pointer group relative overflow-hidden"
                            onClick={() => setShowSpinWheel(true)}
                        >
                            <div className="flex items-center gap-4 mb-2 relative z-10">
                                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                                    <Gift size={20} />
                                </div>
                                <h3 className="font-bold text-white">🎡 Şans Çarkı</h3>
                            </div>
                            <p className="text-sm text-slate-400 relative z-10">Gamification demo: E-posta topla, kupon ver</p>
                            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-black text-[8px] font-black rounded uppercase">YENİ</div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Görünüm Pozisyonu</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: 'top_left', label: 'LU' },
                                { id: 'top_center', label: 'UC' },
                                { id: 'top_right', label: 'RU' },
                                { id: 'center', label: 'C' },
                                { id: 'bottom_left', label: 'LD' },
                                { id: 'bottom_center', label: 'DC' },
                                { id: 'bottom_right', label: 'RD' },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setActivePosition(p.id as any)}
                                    className={clsx(
                                        "p-2 rounded-lg border text-[10px] font-bold transition-all",
                                        activePosition === p.id
                                            ? "bg-indigo-600 border-indigo-500 text-white"
                                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                    )}
                                    title={p.label}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button onClick={resetDemo} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 w-full justify-center font-bold">
                            <RefreshCw size={14} className={isSimulating ? "animate-spin" : ""} /> Demoyu Sıfırla
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-2 relative flex flex-col gap-6">
                    <div className="h-[600px] relative bg-[#0B0E14] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Fake Header */}
                        <div className="bg-[#1C1C1E] h-14 border-b border-white/5 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-black text-xs text-black">P</div>
                                <span className="text-sm font-bold text-white">Poplift Store</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-slate-500"><Info size={16} /></div>
                                <div className="relative text-white">
                                    <ShoppingCart size={20} />
                                    <span className="absolute -top-2 -right-2 bg-brand-orange text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">2</span>
                                </div>
                            </div>
                        </div>

                        {/* Fake Content Page */}
                        <div className={clsx("p-12 transition-all duration-700", (activeTrigger || isSimulating) && "blur-sm grayscale opacity-30")}>
                            <div className="max-w-xl">
                                <div className="h-4 w-20 bg-brand-orange/20 rounded mb-4"></div>
                                <h2 className="text-4xl font-black text-white mb-6">Ultra Modern <br />Kablosuz Kulaklık</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed">Yapay zeka asistanı destekli, aktif gürültü engelleme özelliğine sahip en gelişmiş ses teknolojisi şimdi sınırlı üretimle.</p>

                                <div className="flex items-center gap-6 mb-12">
                                    <span className="text-3xl font-black text-white">₺4,299.00</span>
                                    <span className="text-lg text-slate-500 line-through">₺5,899.00</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">%30 İNDİRİM</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold hover:bg-white/10 transition-colors">
                                        <Heart size={20} /> Favorilere Ekle
                                    </div>
                                    <div className="h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black shadow-lg shadow-white/10 hover:scale-105 transition-transform cursor-pointer">
                                        <ShoppingCart size={20} /> Sepete Ekle
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 border-t border-white/5 pt-12">
                                <h3 className="text-xl font-bold text-white mb-6">Müşteri Yorumları</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/2 px-6 py-4 rounded-2xl border border-white/5">
                                        <div className="flex gap-1 mb-2 text-amber-500">{"★★★★★"}</div>
                                        <p className="text-sm text-slate-400 italic">"Ses kalitesi beklediğimin çok üzerinde. AI özelliği inanılmaz çalışıyor."</p>
                                    </div>
                                    <div className="bg-white/2 px-6 py-4 rounded-2xl border border-white/5">
                                        <div className="flex gap-1 mb-2 text-amber-500">{"★★★★☆"}</div>
                                        <p className="text-sm text-slate-400 italic">"Görünüşü çok şık. Kargo biraz geç geldi ama ürün harika."</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simulating Overlay */}
                        {isSimulating && (
                            <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <span className="text-white font-bold tracking-widest text-sm uppercase">AI Analiz Ediyor...</span>
                                </div>
                            </div>
                        )}

                        {/* AI Detection Result Badge */}
                        {activeTrigger && (
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
                                <div className="bg-indigo-600/90 backdrop-blur px-6 py-2 rounded-full border border-indigo-400/50 shadow-2xl flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-white text-sm font-bold tracking-wide uppercase">AI Tespit: {activeTrigger}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Thought Log */}
                    <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 flex-1 min-h-[220px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> AI Thought Log
                            </h3>
                            <button onClick={() => setAiLogs([])} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Temizle</button>
                        </div>
                        <div className="space-y-3">
                            {aiLogs.length === 0 ? (
                                <div className="text-slate-600 text-sm font-light italic mt-8 text-center">Analiz başlatmak için bir senaryo seçin.</div>
                            ) : (
                                aiLogs.map((log) => (
                                    <div key={log.id} className="flex gap-3 text-sm border-b border-white/5 pb-2 animate-slide-right">
                                        <span className="text-slate-700 font-mono text-[10px] pt-1">{log.timestamp}</span>
                                        <div className={clsx(
                                            "flex items-center gap-2",
                                            log.type === 'detect' && "text-amber-400",
                                            log.type === 'analysis' && "text-white",
                                            log.type === 'action' && "text-emerald-400 font-bold"
                                        )}>
                                            {log.type === 'detect' && <AlertCircle size={14} />}
                                            {log.type === 'action' && <Zap size={14} />}
                                            {log.text}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>


            {/* The Actual Demo Pop-up */}
            <SmartPopup
                forcedConfig={activeTrigger ? { isVisible: true, tag: activeTag, position: activePosition } : { isVisible: false, tag: 'standard' }}
            />

            {/* Spin Wheel Modal */}
            <SpinWheel isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} />
        </main>
    );
}
