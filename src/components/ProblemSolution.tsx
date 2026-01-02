"use client";

import React from 'react';
import { TrendingDown, AlertCircle, ArrowRight, Sparkles, Code, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ProblemSolution() {
    return (
        <div className="w-full">
            {/* PROBLEM Section - Dark/Red Theme */}
            <section className="py-24 px-6 bg-gradient-to-br from-red-950/30 via-[#0F1117] to-[#0F1117] border-y border-red-500/10">
                <div className="max-w-6xl mx-auto">
                    {/* Shocking Stat */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold mb-8">
                            <AlertCircle size={20} />
                            <span className="text-sm uppercase tracking-wider">Gerçek</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            Ziyaretçilerin <span className="text-red-500">%93'ü</span>
                            <br />
                            Almadan Gidiyor
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Binlerce lira reklam harcıyorsun. Ziyaretçi geliyor ama <span className="text-white font-bold">%93'ü sepetini boş bırakıp çıkıyor</span>.
                            <br />Tüm emek, para ve zaman <span className="text-red-400 font-bold">boşa gidiyor</span>.
                        </p>
                    </div>

                    {/* Journey Visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="relative">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                                <div className="text-6xl mb-4">😊</div>
                                <h3 className="text-white font-bold text-lg mb-2">İlgili Ziyaretçi</h3>
                                <p className="text-slate-400 text-sm">Sitene geliyor, ürünlere bakıyor</p>
                                <div className="mt-4 text-emerald-400 font-bold text-2xl">100%</div>
                            </div>
                            <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-slate-600" size={32} />
                        </div>

                        <div className="relative">
                            <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-8 text-center">
                                <div className="text-6xl mb-4">🤔</div>
                                <h3 className="text-white font-bold text-lg mb-2">Kararsız Kalıyor</h3>
                                <p className="text-slate-400 text-sm">"Sonra alırım" diyor, ekliyor ama...</p>
                                <div className="mt-4 text-amber-400 font-bold text-2xl">%93</div>
                            </div>
                            <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-slate-600" size={32} />
                        </div>

                        <div>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-red-400 font-bold text-lg mb-2">Almadan Çıkıyor</h3>
                                <p className="text-slate-400 text-sm">Bir daha geri gelmiyor</p>
                                <div className="mt-4 text-red-500 font-bold text-2xl flex items-center justify-center gap-2">
                                    <TrendingDown size={24} />
                                    KAYIP
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pain Points */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/30 border border-red-500/20 rounded-xl p-6">
                            <div className="text-red-400 font-black text-3xl mb-2">₺12.500</div>
                            <p className="text-slate-400 text-sm">Aylık reklam bütçesi <span className="text-red-400 font-bold">boşa gidiyor</span></p>
                        </div>
                        <div className="bg-black/30 border border-red-500/20 rounded-xl p-6">
                            <div className="text-red-400 font-black text-3xl mb-2">%7</div>
                            <p className="text-slate-400 text-sm">Sadece <span className="text-white font-bold">7 kişiden 100</span> satın alıyor</p>
                        </div>
                        <div className="bg-black/30 border border-red-500/20 rounded-xl p-6">
                            <div className="text-red-400 font-black text-3xl mb-2">0</div>
                            <p className="text-slate-400 text-sm">İkinci şans yok, <span className="text-white font-bold">kayıp müşteri</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION Section - Bright/Green Theme */}
            <section className="py-24 px-6 bg-gradient-to-br from-emerald-950/20 via-[#0F1117] to-[#0F1117]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-8">
                            <Sparkles size={20} />
                            <span className="text-sm uppercase tracking-wider">Çözüm</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            Gidene <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-emerald-400">Neden Ver</span>
                            <br />
                            <span className="text-3xl md:text-5xl text-slate-400">bugün alması için</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Poplift, tam çıkacakken ziyaretçine <span className="text-brand-orange font-bold">cayamayacağı bir teklif sunar</span>.
                            <br />Sonuç: <span className="text-emerald-400 font-bold">%27 daha fazla satış</span>, aynı reklam bütçesiyle.
                        </p>
                    </div>

                    {/* 3-Step Process */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-brand-orange/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="text-brand-orange" size={24} />
                                <h3 className="text-white font-bold text-xl">Pop-Up Oluştur</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                2 dakikada hazır şablonlardan seç. "%10 indirim", "Ücretsiz kargo" gibi teklifler yaz.
                            </p>
                            <div className="text-xs text-slate-600 font-mono">⏱️ 2 dakika</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="text-blue-400" size={24} />
                                <h3 className="text-white font-bold text-xl">Sitene Ekle</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Tek satır kod kopyala-yapıştır. Hiç kodlama bilgisi gerekmez.
                            </p>
                            <div className="text-xs text-slate-600 font-mono">⏱️ 1 dakika</div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/[0.02] border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                                3
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="text-emerald-400" size={24} />
                                <h3 className="text-white font-bold text-xl">Satışları İzle</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Canlı dashboard'dan dönüşümleri gör. Ortalama %27 artış, ilk haftadan.
                            </p>
                            <div className="text-xs text-emerald-600 font-mono">📈 Anlık sonuç</div>
                        </div>
                    </div>

                    {/* Results Preview */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-brand-orange/10 border border-emerald-500/20 rounded-3xl p-12 text-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
                            <div>
                                <div className="text-emerald-400 font-black text-5xl mb-2">%27</div>
                                <p className="text-slate-300 font-bold">Dönüşüm Artışı</p>
                                <p className="text-slate-500 text-sm mt-1">İlk 2 haftada</p>
                            </div>
                            <div>
                                <div className="text-brand-orange font-black text-5xl mb-2">₺8.4K</div>
                                <p className="text-slate-300 font-bold">Ek Gelir / Ay</p>
                                <p className="text-slate-500 text-sm mt-1">Ortalama müşteri</p>
                            </div>
                            <div>
                                <div className="text-sky-400 font-black text-5xl mb-2">3dk</div>
                                <p className="text-slate-300 font-bold">Kurulum Süresi</p>
                                <p className="text-slate-500 text-sm mt-1">Kod bilgisi gereksiz</p>
                            </div>
                        </div>

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-brand-orange/30"
                        >
                            Hemen Başla - Ücretsiz <ArrowRight size={24} />
                        </Link>
                        <p className="mt-4 text-slate-500 text-sm font-medium">
                            ✓ Kredi kartı gerekmez  ✓ 3 pop-up ücretsiz  ✓ Anında kurulum
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
