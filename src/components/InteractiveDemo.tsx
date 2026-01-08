"use client";

import React, { useState, useEffect } from 'react';
import { X, Gift, Zap, Sparkles, MousePointer, Clock, Palette, Type, RefreshCw, Check, Crown, Code, Copy, ExternalLink, Settings, Eye, Smartphone, Monitor, ChevronRight, Play, Pause } from 'lucide-react';
import { PremiumBadge } from './PremiumFeatures';

/**
 * InteractiveDemo Component
 * Full popup customization experience - users feel like they're using the real product
 * Includes: text editing, style selection, device preview, embed code generation
 */

interface PopupConfig {
    headline: string;
    subtext: string;
    buttonText: string;
    discount: string;
    style: 'modern' | 'minimal' | 'bold';
    position: 'center' | 'bottom-right' | 'bottom-left';
    trigger: 'time' | 'exit' | 'scroll';
    delay: number;
}

export default function InteractiveDemo() {
    const [config, setConfig] = useState<PopupConfig>({
        headline: 'Bekle! %20 İndirim Kaçırma',
        subtext: 'E-posta bırak, indirim kodunu al',
        buttonText: 'İndirimi Al',
        discount: '%20',
        style: 'modern',
        position: 'center',
        trigger: 'time',
        delay: 3
    });
    const [showPreview, setShowPreview] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
    const [showCode, setShowCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');

    // Animate popup on config change
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [config]);

    // Preset templates
    const presets = [
        {
            name: 'E-ticaret',
            icon: '🛒',
            config: {
                headline: 'Sepetini Unutma! %15 İndirim',
                subtext: 'Siparişini hemen tamamla, indirimden yararlan',
                buttonText: 'Alışverişe Devam',
                discount: '%15',
                style: 'modern' as const,
                position: 'center' as const,
                trigger: 'exit' as const,
                delay: 0
            }
        },
        {
            name: 'Lead Gen',
            icon: '📧',
            config: {
                headline: 'Ücretsiz E-Kitap İndir',
                subtext: 'Dijital pazarlama rehberini ücretsiz al',
                buttonText: 'Hemen İndir',
                discount: 'ÜCRETSİZ',
                style: 'bold' as const,
                position: 'center' as const,
                trigger: 'scroll' as const,
                delay: 0
            }
        },
        {
            name: 'SaaS',
            icon: '🚀',
            config: {
                headline: '14 Gün Ücretsiz Dene',
                subtext: 'Kredi kartı gerekmez, hemen başla',
                buttonText: 'Denemeyi Başlat',
                discount: '14 GÜN',
                style: 'minimal' as const,
                position: 'bottom-right' as const,
                trigger: 'time' as const,
                delay: 5
            }
        }
    ];

    const styles = {
        modern: {
            bg: 'from-purple-500/20 to-pink-500/20',
            border: 'border-purple-500/30',
            button: 'from-purple-500 to-pink-500',
            badge: 'bg-purple-500'
        },
        minimal: {
            bg: 'from-slate-800 to-slate-900',
            border: 'border-white/10',
            button: 'from-white to-slate-200',
            badge: 'bg-emerald-500'
        },
        bold: {
            bg: 'from-brand-orange/20 to-red-500/20',
            border: 'border-brand-orange/30',
            button: 'from-brand-orange to-red-500',
            badge: 'bg-brand-orange'
        }
    };

    const currentStyle = styles[config.style];

    // Generate embed code
    const embedCode = `<!-- Poplift Pop-up Widget -->
<script>
  (function(p,o,l,i,f,t){
    p['PopliftWidget']=f;p[f]=p[f]||function(){
    (p[f].q=p[f].q||[]).push(arguments)};
    t=o.createElement(l);t.async=1;
    t.src='https://cdn.poplift.com/widget.js';
    o.head.appendChild(t);
  })(window,document,'script','poplift');
  
  poplift('init', 'YOUR_SITE_ID');
</script>`;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-purple-500/5 to-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                        <MousePointer size={16} className="text-purple-400" />
                        <span className="text-sm font-bold text-purple-300">Etkileşimli Demo</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Pop-up'ını <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Özelleştir</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Kendi sitene ekleyeceğin pop-up'ı şimdi tasarla. Gerçek ürünü kullanıyormuş gibi dene.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Controls Panel */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Quick Presets */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                                <Sparkles size={16} className="text-purple-400" />
                                Hazır Şablonlar
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {presets.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setConfig({ ...config, ...preset.config })}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all text-center group"
                                    >
                                        <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{preset.icon}</span>
                                        <span className="text-[10px] text-slate-400">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="flex border-b border-white/5">
                                {[
                                    { id: 'content', icon: Type, label: 'İçerik' },
                                    { id: 'style', icon: Palette, label: 'Stil' },
                                    { id: 'settings', icon: Settings, label: 'Ayarlar' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${activeTab === tab.id
                                                ? 'text-white bg-white/5 border-b-2 border-purple-500'
                                                : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        <tab.icon size={14} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                {/* Content Tab */}
                                {activeTab === 'content' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Başlık</label>
                                            <input
                                                type="text"
                                                value={config.headline}
                                                onChange={(e) => setConfig(prev => ({ ...prev, headline: e.target.value }))}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                                                maxLength={50}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Alt Metin</label>
                                            <textarea
                                                value={config.subtext}
                                                onChange={(e) => setConfig(prev => ({ ...prev, subtext: e.target.value }))}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none h-20"
                                                maxLength={100}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Buton</label>
                                                <input
                                                    type="text"
                                                    value={config.buttonText}
                                                    onChange={(e) => setConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                                                    maxLength={20}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">İndirim</label>
                                                <input
                                                    type="text"
                                                    value={config.discount}
                                                    onChange={(e) => setConfig(prev => ({ ...prev, discount: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Style Tab */}
                                {activeTab === 'style' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-3">Renk Teması</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['modern', 'minimal', 'bold'] as const).map((style) => (
                                                    <button
                                                        key={style}
                                                        onClick={() => setConfig(prev => ({ ...prev, style }))}
                                                        className={`p-3 border rounded-xl transition-all ${config.style === style
                                                                ? 'bg-purple-500/20 border-purple-500'
                                                                : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                                                            }`}
                                                    >
                                                        <div className={`h-4 w-full rounded bg-gradient-to-r ${styles[style].button} mb-2`} />
                                                        <span className="text-[10px] text-slate-400 capitalize">{style}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-3">Pozisyon</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: 'center', label: 'Orta' },
                                                    { id: 'bottom-right', label: 'Sağ Alt' },
                                                    { id: 'bottom-left', label: 'Sol Alt' }
                                                ].map((pos) => (
                                                    <button
                                                        key={pos.id}
                                                        onClick={() => setConfig(prev => ({ ...prev, position: pos.id as any }))}
                                                        className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${config.position === pos.id
                                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-purple-500/30'
                                                            }`}
                                                    >
                                                        {pos.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-3">Tetikleyici</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: 'time', label: 'Zamanlı', icon: Clock },
                                                    { id: 'exit', label: 'Exit Intent', icon: MousePointer },
                                                    { id: 'scroll', label: 'Scroll', icon: Eye }
                                                ].map((trigger) => (
                                                    <button
                                                        key={trigger.id}
                                                        onClick={() => setConfig(prev => ({ ...prev, trigger: trigger.id as any }))}
                                                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${config.trigger === trigger.id
                                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-purple-500/30'
                                                            }`}
                                                    >
                                                        <trigger.icon size={18} />
                                                        <span className="text-[10px] font-bold">{trigger.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {config.trigger === 'time' && (
                                            <div>
                                                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Gecikme (saniye)</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="30"
                                                        value={config.delay}
                                                        onChange={(e) => setConfig(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                                                        className="flex-1 accent-purple-500"
                                                    />
                                                    <span className="text-white font-bold w-8 text-center">{config.delay}s</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Embed Code */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className="w-full flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Code size={18} className="text-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-white text-sm">Embed Kodu</h4>
                                        <p className="text-[10px] text-slate-500">Sitene tek satır ile ekle</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className={`text-slate-500 transition-transform ${showCode ? 'rotate-90' : ''}`} />
                            </button>

                            {showCode && (
                                <div className="mt-4 animate-fade-in">
                                    <div className="relative">
                                        <pre className="bg-black/50 rounded-xl p-4 text-[10px] text-emerald-400 overflow-x-auto">
                                            {embedCode}
                                        </pre>
                                        <button
                                            onClick={handleCopyCode}
                                            className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">
                                        Bu kodu `&lt;head&gt;` etiketinin içine yapıştır
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-24 bg-[#0A0B14] border border-white/10 rounded-2xl overflow-hidden">
                            {/* Preview Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">mağazam.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Device Toggle */}
                                    <div className="flex bg-white/5 rounded-lg p-1">
                                        <button
                                            onClick={() => setDevicePreview('desktop')}
                                            className={`p-1.5 rounded ${devicePreview === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                                        >
                                            <Monitor size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDevicePreview('mobile')}
                                            className={`p-1.5 rounded ${devicePreview === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                                        >
                                            <Smartphone size={14} />
                                        </button>
                                    </div>
                                    {/* Play/Pause */}
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="p-1.5 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPreview ? <Pause size={14} /> : <Play size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Mock Website */}
                            <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 min-h-[450px] transition-all ${devicePreview === 'mobile' ? 'max-w-sm mx-auto' : ''
                                }`}>
                                {/* Fake website content */}
                                <div className="p-6 opacity-30">
                                    <div className="h-4 bg-white/20 rounded w-1/4 mb-6" />
                                    <div className="h-32 bg-white/10 rounded-lg mb-6" />
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="h-24 bg-white/10 rounded-lg" />
                                        <div className="h-24 bg-white/10 rounded-lg" />
                                        <div className="h-24 bg-white/10 rounded-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-white/10 rounded w-full" />
                                        <div className="h-3 bg-white/10 rounded w-4/5" />
                                        <div className="h-3 bg-white/10 rounded w-3/5" />
                                    </div>
                                </div>

                                {/* Popup Preview */}
                                {showPreview && (
                                    <div
                                        className={`absolute p-4 transition-all duration-300 ${config.position === 'center' ? 'inset-0 flex items-center justify-center' :
                                                config.position === 'bottom-right' ? 'bottom-4 right-4' :
                                                    'bottom-4 left-4'
                                            } ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
                                    >
                                        <div
                                            className={`${config.position === 'center' ? 'w-full max-w-sm' : 'w-72'} bg-gradient-to-br ${currentStyle.bg} backdrop-blur-xl border ${currentStyle.border} rounded-2xl p-5 shadow-2xl`}
                                        >
                                            {/* Close Button */}
                                            <button className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>

                                            {/* Discount Badge */}
                                            <div className={`inline-block ${currentStyle.badge} text-white text-xs font-black px-3 py-1 rounded-full mb-3`}>
                                                {config.discount}
                                            </div>

                                            {/* Headline */}
                                            <h4 className="text-lg font-black text-white mb-2 leading-tight pr-6">
                                                {config.headline || 'Başlık yaz...'}
                                            </h4>

                                            {/* Subtext */}
                                            <p className="text-sm text-slate-300 mb-4">
                                                {config.subtext || 'Alt metin yaz...'}
                                            </p>

                                            {/* Email Input */}
                                            <div className="mb-3">
                                                <input
                                                    type="email"
                                                    placeholder="E-posta adresin"
                                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 text-sm"
                                                    disabled
                                                />
                                            </div>

                                            {/* CTA Button */}
                                            <button className={`w-full py-2.5 bg-gradient-to-r ${currentStyle.button} ${config.style === 'minimal' ? 'text-black' : 'text-white'} font-bold rounded-lg transition-all hover:scale-[1.02] text-sm`}>
                                                {config.buttonText || 'Buton'}
                                            </button>

                                            {/* Trust */}
                                            <p className="text-[10px] text-slate-500 text-center mt-3">
                                                🔒 Spam yok, istediğin zaman çık
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Trigger Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-[10px] text-slate-400 flex items-center gap-2">
                                    {config.trigger === 'time' && (
                                        <><Clock size={12} className="text-purple-400" /> {config.delay}sn sonra gösterilecek</>
                                    )}
                                    {config.trigger === 'exit' && (
                                        <><MousePointer size={12} className="text-purple-400" /> Çıkış niyetinde gösterilecek</>
                                    )}
                                    {config.trigger === 'scroll' && (
                                        <><Eye size={12} className="text-purple-400" /> %50 scroll'da gösterilecek</>
                                    )}
                                </div>
                            </div>

                            {/* CTA Footer */}
                            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-slate-400">
                                        <span className="text-white font-bold">Beğendin mi?</span> Hesap oluştur ve kullanmaya başla
                                    </p>
                                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg text-sm hover:scale-105 transition-transform flex items-center gap-2">
                                        Ücretsiz Başla
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
