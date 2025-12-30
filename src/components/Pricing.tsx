import React from 'react';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "₺0",
            period: "/ay",
            description: "Küçük siteler ve test için",
            features: [
                "1.000 görüntüleme/ay",
                "2 aktif kampanya",
                "Temel şablonlar",
                "Email destek",
                "Temel analitikler"
            ],
            cta: "Hemen Başla",
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
                "Öncelikli destek",
                "Gelişmiş analitik",
                "A/B testing",
                "Özel tetikleyiciler",
                "API erişimi"
            ],
            cta: "Pro'ya Başla",
            popular: true,
            link: "/register?plan=pro"
        },
        {
            name: "Premium",
            price: "₺799",
            period: "/ay",
            description: "Kurumsal ve yüksek trafik",
            features: [
                "Sınırsız görüntüleme",
                "Sınırsız kampanya",
                "Her şey dahil",
                "Whatsapp destek (7/24)",
                "Özel onboarding",
                "Dedicated hesap yöneticisi",
                "Multi-domain desteği",
                "Özel entegrasyonlar"
            ],
            cta: "Premium'a Geç",
            popular: false,
            link: "/register?plan=premium"
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

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.link}
                                className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${plan.popular
                                        ? 'bg-brand-orange hover:bg-amber-500 text-black shadow-lg hover:shadow-xl'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
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
