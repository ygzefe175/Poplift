"use client";

import React, { useState } from 'react';
import { ChevronDown, Shield, Zap, Code, CreditCard, TrendingUp, Clock } from 'lucide-react';

const faqs = [
    {
        question: "Hiç kod bilgim yok, kurabilir miyim?",
        answer: "Kesinlikle! Sadece tek satır kodu kopyala-yapıştır yapmanız yeterli. WordPress, Shopify, WooCommerce veya özel sitenizde çalışır. 3 dakikada kurulum tamamlanır.",
        icon: Code,
        category: "teknik"
    },
    {
        question: "Ücretsiz plan gerçekten bedava mı? Gizli ücret var mı?",
        answer: "Evet, tamamen ücretsiz. 3 pop-up, aylık 1,000 gösterim sonsuza kadar ücretsiz. Kredi kartı bile istemiyoruz. Gizli ücret yok.",
        icon: CreditCard,
        category: "fiyat"
    },
    {
        question: "Mobilde de çalışıyor mu?",
        answer: "Evet! Pop-up'lar tüm cihazlarda (mobil, tablet, masaüstü) responsive olarak çalışır. Mobil için özel optimizasyon yapılmıştır.",
        icon: Zap,
        category: "teknik"
    },
    {
        question: "Sitemi yavaşlatır mı?",
        answer: "Hayır. Script sadece 12KB ve async yüklenir. Google PageSpeed skorunuzu etkilemez. 100+ sitede test edildi.",
        icon: TrendingUp,
        category: "performans"
    },
    {
        question: "Ne kadar sürede sonuç görürüm?",
        answer: "Çoğu müşterimiz ilk 48 saatte dönüşüm artışı görüyor. Exit-intent pop-up'ı kurduğunuz anda çalışmaya başlar.",
        icon: Clock,
        category: "sonuç"
    },
    {
        question: "Para iadesi garantisi var mı?",
        answer: "Evet! İlk 14 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz. %100 risk yok.",
        icon: Shield,
        category: "garanti"
    },
    {
        question: "Shopify/WooCommerce ile uyumlu mu?",
        answer: "Evet! Shopify, WooCommerce, WordPress, custom siteler - her platformda çalışır. Plugin gerektirmez, sadece kod ekleyin.",
        icon: Code,
        category: "entegrasyon"
    },
    {
        question: "Rakiplerden farkınız ne?",
        answer: "1) Aylık değil tek seferlik ödeme 2) Türkçe destek 3) %50 daha ucuz 4) AI optimizasyon 5) 3 dakikada kurulum",
        icon: Zap,
        category: "fark"
    },
    {
        question: "Kampanya sayımı artırırsam ne olur?",
        answer: "Ücretsiz planda 3 pop-up limiti var. Daha fazla için Pro plana (₺499 tek seferlik) geçebilirsiniz. Sınırsız pop-up sağlar.",
        icon: TrendingUp,
        category: "fiyat"
    },
    {
        question: "Destek alabilir miyim?",
        answer: "Evet! Email desteği tüm planlarda ücretsiz. Türkçe, 24 saat içinde yanıt garantisi. Pro planda öncelikli destek.",
        icon: Shield,
        category: "destek"
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-6">
                        <span className="text-sm">Sıkça Sorulan Sorular</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Aklındaki Soruların Cevapları
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Binlerce kullanıcının sorduğu 10 önemli soru
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 flex items-center justify-between text-left group"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${openIndex === index
                                        ? 'bg-brand-orange/20 text-brand-orange'
                                        : 'bg-white/5 text-slate-500 group-hover:text-white'
                                        }`}>
                                        <faq.icon size={20} />
                                    </div>
                                    <span className="text-white font-bold text-lg">{faq.question}</span>
                                </div>
                                <ChevronDown
                                    className={`text-slate-500 transition-transform flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180 text-brand-orange' : ''
                                        }`}
                                    size={24}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 pl-20">
                                    <p className="text-slate-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 mb-4">Başka sorun mu var?</p>
                    <a
                        href="mailto:hello@Poplift.com"
                        className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
                    >
                        Bize Yaz - hello@Poplift.com
                    </a>
                </div>
            </div>
        </section>
    );
}
