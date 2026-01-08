"use client";

import React, { useState } from 'react';
import { Zap, Brain, BarChart3, Shield, Palette, Code, Disc3, Calculator, Mail, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Features() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const features = [
        {
            icon: <Brain size={28} className="text-purple-400" />,
            title: "Akıllı Tetikleyici",
            desc: "Fare hareketi, scroll derinliği ve sayfa süresini analiz ederek en uygun anı yakalar.",
            benefit: "→ Gereksiz pop-up rahatsızlığı yok, sadece çıkacak olanları hedefler",
            gradient: "from-purple-500/20 to-purple-500/5"
        },
        {
            icon: <Zap size={28} className="text-yellow-400" />,
            title: "Anında Kurulum",
            desc: "Tek satır JavaScript kodu ile tüm sitelerde çalışır. WordPress, Shopify, custom - hepsi.",
            benefit: "→ Teknik bilgi gerekmez, 3 dakikada aktif",
            gradient: "from-yellow-500/20 to-yellow-500/5"
        },
        {
            icon: <BarChart3 size={28} className="text-emerald-400" />,
            title: "Canlı Dashboard",
            desc: "Hangi pop-up kaç kez gösterildi, kaç kişi tıkladı, kaç satış oluştu - gerçek zamanlı izle.",
            benefit: "→ Veriye dayalı karar ver, tahmine değil",
            gradient: "from-emerald-500/20 to-emerald-500/5"
        },
        {
            icon: <Disc3 size={28} className="text-rose-400" />,
            title: "Gamification (Çarkıfelek)",
            desc: "Ziyaretçilere şans çarkı çevirterek e-posta toplama oranını %15'ten %35'e çıkarın. Sıkıcı pop-up'lar yerine oyunlaştırılmış deneyim.",
            benefit: "→ 2 kat fazla e-posta, eğlenceli kullanıcı deneyimi",
            badge: "PRO",
            gradient: "from-rose-500/20 to-rose-500/5"
        },
        {
            icon: <Calculator size={28} className="text-cyan-400" />,
            title: "Net Kâr & ROI Hesaplayıcı",
            desc: "Sadece ciroyu değil, net kârınızı görün. Ürün maliyeti ve reklam harcamasını girin, Poplift size gerçek kazancınızı hesaplasın.",
            benefit: "→ Gerçek karlılık analizi, şeffaf finansal görünüm",
            badge: "GROWTH",
            gradient: "from-cyan-500/20 to-cyan-500/5"
        },
        {
            icon: <Mail size={28} className="text-indigo-400" />,
            title: "Otomatik E-Posta",
            desc: "Yakaladığınız müşteriye anında 'Hoş geldin' veya 'İndirim Kuponu' mailini otomatik gönderin. Ekstra mail servisine gerek yok.",
            benefit: "→ Anında müşteri bağlılığı, manuel iş yükü sıfır",
            badge: "PRO",
            gradient: "from-indigo-500/20 to-indigo-500/5"
        },
        {
            icon: <Palette size={28} className="text-pink-400" />,
            title: "Sınırsız Özelleştirme",
            desc: "Marka renklerin, kendi metinlerin, istediğin butonlar. Hazır şablonlar veya sıfırdan tasarla.",
            benefit: "→ Sitenin kimliğine uyar, yabancı durmaz",
            gradient: "from-pink-500/20 to-pink-500/5"
        },
        {
            icon: <Shield size={28} className="text-blue-400" />,
            title: "GDPR & KVKK Uyumlu",
            desc: "Kullanıcı verisi toplamıyoruz, sadece davranış analizi. Çerez yok, gizlilik garantili.",
            benefit: "→ Yasal risk sıfır, müşteri güveni tam",
            gradient: "from-blue-500/20 to-blue-500/5"
        },
        {
            icon: <Code size={28} className="text-brand-orange" />,
            title: "Performans Dostu",
            desc: "8kb hafif kod, CDN üzerinden yüklenir. Google PageSpeed skorunuzu etkilemez.",
            benefit: "→ Hızlı site = daha fazla dönüşüm",
            gradient: "from-brand-orange/20 to-brand-orange/5"
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-1.5 mb-6">
                        <Zap size={14} className="text-brand-orange" />
                        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">Özellikler</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Neden <span className="text-gradient">Rakiplerden</span> Farklıyız?
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Sadece pop-up göstermiyoruz. Müşteri davranışını anlayıp doğru anda doğru teklifi sunuyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={clsx(
                                "relative bg-gradient-to-br border rounded-2xl p-8 transition-all duration-300 group cursor-pointer",
                                feature.gradient,
                                feature.badge === 'GROWTH'
                                    ? 'border-cyan-500/30 hover:border-cyan-500/50'
                                    : feature.badge === 'PRO'
                                        ? 'border-rose-500/30 hover:border-rose-500/50'
                                        : 'border-white/10 hover:border-white/20',
                                hoveredIndex === idx ? '-translate-y-2 shadow-2xl' : ''
                            )}
                        >
                            {/* Hover glow effect */}
                            <div className={clsx(
                                "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
                                hoveredIndex === idx ? "opacity-100" : "opacity-0"
                            )} style={{
                                background: `radial-gradient(600px at 50% 50%, rgba(245, 158, 11, 0.05), transparent 80%)`
                            }} />

                            {feature.badge && (
                                <div className={clsx(
                                    "absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1",
                                    feature.badge === 'GROWTH'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                )}>
                                    {feature.badge}
                                </div>
                            )}

                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                {feature.title}
                                <ChevronRight size={16} className={clsx(
                                    "text-slate-600 transition-all",
                                    hoveredIndex === idx ? "opacity-100 translate-x-0 text-brand-orange" : "opacity-0 -translate-x-2"
                                )} />
                            </h3>

                            <p className="text-sm text-slate-300 leading-relaxed mb-4">{feature.desc}</p>

                            <p className="text-xs text-brand-orange/80 leading-relaxed italic flex items-start gap-1">
                                <span className="mt-0.5">✦</span>
                                {feature.benefit.replace('→ ', '')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-500 mb-4">Ve daha fazlası...</p>
                    <a
                        href="/demo"
                        className="inline-flex items-center gap-2 text-brand-orange font-bold hover:underline group"
                    >
                        Tüm özellikleri keşfet
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}

