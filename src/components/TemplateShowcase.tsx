import React from 'react';
import { ArrowRight, MousePointer2, Sparkles, Zap, Mail, Gift } from 'lucide-react';
import Link from 'next/link';

export default function TemplateShowcase() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Şablon Galerisi</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                        Tasarımla Vakit Kaybetmeyin.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Hazır Şablonu Seçin.</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        E-ticaret uzmanları tarafından tasarlanmış, dönüşüm garantili 50+ hazır şablon. Sürükle-bırak ile renkleri ve metinleri özelleştirin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* CARD 1: İndirim Kurgusu */}
                    <div className="group relative bg-[#0F1117] border border-white/10 rounded-3xl p-6 hover:border-brand-orange/30 transition-all hover:-translate-y-2 duration-300">
                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            En Popüler
                        </div>

                        {/* CSS Mockup Area */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-black rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5 group-hover:shadow-2xl transition-all">

                            {/* The Popup Mockup */}
                            <div className="w-48 bg-white rounded-lg shadow-xl p-4 transform group-hover:scale-105 transition-transform duration-500 relative">
                                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">×</div>
                                <div className="w-full h-24 bg-slate-100 rounded mb-3 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-orange-100 opacity-50"></div>
                                    <Gift className="text-brand-orange w-8 h-8" />
                                </div>
                                <div className="h-3 w-3/4 bg-slate-800 rounded mb-2"></div>
                                <div className="h-2 w-full bg-slate-200 rounded mb-1"></div>
                                <div className="h-2 w-1/2 bg-slate-200 rounded mb-3"></div>
                                <div className="w-full h-8 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">
                                    Kodu Al
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">İndirim Kurgusu</h3>
                        <p className="text-sm text-slate-400 mb-4">Klasik ama etkili. Ziyaretçiye indirim kodu sunarak satışı garanti altına alın.</p>

                        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-brand-orange transition-colors">
                            Bu Şablonu Kullan <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* CARD 2: Gamification (Çarkıfelek) */}
                    <div className="group relative bg-[#0F1117] border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-2 duration-300">
                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Yüksek Dönüşüm
                        </div>

                        {/* CSS Mockup Area */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-black rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5 group-hover:shadow-2xl transition-all">

                            {/* The Popup Mockup */}
                            <div className="w-56 bg-[#1a1b2e] rounded-xl shadow-xl p-0 overflow-hidden flex border border-white/10 transform group-hover:scale-105 transition-transform duration-500">
                                {/* Left: Wheel Half */}
                                <div className="w-24 bg-[#161726] relative overflow-hidden flex items-center justify-end">
                                    <div className="absolute -right-12 w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center animate-[spin_8s_linear_infinite]">
                                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#d97706_0deg_60deg,#a855f7_60deg_120deg,#ef4444_120deg_180deg,#d97706_180deg)] opacity-80"></div>
                                    </div>
                                    <div className="absolute right-0 w-3 h-4 bg-white clip-path-polygon absolute z-10"></div>
                                </div>
                                {/* Right: Content */}
                                <div className="flex-1 p-3 flex flex-col justify-center">
                                    <div className="h-3 w-full bg-slate-700 rounded mb-2 opacity-50"></div>
                                    <div className="h-2 w-3/4 bg-slate-800 rounded mb-3 opacity-30"></div>
                                    <div className="w-full h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded flex items-center justify-center text-[8px] text-white font-bold">
                                        Çevir & Kazan
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Gamification</h3>
                        <p className="text-sm text-slate-400 mb-4">Oyunlaştırma ile kullanıcıların mail bırakma oranını %40 artırın.</p>

                        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                            Bu Şablonu Kullan <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* CARD 3: Newsletter */}
                    <div className="group relative bg-[#0F1117] border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-2 duration-300">
                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Lead Gen
                        </div>

                        {/* CSS Mockup Area */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-black rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5 group-hover:shadow-2xl transition-all">

                            {/* The Popup Mockup */}
                            <div className="w-48 bg-white rounded-lg shadow-xl p-5 transform group-hover:scale-105 transition-transform duration-500 flex flex-col items-center text-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-500">
                                    <Mail size={14} />
                                </div>
                                <div className="h-3 w-3/4 bg-slate-800 rounded mb-2"></div>
                                <div className="h-2 w-full bg-slate-200 rounded mb-4"></div>

                                <div className="w-full h-7 border border-slate-200 rounded mb-2 flex items-center px-2">
                                    <div className="w-1/2 h-1.5 bg-slate-200 rounded"></div>
                                </div>
                                <div className="w-full h-7 bg-slate-900 rounded flex items-center justify-center text-[9px] text-white font-bold">
                                    Abone Ol
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Bülten Toplama</h3>
                        <p className="text-sm text-slate-400 mb-4">Blog okuyucularını veya ziyaretçileri sadık takipçilere dönüştürün.</p>

                        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            Bu Şablonu Kullan <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all text-sm">
                        <Layout size={16} />
                        Tüm Şablonları İncele (50+)
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Icon helper
function Layout({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
    )
}
