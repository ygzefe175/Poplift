import React from 'react';
import { Check, Zap, Palette, BarChart3, Users, Sparkles, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
    const plans = [
        {
            name: "Başlangıç",
            price: "₺0",
            period: "/ay",
            description: "Küçük siteler ve test için",
            features: [
                "1.000 görüntüleme/ay",
                "2 aktif kampanya",
                "Standart pop-up şablonları",
                "Email destek",
                "Temel analitikler",
                "Poplift branding"
            ],
            // Güncelleme: Gamification ve Oto E-mail excluded
            excluded: ["🎡 Gamification (Çarkıfelek)", "📧 Otomatik E-Posta", "Gelişmiş ROI Analizi"],
            cta: "Ücretsiz Başla",
            popular: false,
            link: "/register?plan=free"
        },
        {
            name: "Pro",
            price: "₺299",
            period: "/ay",
            description: "Büyüyen e-ticaret siteleri",
            features: [
                "25.000 görüntüleme/ay",
                "Sınırsız kampanya",
                "Tüm şablonlar + özel tasarım",
                // Güncelleme: Gamification ve Auto Email eklendi
                "🎡 Gamification (Çarkıfelek)",
                "📧 Otomatik E-Posta (Auto-Responder)",
                "Öncelikli destek",
                "Gelişmiş analitik",
                "A/B testing",
                "Branding kaldırma"
            ],
            cta: "Pro'ya Başla",
            popular: true, // Best Value
            link: "/register?plan=pro"
        },
        {
            name: "Growth",
            price: "₺799",
            period: "/ay",
            description: "Kurumsal ve yüksek trafik",
            features: [
                "Sınırsız görüntüleme",
                "Sınırsız kampanya",
                "Her şey dahil (Pro özellikleri)",
                "🎡 Gamification (Çarkıfelek)",
                "📧 Otomatik E-Posta",
                "📊 Gelişmiş ROI ve Kâr Analizi",
                "WhatsApp destek (7/24)",
                "Özel onboarding",
                "Dedicated hesap yöneticisi",
                "Multi-domain desteği"
            ],
            cta: "Growth'a Geç",
            popular: false,
            link: "/register?plan=growth",
            premium: true
        }
    ];

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Fiyatlandırma</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Her Büyüklükte İşletmeye Uygun Plan
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Ücretsiz başla, büyüdükçe upgrade et. Kredi kartı bilgisi istemiyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-3xl p-8 ${plan.popular
                                ? 'bg-gradient-to-b from-brand-orange/20 to-brand-orange/5 border-2 border-brand-orange'
                                : 'bg-white/5 border border-white/10'
                                } hover:-translate-y-2 transition-all`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-orange text-black text-xs font-black rounded-full flex items-center gap-1">
                                    <Zap size={12} /> EN POPÜLER
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className={`text-sm ${feature.includes('🎡') || feature.includes('📧') || feature.includes('📊') ? 'text-white font-bold' : 'text-slate-300'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Excluded features for free tier */}
                            {plan.excluded && (
                                <ul className="space-y-2 mb-6 pt-4 border-t border-white/5">
                                    {plan.excluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-slate-600 flex-shrink-0">✕</span>
                                            <span className="text-xs text-slate-500 line-through">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Link
                                href={plan.link}
                                className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${plan.popular
                                    ? 'bg-brand-orange hover:bg-amber-500 text-black shadow-lg hover:shadow-xl'
                                    : plan.premium
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* EKSTRA GÜÇ KATIN - Fiyatlandırma içinde */}
                <div className="mt-20 pt-16 border-t border-white/10">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                            Ekstra Güç Katın
                        </h3>
                        <p className="text-slate-400">
                            İsteğe bağlı ek hizmetlerle dönüşümünüzü maksimuma çıkarın
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                id: "tasarim",
                                icon: <Palette size={24} className="text-purple-400" />,
                                name: "Özel Tasarım Paketi",
                                price: "₺499",
                                type: "tek seferlik",
                                typeLabel: "TEK SEFERLİK ÖDEME",
                                isOneTime: true,
                                desc: "Marka kimliğinize özel 5 kampanya tasarımı."
                            },
                            {
                                id: "analytics",
                                icon: <BarChart3 size={24} className="text-emerald-400" />,
                                name: "Premium Analytics",
                                price: "₺399",
                                type: "/ay",
                                typeLabel: "AYLIK ABONELİK",
                                isOneTime: false,
                                desc: "Detaylı raporlar, funnel analizi, cohort takibi."
                            },
                            {
                                id: "onboarding",
                                icon: <Users size={24} className="text-blue-400" />,
                                name: "Özel Onboarding",
                                price: "₺299",
                                type: "tek seferlik",
                                typeLabel: "TEK SEFERLİK ÖDEME",
                                isOneTime: true,
                                desc: "1 saatlik zoom call + ilk kampanyaları kuruyoruz."
                            },
                            {
                                id: "ai",
                                icon: <Sparkles size={24} className="text-yellow-400" />,
                                name: "AI Metin Asistanı",
                                price: "₺99",
                                type: "/ay",
                                typeLabel: "AYLIK ABONELİK",
                                isOneTime: false,
                                desc: "Yapay zeka ile dönüşüm odaklı pop-up metinleri."
                            }
                        ].map((addon) => (
                            <div
                                key={addon.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-all flex flex-col"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                    {addon.icon}
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{addon.name}</h4>

                                <div className="mb-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-brand-orange">{addon.price}</span>
                                        <span className="text-xs text-slate-500">{addon.type}</span>
                                    </div>
                                    <div className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${addon.isOneTime
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {addon.typeLabel}
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 leading-relaxed flex-grow">{addon.desc}</p>

                                <Link
                                    href={`/register?addon=${addon.id}&price=${encodeURIComponent(addon.price)}&type=${addon.isOneTime ? 'onetime' : 'monthly'}`}
                                    className="mt-4 w-full py-2.5 px-4 bg-white/10 hover:bg-brand-orange hover:text-black border border-white/20 hover:border-brand-orange rounded-xl text-center text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={16} />
                                    Satın Al
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            💡 <span className="text-emerald-400">Tek seferlik</span> ürünler sadece bir kez ödenir.
                            <span className="text-blue-400"> Aylık abonelikler</span> her ay otomatik yenilenir.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">
                        Tüm planlarda 14 gün para iade garantisi · İstediğiniz zaman iptal edebilirsiniz
                    </p>
                </div>
            </div>
        </section>
    );
}
