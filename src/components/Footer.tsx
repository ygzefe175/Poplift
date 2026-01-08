"use client";

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Mail, Heart, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-20 border-t border-white/5 bg-[#000212] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 gap-12 flex flex-col relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 font-black text-2xl text-white tracking-tight mb-6 group">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                            </span>
                            Poplift
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                            Web sitenizi terk eden ziyaretçileri saniyeler içinde müşteriye dönüştüren, en kolay ve güçlü pop-up platformu.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://twitter.com/popliftapp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="https://linkedin.com/company/poplift"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:destek@poplift.com"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                aria-label="E-posta"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Ürün</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/demo" className="hover:text-brand-orange transition-colors flex items-center gap-1">Özellikler</Link></li>
                            <li><Link href="/pricing" className="hover:text-brand-orange transition-colors">Fiyatlandırma</Link></li>
                            <li><Link href="/demo" className="hover:text-brand-orange transition-colors">Canlı Demo</Link></li>
                            <li><Link href="/register" className="hover:text-brand-orange transition-colors">Şablonlar</Link></li>
                            <li>
                                <Link href="/site-analiz" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <Sparkles size={14} />
                                    Site Analiz <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">ÜCRETSİZ</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Kaynaklar</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/docs" className="hover:text-brand-orange transition-colors">Dokümantasyon</Link></li>
                            <li><Link href="/ai-content-generator" className="hover:text-brand-orange transition-colors flex items-center gap-1">AI İçerik Üretici <ExternalLink size={12} /></Link></li>
                            <li><Link href="/para-yonetimi" className="hover:text-purple-400 transition-colors">Para Koçu</Link></li>
                            <li><Link href="/ogrenci" className="hover:text-pink-400 transition-colors">Öğrenci Programı</Link></li>
                        </ul>
                    </div>

                    {/* Support & Legal Combined */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Destek & Yasal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/faq" className="hover:text-brand-orange transition-colors">Sıkça Sorulanlar</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-orange transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-orange transition-colors">Kullanım Şartları</Link></li>
                            <li><Link href="/kvkk" className="hover:text-brand-orange transition-colors">KVKK Aydınlatma</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="bg-gradient-to-r from-brand-orange/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-1">Dönüşüm İpuçları E-Bülteni</h4>
                        <p className="text-slate-400 text-sm">Haftalık e-ticaret ve dönüşüm optimizasyonu ipuçları alın.</p>
                    </div>
                    <form className="flex gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-[#0F1117] border border-white/10 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm"
                        />
                        <button type="submit" className="px-6 py-3 bg-brand-orange hover:bg-amber-500 text-black font-bold rounded-xl transition-all text-sm whitespace-nowrap">
                            Abone Ol
                        </button>
                    </form>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-slate-500 text-sm">© {currentYear} Poplift. Tüm hakları saklıdır.</p>
                        <p className="text-slate-600 text-xs flex items-center gap-1">
                            Türkiye'de 🇹🇷 <Heart size={12} className="text-red-500" fill="currentColor" /> ile tasarlandı
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Tüm sistemler çalışıyor</span>
                        </div>
                        <div className="text-slate-600 text-xs">
                            v1.2.0
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
