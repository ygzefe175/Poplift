"use client";

import React, { useState } from 'react';
import { ChevronDown, Shield, Zap, Check, Code } from 'lucide-react';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            icon: <Zap size={20} className="text-brand-orange" />,
            q: "Kurulum zor mu? Teknik bilgi gerekiyor mu?",
            a: "Hayır. Verdiğimiz tek satır kodu sitenize ekleyip kaydediyorsunuz. WordPress, Shopify, Wix, custom HTML - hepsinde çalışır. Ortalama kurulum süresi 3 dakika."
        },
        {
            icon: <Code size={20} className="text-emerald-400" />,
            q: "Ücretsiz deneme bitince ne olur?",
            a: "Hiçbir şey olmaz. Kredi kartı bilgisi istemiyoruz. Deneme süresi bittiğinde sadece yeni kampanya oluşturamazsınız, mevcut verilerinize erişim devam eder. Upgrade istediğiniz zaman yapabilirsiniz."
        },
        {
            icon: <Shield size={20} className="text-blue-400" />,
            q: "Sitemi yavaşlatır mı?",
            a: "Hayır. 8kb hafif kod Google PageSpeed skorunuzu %0.2 bile etkilemez. CDN üzerinden anında yüklenir, asenkron çalışır."
        },
        {
            icon: <Check size={20} className="text-purple-400" />,
            q: "GDPR ve KVKK uyumlu mu?",
            a: "Evet. Kullanıcı verisi toplamıyoruz, sadece davranış analizi yapıyoruz. Çerez kullanmıyoruz, kişisel veri saklamıyoruz. Tamamen uyumlu."
        },
        {
            icon: <Zap size={20} className="text-yellow-400" />,
            q: "İstediğim zaman iptal edebilir miyim?",
            a: "Evet. Aboneliğinizi dashboard'dan tek tıkla iptal edebilirsiniz. Kalan süre için para iadesi yapıyoruz (14 gün garantili)."
        },
        {
            icon: <Code size={20} className="text-pink-400" />,
            q: "Her siteye/platforma uyuyor mu?",
            a: "Evet. JavaScript çalıştıran her sitede çalışır: Shopify, WordPress, Wix, Squarespace, custom HTML, React, Next.js - hepsi desteklenir."
        },
        {
            icon: <Zap size={20} className="text-red-400" />,
            q: "Pop-up'lar ziyaretçileri rahatsız etmez mi?",
            a: "Klasik pop-up'lar evet ama Popwise farklı. Smart Intent 2.0 ile sadece sayfadan çıkmak üzere olanları yakalıyoruz. Normal gezinme deneyimi hiç bozulmuyor."
        },
        {
            icon: <Shield size={20} className="text-green-400" />,
            q: "Sonuç garantisi var mı?",
            a: "İlk 14 gün içinde dönüşüm artışı göremezseniz %100 para iade ediyoruz. Ortalama müşterilerimiz %27 artış görüyor ama her site farklı."
        }
    ];

    return (
        <section className="py-24 px-6 bg-[#0A0B14] border-y border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Sık Sorulan Sorular
                    </h2>
                    <p className="text-slate-400">
                        Aklınızdaki soru işaretlerini giderelim
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange/30 transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">{faq.icon}</div>
                                    <span className="text-white font-bold text-lg">{faq.q}</span>
                                </div>
                                <ChevronDown
                                    size={24}
                                    className={`text-slate-400 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 pt-2">
                                    <p className="text-slate-300 leading-relaxed pl-8">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
