"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Book, Code, Terminal, Zap, Puzzle, ChevronRight } from 'lucide-react';

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 mt-12">

                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-32">
                        <div className="mb-6">
                            <h3 className="font-bold text-white mb-4 px-3 flex items-center gap-2">
                                <Book size={18} className="text-brand-orange" /> Dokümantasyon
                            </h3>
                            <nav className="space-y-1">
                                <a href="#introduction" className="block px-3 py-2 rounded-lg bg-white/5 text-brand-orange font-bold text-sm">Giriş</a>
                                <a href="#installation" className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Kurulum</a>
                                <a href="#campaigns" className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Kampanya Oluşturma</a>
                                <a href="#settings" className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Ayarlar</a>
                            </nav>
                        </div>

                        <div>
                            <h3 className="font-bold text-white mb-4 px-3 flex items-center gap-2">
                                <Terminal size={18} className="text-blue-400" /> Geliştirici
                            </h3>
                            <nav className="space-y-1">
                                <a href="#api" className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">API Referansı</a>
                                <a href="#webhooks" className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Webhooks</a>
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">

                    {/* Introduction */}
                    <section id="introduction" className="mb-16 animate-fade-in text-white/90">
                        <h1 className="text-4xl font-black text-white mb-6">Poplift'a Hoş Geldiniz</h1>
                        <p className="text-lg text-slate-400 leading-relaxed mb-6">
                            Poplift, web sitenizi terk eden ziyaretçileri müşteriye dönüştürmenize yardımcı olan güçlü bir optimizasyon aracıdır.
                            Bu rehberde, hesabınızı nasıl kuracağınızı ve ilk kampanyanızı nasıl oluşturacağınızı öğreneceksiniz.
                        </p>
                        <div className="bg-gradient-to-r from-brand-orange/10 to-transparent border-l-4 border-brand-orange p-6 rounded-r-xl">
                            <h4 className="font-bold text-brand-orange mb-2 flex items-center gap-2"><Zap size={18} /> Hızlı Başlangıç</h4>
                            <p className="text-sm text-slate-400">
                                Kaydolduktan sonra Dashboard üzerindeki <strong>"Hızlı Başlangıç Rehberi"</strong>ni takip ederek 5 dakika içinde yayına girebilirsiniz.
                            </p>
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm font-bold">01</span>
                            Kurulum
                        </h2>
                        <p className="text-slate-400 mb-6">
                            Poplift'ı sitenize entegre etmek için tek yapmanız gereken size verilen Pixel kodunu sitenizin <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono text-sm">&lt;head&gt;</code> alanına eklemektir.
                        </p>

                        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl overflow-hidden mb-6">
                            <div className="bg-[#0F1117] px-4 py-2 border-b border-white/5 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                                <span className="text-xs text-slate-500 font-mono ml-2">index.html</span>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <pre className="text-sm font-mono text-blue-300">
                                    {`<!-- Poplift Pixel Code -->
<script src="YOUR_POPWISE_URL/api/pixel?id=YOUR_USER_ID" async></script>
<!-- End Poplift Pixel Code -->`}
                                </pre>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4">Platform Bazlı Kurulumlar</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="#" className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-orange/30 hover:bg-white/10 transition-all group">
                                <span className="font-bold text-slate-300 group-hover:text-white">Wordpress</span>
                                <ChevronRight className="text-slate-500 group-hover:text-brand-orange" size={16} />
                            </a>
                            <a href="#" className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-orange/30 hover:bg-white/10 transition-all group">
                                <span className="font-bold text-slate-300 group-hover:text-white">Shopify</span>
                                <ChevronRight className="text-slate-500 group-hover:text-brand-orange" size={16} />
                            </a>
                        </div>
                    </section>

                    {/* Campaigns */}
                    <section id="campaigns" className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-bold">02</span>
                            Kampanyalar
                        </h2>
                        <p className="text-slate-400 mb-6">
                            3 farklı kampanya türünden birini seçerek ziyaretçilerinizi yakalayın.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-white/10">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Puzzle size={18} className="text-brand-orange" /> Standart Pop-up</h4>
                                <p className="text-sm text-slate-400">Klasik görsel ve metin içeren pop-up. Genel duyurular için idealdir.</p>
                            </div>
                            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-white/10">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Zap size={18} className="text-red-500" /> Aciliyet (FOMO)</h4>
                                <p className="text-sm text-slate-400">Geri sayım sayacı içerir. Sınırlı süreli teklifler için kullanın.</p>
                            </div>
                            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-white/10">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Code size={18} className="text-purple-500" /> Hediye Modu</h4>
                                <p className="text-sm text-slate-400">Kullanıcıya özel bir hediye sunar. E-posta toplamak için en iyisidir.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
