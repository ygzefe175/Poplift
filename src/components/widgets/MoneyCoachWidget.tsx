"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, Sparkles, Lock } from 'lucide-react';
import clsx from 'clsx';

// Storage key
const PARA_KOCU_KEY = 'para_kocu_data';

interface SavedData {
    currentBalance: string;
    dailySpending: string;
    savedAt: string;
}

function parseFormattedNumber(value: string): number {
    return parseFloat(value.replace(/\./g, '')) || 0;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR').format(Math.round(amount));
}

function calculateDaysRemaining(balance: number, dailySpending: number): number {
    if (dailySpending <= 0) return 999;
    return Math.floor(balance / dailySpending);
}

interface MoneyCoachWidgetProps {
    isPremium?: boolean;
}

export default function MoneyCoachWidget({ isPremium = false }: MoneyCoachWidgetProps) {
    const [hasData, setHasData] = useState(false);
    const [balance, setBalance] = useState(0);
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [riskLevel, setRiskLevel] = useState<'safe' | 'warning' | 'critical'>('safe');
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load saved data from localStorage
        try {
            const saved = localStorage.getItem(PARA_KOCU_KEY);
            if (saved) {
                const data: SavedData = JSON.parse(saved);
                const balanceNum = parseFormattedNumber(data.currentBalance);
                const spendingNum = parseFormattedNumber(data.dailySpending);

                if (balanceNum > 0 && spendingNum > 0) {
                    const days = calculateDaysRemaining(balanceNum, spendingNum);

                    setBalance(balanceNum);
                    setDaysRemaining(days);
                    setHasData(true);

                    // Set risk level
                    if (days <= 7) setRiskLevel('critical');
                    else if (days <= 14) setRiskLevel('warning');
                    else setRiskLevel('safe');

                    // Check trend (mock for now)
                    setTrend('stable');
                }
            }
        } catch {
            // Ignore
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
            </div>
        );
    }

    // No data state - encourage first use
    if (!hasData) {
        return (
            <Link href="/para-yonetimi" className="block">
                <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Wallet size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Para Koçu</p>
                                <p className="text-slate-500 text-xs">Finansal Asistan</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <p className="text-slate-300 text-sm mb-2">
                            Paran ne zaman bitecek? 30 saniyede öğren.
                        </p>
                        <p className="text-slate-500 text-xs">
                            Ücretsiz hesapla, grafiğini gör.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm font-bold">Hemen Başla</span>
                        <span className="text-xs text-slate-500">30 saniye</span>
                    </div>
                </div>
            </Link>
        );
    }

    // Helper function for dynamic title
    const getDynamicTitle = (risk: string) => {
        if (risk === 'critical') return "Acil Durum 🚨";
        if (risk === 'warning') return "Dikkatli Git ⚠️";
        return "Harika Yönetim ✨";
    }

    // Helper for dynamic subtext
    const getDynamicSubtext = (risk: string, days: number) => {
        if (risk === 'critical') return `Bu hızla paran sadece ${days} gün yetecek.`;
        if (risk === 'warning') return `Ay sonunu görmek için biraz yavaşlamalısın.`;
        return `Bu tempoda ay sonunu rahatlıkla çıkarırsın.`;
    }

    // ... existing code ...

    // Has data state
    return (
        <Link href="/para-yonetimi" className="block">
            <div className={clsx(
                "rounded-2xl p-6 border transition-all group cursor-pointer relative overflow-hidden",
                riskLevel === 'critical'
                    ? "bg-gradient-to-br from-red-600/10 to-red-800/10 border-red-500/20 hover:border-red-500/40"
                    : riskLevel === 'warning'
                        ? "bg-gradient-to-br from-amber-600/10 to-orange-600/10 border-amber-500/20 hover:border-amber-500/40"
                        : "bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border-emerald-500/20 hover:border-emerald-500/40"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                            riskLevel === 'critical' ? "bg-red-500/20 shadow-red-500/10"
                                : riskLevel === 'warning' ? "bg-amber-500/20 shadow-amber-500/10"
                                    : "bg-emerald-500/20 shadow-emerald-500/10"
                        )}>
                            <Wallet size={24} className={clsx(
                                riskLevel === 'critical' ? "text-red-400"
                                    : riskLevel === 'warning' ? "text-amber-400"
                                        : "text-emerald-400"
                            )} />
                        </div>
                        <div>
                            <p className="text-white font-black text-base leading-tight">
                                {getDynamicTitle(riskLevel)}
                            </p>
                            <p className={clsx(
                                "text-xs mt-1 leading-snug max-w-[200px]",
                                riskLevel === 'critical' ? "text-red-200"
                                    : riskLevel === 'warning' ? "text-amber-200"
                                        : "text-emerald-200"
                            )}>
                                {getDynamicSubtext(riskLevel, daysRemaining)}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Balance */}
                <div className="mb-4">
                    <p className="text-slate-500 text-xs mb-1">Kalan Bakiye</p>
                    <p className="text-2xl font-black text-white">₺{formatCurrency(balance)}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{daysRemaining} gün kaldı</span>
                        <span className="text-slate-500">30 gün hedef</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={clsx(
                                "h-full rounded-full transition-all",
                                riskLevel === 'critical' ? "bg-gradient-to-r from-red-500 to-red-400"
                                    : riskLevel === 'warning' ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                        : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            )}
                            style={{ width: `${Math.min((daysRemaining / 30) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                        {trend === 'up' ? (
                            <>
                                <TrendingUp size={14} className="text-emerald-400" />
                                <span className="text-emerald-400 font-bold text-xs">İyileşiyor</span>
                            </>
                        ) : trend === 'down' ? (
                            <>
                                <TrendingDown size={14} className="text-red-400" />
                                <span className="text-red-400 font-bold text-xs">Dikkat</span>
                            </>
                        ) : (
                            <span className="text-slate-500 text-xs">Detaylar için tıkla</span>
                        )}
                    </div>
                    {isPremium && (
                        <div className="flex items-center gap-1 text-purple-400">
                            <Sparkles size={12} />
                            <span className="text-xs font-bold">Premium</span>
                        </div>
                    )}
                </div>

                {/* Glow effect for critical */}
                {riskLevel === 'critical' && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
                )}
            </div>
        </Link>
    );
}
