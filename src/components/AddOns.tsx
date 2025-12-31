import React from 'react';
import Link from 'next/link';
import { Palette, BarChart3, Users, Sparkles, ShoppingCart } from 'lucide-react';

export default function AddOns() {
    const addons = [
        {
            id: "tasarim",
            icon: <Palette size={24} className="text-purple-400" />,
            name: "Özel Tasarım Paketi",
            price: "₺499",
            type: "tek seferlik",
            typeLabel: "TEK SEFERLİK ÖDEME",
            isOneTime: true,
            desc: "Marka kimliğinize özel 5 kampanya tasarımı. Profesyonel tasarımcılar tarafından."
        },
        {
            id: "analytics",
            icon: <BarChart3 size={24} className="text-emerald-400" />,
            name: "Premium Analytics",
            price: "₺99",
            type: "/ay",
            typeLabel: "AYLIK ABONELİK",
            isOneTime: false,
            desc: "Detaylı raporlar, funnel analizi, cohort takibi. Google Analytics entegrasyonu dahil."
        },
        {
            id: "onboarding",
            icon: <Users size={24} className="text-blue-400" />,
            name: "Özel Onboarding",
            price: "₺299",
            type: "tek seferlik",
            typeLabel: "TEK SEFERLİK ÖDEME",
            isOneTime: true,
            desc: "1 saatlik zoom call + ilk kampanyaları birlikte kuruyoruz. Garantili sonuç stratejisi."
        },
        {
            id: "ai",
            icon: <Sparkles size={24} className="text-yellow-400" />,
            name: "AI Metin Asistanı",
            price: "₺149",
            type: "/ay",
            typeLabel: "AYLIK ABONELİK",
            isOneTime: false,
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
                    {addons.map((addon) => (
                        <div
                            key={addon.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-all flex flex-col"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                {addon.icon}
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{addon.name}</h4>

                            {/* Fiyat ve Tür - Belirgin Gösterim */}
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

                            {/* Satın Al Butonu */}
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

                {/* Açıklama Notu */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        💡 <span className="text-emerald-400">Tek seferlik</span> ürünler sadece bir kez ödenir.
                        <span className="text-blue-400"> Aylık abonelikler</span> her ay otomatik yenilenir.
                    </p>
                </div>
            </div>
        </section>
    );
}
