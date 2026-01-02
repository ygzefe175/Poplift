"use client";

import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Zap } from 'lucide-react';

// Seed based on date for consistent daily values across all devices
function getDailySeededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function getTodayBaseSales() {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = today.getFullYear() * 1000 + dayOfYear;

    // Base sales between 80-150 based on seed
    const baseSales = Math.floor(getDailySeededRandom(seed) * 70) + 80;

    // Add sales based on hour of day (more sales as day progresses)
    const currentHour = today.getHours();
    const hourlyProgress = Math.floor(currentHour * 2.5); // ~0-60 extra sales throughout day

    return baseSales + hourlyProgress;
}

function getActiveUsers() {
    const hour = new Date().getHours();
    // Peak hours: 10-12 and 19-22
    if (hour >= 10 && hour <= 12) return Math.floor(Math.random() * 20) + 45;
    if (hour >= 19 && hour <= 22) return Math.floor(Math.random() * 25) + 50;
    if (hour >= 2 && hour <= 7) return Math.floor(Math.random() * 10) + 15; // Night
    return Math.floor(Math.random() * 15) + 30; // Normal
}

export default function LiveStats() {
    const [activeUsers, setActiveUsers] = useState(35);
    const [todaySales, setTodaySales] = useState(100);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Set initial values
        setActiveUsers(getActiveUsers());
        setTodaySales(getTodayBaseSales());

        // Update active users every 5 seconds with small variations
        const userInterval = setInterval(() => {
            setActiveUsers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newVal = prev + change;
                return Math.max(15, Math.min(newVal, 85)); // Clamp between 15-85
            });
        }, 5000);

        // Update sales every 30-90 seconds (realistic purchasing pace)
        const salesInterval = setInterval(() => {
            const shouldIncrease = Math.random() > 0.3; // 70% chance of increase
            if (shouldIncrease) {
                setTodaySales(prev => prev + 1);
            }
        }, Math.random() * 60000 + 30000); // 30-90 seconds

        return () => {
            clearInterval(userInterval);
            clearInterval(salesInterval);
        };
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl w-64">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Canlı İstatistikler</span>
                    </div>
                    <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">DEMO</span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Users size={16} className="text-blue-400" />
                            </div>
                            <span className="text-slate-300 text-sm font-medium">Şu an aktif</span>
                        </div>
                        <span className="text-white font-black text-lg">{activeUsers}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp size={16} className="text-emerald-400" />
                            </div>
                            <span className="text-slate-300 text-sm font-medium">Bugün satış</span>
                        </div>
                        <span className="text-emerald-400 font-black text-lg">{todaySales}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                                <Zap size={16} className="text-brand-orange" />
                            </div>
                            <span className="text-slate-300 text-sm font-medium">Son 30 gün</span>
                        </div>
                        <span className="text-brand-orange font-black text-lg">4.2K</span>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-600 text-center">
                    Örnek gösterim verileri
                </div>
            </div>
        </div>
    );
}
