"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cookie, Calendar, Mail, Settings } from 'lucide-react';

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 mt-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold mb-6">
                        <Cookie size={16} />
                        <span className="text-sm">Çerez Politikası</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Çerez Politikası
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} />
                            Son Güncelleme: 31 Aralık 2024
                        </span>
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Çerez Nedir?</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza yerleştirilen
                            küçük metin dosyalarıdır. Bu dosyalar, sizi tanımamıza, tercihlerinizi hatırlamamıza ve
                            size daha iyi bir deneyim sunmamıza yardımcı olur.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Kullandığımız Çerez Türleri</h2>

                        <div className="space-y-6 mt-6">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-emerald-400 mb-2">🔒 Zorunlu Çerezler</h3>
                                <p className="text-slate-400 text-sm">
                                    Web sitemizin çalışması için gerekli çerezlerdir. Giriş yapmanızı, gezinmenizi ve
                                    güvenliğinizi sağlar. Bu çerezler olmadan site düzgün çalışmaz.
                                </p>
                                <div className="mt-3 text-xs text-slate-500">
                                    Örnek: session_id, csrf_token
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-blue-400 mb-2">📊 Analitik Çerezler</h3>
                                <p className="text-slate-400 text-sm">
                                    Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Hangi sayfaların
                                    popüler olduğunu ve kullanıcıların nereden geldiğini öğreniriz.
                                </p>
                                <div className="mt-3 text-xs text-slate-500">
                                    Örnek: _ga, _gid (Google Analytics)
                                </div>
                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-purple-400 mb-2">⚡ İşlevsel Çerezler</h3>
                                <p className="text-slate-400 text-sm">
                                    Tercihlerinizi hatırlamamızı sağlar. Dil tercihi, tema seçimi gibi ayarlarınızı kaydeder.
                                </p>
                                <div className="mt-3 text-xs text-slate-500">
                                    Örnek: user_preferences, theme
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-amber-400 mb-2">🎯 Pazarlama Çerezleri</h3>
                                <p className="text-slate-400 text-sm">
                                    Size ilginizi çekebilecek reklamlar göstermek için kullanılır. Üçüncü taraf
                                    reklamcılar tarafından da yerleştirilebilir.
                                </p>
                                <div className="mt-3 text-xs text-slate-500">
                                    Örnek: _fbp (Facebook Pixel)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Çerezleri Nasıl Yönetebilirsiniz?</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-colors">
                                <span className="text-white font-bold">Chrome</span>
                                <p className="text-slate-500 text-sm mt-1">Ayarlar → Gizlilik</p>
                            </a>
                            <a href="https://support.mozilla.org/kb/cookies" target="_blank" rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-colors">
                                <span className="text-white font-bold">Firefox</span>
                                <p className="text-slate-500 text-sm mt-1">Ayarlar → Gizlilik</p>
                            </a>
                            <a href="https://support.apple.com/guide/safari/manage-cookies" target="_blank" rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-colors">
                                <span className="text-white font-bold">Safari</span>
                                <p className="text-slate-500 text-sm mt-1">Ayarlar → Gizlilik</p>
                            </a>
                            <a href="https://support.microsoft.com/microsoft-edge/cookies" target="_blank" rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-colors">
                                <span className="text-white font-bold">Edge</span>
                                <p className="text-slate-500 text-sm mt-1">Ayarlar → Gizlilik</p>
                            </a>
                        </div>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Çerez Tercihleriniz</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Çerez tercihlerinizi istediğiniz zaman güncelleyebilirsiniz:
                        </p>
                        <button className="flex items-center gap-3 px-6 py-3 bg-brand-orange hover:bg-amber-500 text-black font-bold rounded-xl transition-colors">
                            <Settings size={18} />
                            Çerez Ayarlarını Yönet
                        </button>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">5. İletişim</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                        </p>
                        <div className="flex items-center gap-3 text-brand-orange">
                            <Mail size={18} />
                            <a href="mailto:hello@Poplift.com" className="hover:underline">hello@Poplift.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
