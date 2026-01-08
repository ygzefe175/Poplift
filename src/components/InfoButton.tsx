"use client";

import { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function InfoButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Info Button (Top Left) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-50 p-2.5 bg-[#1C1C1E]/80 hover:bg-[#2C2C2E] text-slate-400 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 group shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                title="PopLift Nedir?"
            >
                <Info size={22} className="group-hover:text-purple-400 transition-colors" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-[#151518] border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Content */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                                    <span className="text-2xl font-black text-white">P</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">PopLift Nedir?</h2>
                                    <p className="text-purple-400 text-sm font-medium">Akıllı Dönüşüm Optimizasyon Yazılımı</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-slate-300 leading-relaxed text-base md:text-lg">
                                <p>
                                    <strong className="text-white">Poplift</strong>, e-ticaret sitelerinden alışveriş yapmadan ayrılan ziyaretçileri geri kazanmak için geliştirilmiş akıllı bir teknolojidir.
                                </p>

                                <p>
                                    Sistem, kullanıcıların fare hareketlerini ve site içi davranışlarını analiz ederek <span className="text-white font-medium border-b border-purple-500/50">çıkış niyetini anlık olarak tespit eder</span> ve doğru zamanda özel teklifler sunar.
                                </p>

                                <p className="text-sm md:text-base text-slate-400 bg-white/5 p-4 rounded-xl border border-white/5">
                                    💡 Teknik bilgi gerektirmeyen hızlı kurulum süreci sayesinde işletmeler, indirim kuponları veya oyunlaştırılmış pop-up’lar aracılığıyla satışlarını ortalama <strong className="text-emerald-400">%27 oranında artırabilirler.</strong>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
                                    <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                                        🚀 Neler Yapabilirsin?
                                    </h3>
                                    <ul className="text-slate-400 text-xs space-y-2">
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full" /> Gerçek zamanlı performans takibi</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full" /> E-posta listesi büyütme</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full" /> Otomatik yanıtlayıcı sistemi</li>
                                    </ul>
                                </div>
                                <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10">
                                    <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                                        💎 Yerli ve Güçlü
                                    </h3>
                                    <ul className="text-slate-400 text-xs space-y-2">
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full" /> Site hızını etkilemeyen düşük boyut</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full" /> Yerli ödeme sistemleri</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full" /> Tam Türkçe destek</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
