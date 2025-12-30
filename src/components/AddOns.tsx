import React from 'react';
import { Palette, BarChart3, Users, Sparkles } from 'lucide-react';

export default function AddOns() {
    const addons = [
        {
            icon: <Palette size={24} className="text-purple-400" />,
            name: "Özel Tasarım Paketi",
            price: "₺499",
            type: "tek seferlik",
            desc: "Marka kimliğinize özel 5 kampanya tasarımı. Profesyonel tasarımcılar tarafından."
        },
        {
            icon: <BarChart3 size={24} className="text-emerald-400" />,
            name: "Premium Analytics",
            price: "₺99",
            type: "/ay",
            desc: "Detaylı raporlar, funnel analizi, cohort takibi. Google Analytics entegrasyonu dahil."
        },
        {
            icon: <Users size={24} className="text-blue-400" />,
            name: "Özel Onboarding",
            price: "₺299",
            type: "tek seferlik",
            desc: "1 saatlik zoom call + ilk kampanyaları birlikte kuruyoruz. Garantili sonuç stratejisi."
        },
        {
            icon: <Sparkles size={24} className="text-yellow-400" />,
            name: "AI Metin Asistanı",
            price: "₺149",
            type: "/ay",
            desc: "Yapay zeka ile dönüşüm odaklı pop-up metinleri. A/B test önerileri dahil."
        }
    ];

    return (
        <section className="py-16 px-6 border-y border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                        Ekstra Güç Katın
                    </h3>
                    <p className="text-slate-400">
                        İsteğe bağlı ek hizmetlerle dönüşümünüzü maksimuma çıkarın
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {addons.map((addon, idx) => (
                        <div
                            key={idx}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                {addon.icon}
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{addon.name}</h4>
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-2xl font-black text-brand-orange">{addon.price}</span>
                                <span className="text-xs text-slate-500">{addon.type}</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{addon.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
