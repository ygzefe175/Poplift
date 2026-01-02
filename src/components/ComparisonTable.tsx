"use client";

import React from 'react';
import { Check, X } from 'lucide-react';

interface Feature {
    name: string;
    Poplift: string | boolean;
    competitorA: string | boolean;
    competitorB: string | boolean;
}

export default function ComparisonTable() {
    const features: Feature[] = [
        { name: "Aylık Maliyet", Poplift: "₺0 - ₺799/ay", competitorA: "$19-79/ay", competitorB: "$15-95/ay" },
        { name: "Türkçe Panel", Poplift: true, competitorA: false, competitorB: false },
        { name: "Exit-Intent", Poplift: true, competitorA: true, competitorB: true },
        { name: "AI Optimizasyon", Poplift: true, competitorA: false, competitorB: false },
        { name: "Kurulum Süresi", Poplift: "3 dakika", competitorA: "15-30 dakika", competitorB: "10-20 dakika" },
        { name: "Müşteri Desteği", Poplift: "Türkçe / 7/24", competitorA: "İngilizce / Chat", competitorB: "İngilizce" },
        { name: "Branding Kaldırma", Poplift: "Pro ile dahil", competitorA: "$79/ay ile", competitorB: "$95/ay ile" },
        { name: "Mobil Uyumlu", Poplift: true, competitorA: true, competitorB: true },
        { name: "Sınırsız Gösterim", Poplift: "Growth ile", competitorA: "$79/ay ile", competitorB: "Sınırlı" },
        { name: "Yerli Ödeme", Poplift: true, competitorA: false, competitorB: false },
    ];

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Neden Rakiplerden Daha İyi?
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Aynı özellikleri daha uygun fiyata, Türkçe destek ve yerli ödeme seçenekleri ile sunuyoruz.
                    </p>
                </div>

                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-6 text-slate-400 font-bold text-sm">Özellik</th>
                                    <th className="p-6 text-center">
                                        <div className="bg-gradient-to-br from-brand-orange to-amber-500 text-black font-black px-4 py-2 rounded-xl inline-block">
                                            Poplift
                                        </div>
                                    </th>
                                    <th className="p-6 text-slate-400 font-bold text-sm text-center">Rakip Firma A</th>
                                    <th className="p-6 text-slate-400 font-bold text-sm text-center">Rakip Firma B</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-slate-300 font-medium">{feature.name}</td>
                                        <td className="p-6 text-center">
                                            {typeof feature.Poplift === 'boolean' ? (
                                                feature.Poplift ? (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                                                        <Check size={16} className="text-emerald-400" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                                                        <X size={16} className="text-red-400" />
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-white font-bold">{feature.Poplift}</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-center">
                                            {typeof feature.competitorA === 'boolean' ? (
                                                feature.competitorA ? (
                                                    <div className="w-6 h-6 rounded-full bg-slate-500/20 flex items-center justify-center mx-auto">
                                                        <Check size={16} className="text-slate-500" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                                                        <X size={16} className="text-red-400" />
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-slate-500 text-sm">{feature.competitorA}</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-center">
                                            {typeof feature.competitorB === 'boolean' ? (
                                                feature.competitorB ? (
                                                    <div className="w-6 h-6 rounded-full bg-slate-500/20 flex items-center justify-center mx-auto">
                                                        <Check size={16} className="text-slate-500" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                                                        <X size={16} className="text-red-400" />
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-slate-500 text-sm">{feature.competitorB}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-gradient-to-r from-brand-orange/10 to-transparent border-t border-white/10 text-center">
                        <p className="text-white font-bold text-lg mb-4">
                            Yabancı rakiplere yılda <span className="text-brand-orange">$500+</span> ödeyecekken,
                            <br />
                            Poplift ile <span className="text-brand-orange">₺0&apos;dan başla</span>, büyüdükçe upgrade et.
                        </p>
                        <a
                            href="/register"
                            className="inline-block px-8 py-3 bg-brand-orange hover:bg-amber-500 text-black font-bold rounded-xl transition-all"
                        >
                            Hemen Başla - Ücretsiz Dene
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
