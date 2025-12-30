import React from 'react';
import { Users, MousePointer2, Mail, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: <Users size={32} className="text-blue-400" />,
            title: "Ziyaretçi Gelir",
            desc: "Kullanıcı sitenize girer, ürünlere bakar ama sepete eklemeden ayrılmak üzere."
        },
        {
            icon: <MousePointer2 size={32} className="text-brand-orange" />,
            title: "Akıllı Algılama",
            desc: "Fare hareketi veya scroll davranışı analizlenir. Çıkış niyeti tespit edilir."
        },
        {
            icon: <Mail size={32} className="text-purple-400" />,
            title: "Son Şans Teklifi",
            desc: "Tam çıkacakken özel bir pop-up gösterilir: indirim kodu, ücretsiz kargo vb."
        },
        {
            icon: <TrendingUp size={32} className="text-emerald-400" />,
            title: "Dönüşüm Gerçekleşir",
            desc: "Ziyaretçi teklife göz atır, ikna olur ve sepete ürün ekler. Kayıp önlenir."
        }
    ];

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Nasıl Çalışır?</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        4 Adımda Kayıp Önleme
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Popwise, ziyaretçi davranışını gerçek zamanlı takip eder ve tam çıkış anında devreye girer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative">
                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-brand-orange/50 to-transparent -translate-x-1/2 z-0" />
                            )}
                            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-all hover:-translate-y-1 z-10">
                                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                    {step.icon}
                                </div>
                                <div className="text-brand-orange font-black text-xs mb-2">ADIM {idx + 1}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">
                        ⚡ Ortalama tespit süresi: <span className="text-white font-bold">0.3 saniye</span> ·
                        Başarı oranı: <span className="text-emerald-400 font-bold">%27+</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
