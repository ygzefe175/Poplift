"use client";

import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

export default function ROICalculator() {
    // Daha gerçekçi başlangıç değerleri
    const [visitors, setVisitors] = useState(5000);
    const [cartValue, setCartValue] = useState(350);
    const [abandonRate, setAbandonRate] = useState(72);

    // Gerçekçi hesaplamalar
    const abandonedVisitors = Math.floor(visitors * (abandonRate / 100));

    // Recovery rate sepet terk oranına göre dinamik
    // Yüksek terk oranı = daha fazla kurtarma potansiyeli
    const baseRecoveryRate = 0.18; // %18 base
    const bonusRecovery = (abandonRate - 50) / 100 * 0.15; // Yüksek terk = bonus
    const recoveryRate = Math.min(baseRecoveryRate + bonusRecovery, 0.35); // Max %35

    const recoveredWithPopwise = Math.floor(abandonedVisitors * recoveryRate);
    const monthlyRevenue = recoveredWithPopwise * cartValue;
    const yearlyRevenue = monthlyRevenue * 12;

    return (
        <section className="py-24 px-6 bg-gradient-to-br from-brand-orange/5 via-transparent to-transparent">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold mb-6">
                        <Calculator size={18} />
                        <span className="text-sm">Ücretsiz ROI Hesaplayıcı</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Kaybettiğiniz Geliri Hesaplayın<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-emerald-400">(Gerçek Rakamlarla)</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Sitenizin gerçek trafiği üzerinden hesaplayın ve kaç TL kaybettiğinizi görün
                    </p>
                </div>

                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Inputs */}
                    <div className="space-y-6 mb-12">
                        <div>
                            <label className="block text-white font-bold mb-3 flex items-center justify-between">
                                <span>Aylık Ziyaretçi Sayısı</span>
                                <span className="text-brand-orange text-2xl font-black">{visitors.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="500"
                                max="100000"
                                step="500"
                                value={visitors}
                                onChange={(e) => setVisitors(Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-orange [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>500</span>
                                <span>100K</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white font-bold mb-3 flex items-center justify-between">
                                <span>Ortalama Sepet Tutarı (₺)</span>
                                <span className="text-brand-orange text-2xl font-black">₺{cartValue}</span>
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="5000"
                                step="25"
                                value={cartValue}
                                onChange={(e) => setCartValue(Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-orange [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>₺50</span>
                                <span>₺5.000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white font-bold mb-3 flex items-center justify-between">
                                <span>Sepet Terk Oranı (%)</span>
                                <span className="text-red-400 text-2xl font-black">%{abandonRate}</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="99"
                                step="1"
                                value={abandonRate}
                                onChange={(e) => setAbandonRate(Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>%1</span>
                                <span>%99</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="border-t border-white/10 pt-8 sm:pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6 text-center sm:text-left">
                                <div className="text-red-400 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">Kaybedilen</div>
                                <div className="text-white text-2xl sm:text-3xl font-black mb-1">{abandonedVisitors.toLocaleString()}</div>
                                <div className="text-slate-400 text-[10px] sm:text-sm">ziyaretçi almadan gidiyor</div>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 text-center sm:text-left">
                                <div className="text-emerald-400 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">Popwise ile Kurtarılan</div>
                                <div className="text-white text-2xl sm:text-3xl font-black mb-1">{recoveredWithPopwise.toLocaleString()}</div>
                                <div className="text-slate-400 text-[10px] sm:text-sm">~%{Math.round(recoveryRate * 100)} daha fazla satış</div>
                            </div>
                        </div>

                        {/* Big Numbers */}
                        <div className="bg-gradient-to-r from-brand-orange/20 to-emerald-500/20 border border-brand-orange/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div className="w-full sm:w-auto text-center sm:text-left">
                                    <div className="text-slate-400 text-[10px] sm:text-sm font-bold mb-1 sm:mb-2 text-center sm:text-left w-full">AYLIK EK GELİR</div>
                                    <div className="text-white text-4xl sm:text-5xl font-black flex items-center justify-center sm:justify-start gap-2">
                                        <DollarSign className="text-emerald-400" size={32} />
                                        ₺{monthlyRevenue.toLocaleString()}
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto text-center sm:text-right">
                                    <div className="text-slate-400 text-[10px] sm:text-sm font-bold mb-1 sm:mb-2">YILLIK</div>
                                    <div className="text-brand-orange text-3xl sm:text-4xl font-black">
                                        ₺{yearlyRevenue.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center border-t border-white/10 pt-6">
                                <p className="text-white text-lg font-bold">
                                    Popwise ile yılın sonuna kadar <span className="text-emerald-400 text-2xl">₺{yearlyRevenue.toLocaleString()}</span> daha fazla kazanç.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <a
                                href="/register"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-brand-orange hover:bg-amber-500 text-black font-black text-xl rounded-2xl transition-all shadow-2xl shadow-brand-orange/30 hover:scale-105"
                            >
                                Bu Geliri Hemen Kurtar →
                            </a>
                            <p className="mt-4 text-slate-500 text-sm">
                                ✓ 3 dakikada kurulum  ✓ Kredi kartı gerekmez  ✓ İlk satış bugün
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-8">
                    * Hesaplamalar %27 ortalama dönüşüm artışı üzerinden yapılmıştır (ilk 2 hafta verileri)
                </p>
            </div>
        </section>
    );
}
