"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, HelpCircle, Zap, CreditCard, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const categories = [
        { id: "all", name: "Tümü", icon: HelpCircle },
        { id: "genel", name: "Genel", icon: Zap },
        { id: "fiyat", name: "Fiyatlandırma", icon: CreditCard },
        { id: "teknik", name: "Teknik", icon: Settings },
        { id: "guvenlik", name: "Güvenlik", icon: Shield },
    ];

    const faqs: FAQItem[] = [
        {
            category: "genel",
            question: "Poplift nedir ve nasıl çalışır?",
            answer: "Poplift, web sitenize akıllı pop-up'lar eklemenizi sağlayan bir SaaS platformudur. Ziyaretçilerinizi müşteriye dönüştürmek için exit-intent, scroll-based ve time-based tetikleyiciler kullanır. Tek satır kod ile sitenize entegre edebilirsiniz."
        },
        {
            category: "genel",
            question: "Poplift'ı hangi platformlarda kullanabilirim?",
            answer: "Poplift, WordPress, Shopify, Wix, Squarespace, Next.js, React ve tüm HTML tabanlı web sitelerinde çalışır. Herhangi bir web sitesine tek satır JavaScript kodu ekleyerek kullanabilirsiniz."
        },
        {
            category: "genel",
            question: "Kurulum ne kadar sürer?",
            answer: "Kurulum sadece 3 dakika sürer. Hesap oluşturduktan sonra size verilen kodu sitenize yapıştırmanız yeterli. Teknik bilgi gerektirmez."
        },
        {
            category: "fiyat",
            question: "Ücretsiz plan gerçekten ücretsiz mi?",
            answer: "Evet! Başlangıç planımız tamamen ücretsizdir ve kredi kartı gerektirmez. Ayda 500 gösterim, 3 aktif pop-up ve 1 web sitesi ile başlayabilirsiniz."
        },
        {
            category: "fiyat",
            question: "Profesyonel plan tek seferlik mi?",
            answer: "Evet, Profesyonel plan ₺499 tek seferlik ödemedir. Bir kez ödeyip ömür boyu kullanabilirsiniz. Aylık veya yıllık abonelik yoktur."
        },
        {
            category: "fiyat",
            question: "İade politikanız nedir?",
            answer: "Tüm ücretli planlarımızda 14 gün para iade garantisi sunuyoruz. Herhangi bir sebepten memnun kalmazsanız, 14 gün içinde tam iade alabilirsiniz."
        },
        {
            category: "fiyat",
            question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
            answer: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler güvenli şekilde işlenir."
        },
        {
            category: "teknik",
            question: "Pop-up'lar sitemin hızını etkiler mi?",
            answer: "Hayır. Poplift script'i asenkron olarak yüklenir ve sadece 10KB boyutundadır. Sitenizin performansını etkilemez ve Core Web Vitals skorlarınızı düşürmez."
        },
        {
            category: "teknik",
            question: "Mobil cihazlarda çalışır mı?",
            answer: "Evet! Tüm pop-up'larımız mobil uyumludur ve her ekran boyutuna otomatik olarak uyum sağlar."
        },
        {
            category: "teknik",
            question: "A/B testi yapabilir miyim?",
            answer: "Pro ve Growth planlarında A/B testi özelliği mevcuttur. Farklı tasarımları ve mesajları test ederek en yüksek dönüşüm oranını yakalayabilirsiniz."
        },
        {
            category: "guvenlik",
            question: "Verilerim güvende mi?",
            answer: "Evet. Tüm veriler 256-bit SSL şifreleme ile korunur. KVKK ve GDPR uyumlu çalışıyoruz. Verileriniz Türkiye'deki sunucularda saklanır."
        },
        {
            category: "guvenlik",
            question: "KVKK uyumlu musunuz?",
            answer: "Evet, Poplift tamamen KVKK uyumludur. Ayrıntılar için KVKK Aydınlatma Metni sayfamızı inceleyebilirsiniz."
        },
    ];

    const filteredFAQs = activeCategory === "all"
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <main className="min-h-screen bg-[#000212] font-sans selection:bg-brand-orange/30">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-orange text-sm font-bold mb-6">
                        <HelpCircle size={16} />
                        Sıkça Sorulan Sorular
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Aklınızdaki Tüm Soruların<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-200">Cevabı Burada</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Poplift hakkında merak ettiklerinizi bulun. Sorunuz burada yoksa bize ulaşın.
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="px-6 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.id
                                        ? 'bg-brand-orange text-black'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                <cat.icon size={16} />
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Items */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4"
                            >
                                <span className="text-white font-bold">{faq.question}</span>
                                <ChevronDown
                                    size={20}
                                    className={`text-brand-orange transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-brand-orange/10 to-indigo-600/10 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                        Sorunuz hala cevapsız mı?
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Ekibimiz size yardımcı olmaktan mutluluk duyar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-brand-orange text-black font-bold rounded-xl hover:bg-amber-500 transition-all"
                        >
                            Ücretsiz Deneyin
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Fiyatları İncele
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
