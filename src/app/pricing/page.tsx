"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import { Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#000212] font-sans selection:bg-brand-orange/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-6 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-orange text-sm font-bold mb-6 animate-fade-in">
                        <Sparkles size={16} /> 14 Gün Ücretsiz Deneme
                    </div>
                </div>
            </section>

            {/* Pricing Component */}
            <Pricing />

            {/* FAQ Teaser */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto mt-4 text-center">
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Hala Kararsız mısınız?</h2>
                    <p className="text-slate-400 mb-8 font-medium">Binlerce mutlu müşteri yanılıyor olamaz. Ücretsiz başlayın, farkı görün.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/faq" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-colors">
                            <HelpCircle size={20} /> Sıkça Sorulan Sorular
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
