"use client";

import React, { useState } from 'react';
import { Lock, Crown, Sparkles, X, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * PremiumFeatureButton Component
 * Displays a locked button for premium features with explanatory popup
 */
interface PremiumFeatureButtonProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    planRequired: 'Pro' | 'Growth' | 'Öğrenci Pro';
    className?: string;
}

export function PremiumFeatureButton({
    icon,
    label,
    description,
    planRequired,
    className = ""
}: PremiumFeatureButtonProps) {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="relative">
            {/* Locked Button */}
            <button
                onClick={() => setShowPopup(true)}
                className={`relative flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all group ${className}`}
            >
                {/* Icon with lock overlay */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-500">
                        {icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                        <Lock size={10} className="text-slate-500" />
                    </div>
                </div>

                {/* Label */}
                <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <p className="text-[10px] text-slate-600">{planRequired} paketi gerekli</p>
                </div>

                {/* Premium Badge */}
                <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                    <Crown size={12} className="text-purple-400" />
                </div>
            </button>

            {/* Premium Popup */}
            {showPopup && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setShowPopup(false)}
                    />

                    {/* Popup */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-[#0A0B14] border border-white/10 rounded-2xl shadow-2xl z-50 animate-bounce-in">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                <Crown size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Premium Özellik</h3>
                            <p className="text-sm text-slate-400">
                                Bu özelliği kullanmak için <span className="text-purple-400 font-bold">{planRequired}</span> paketine yükseltmeniz gerekiyor.
                            </p>
                        </div>

                        {/* Feature Description */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    {icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">{label}</h4>
                                    <p className="text-sm text-slate-400">{description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2 mb-6">
                            {[
                                "Sınırsız erişim",
                                "Öncelikli destek",
                                "Tüm premium özellikler"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-purple-400" />
                                    <span className="text-sm text-slate-300">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="space-y-3">
                            <Link
                                href="/pricing"
                                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl text-center transition-all"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Zap size={18} />
                                    Planları İncele
                                    <ArrowRight size={16} />
                                </span>
                            </Link>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="block w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-medium rounded-xl text-center transition-all"
                            >
                                Şimdilik Geç
                            </button>
                        </div>

                        {/* Trust Text */}
                        <p className="text-[10px] text-slate-600 text-center mt-4">
                            🔒 İstediğin zaman iptal edebilirsin
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * PremiumBadge Component
 * Small badge to indicate premium-only features inline
 */
export function PremiumBadge({ className = "" }: { className?: string }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full ${className}`}>
            <Crown size={10} className="text-purple-400" />
            <span className="text-[10px] font-bold text-purple-300">PRO</span>
        </span>
    );
}
