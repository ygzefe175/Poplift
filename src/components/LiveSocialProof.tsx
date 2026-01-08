"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    Zap,
    Eye,
    TrendingUp,
    Shield,
    GraduationCap,
    FolderPlus,
    Clock,
    Activity
} from 'lucide-react';

/**
 * AnimatedCounter Component
 * Animates a number counting up from 0 to target value
 */
function AnimatedCounter({
    end,
    duration = 2000,
    suffix = ""
}: {
    end: number;
    duration?: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    // Format number with K suffix for thousands
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    };

    return (
        <span ref={countRef} className="tabular-nums">
            {formatNumber(count)}{suffix}
        </span>
    );
}

/**
 * LiveSocialProof Component
 * Professional live statistics widget with animated counters
 * Shows engagement metrics to build trust
 */
export default function LiveSocialProof() {
    const [lastUpdate, setLastUpdate] = useState(0);
    const [stats, setStats] = useState({
        currentVisitors: 0,
        demosToday: 0,
        weeklyUsers: 0,
        studentDiscounts: 0,
        totalProjects: 0
    });
    const [isVisible, setIsVisible] = useState(false);

    // Initialize with realistic random values
    useEffect(() => {
        const baseStats = {
            currentVisitors: 12 + Math.floor(Math.random() * 15),
            demosToday: 47 + Math.floor(Math.random() * 30),
            weeklyUsers: 340 + Math.floor(Math.random() * 100),
            studentDiscounts: 128 + Math.floor(Math.random() * 50),
            totalProjects: 2847 + Math.floor(Math.random() * 200)
        };
        setStats(baseStats);

        // Show widget after a short delay
        setTimeout(() => setIsVisible(true), 1000);
    }, []);

    // Update "last updated" timer
    useEffect(() => {
        const timer = setInterval(() => {
            setLastUpdate(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate real-time fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                currentVisitors: Math.max(5, Math.min(40, prev.currentVisitors + (Math.random() > 0.5 ? 1 : -1))),
                demosToday: prev.demosToday + (Math.random() > 0.7 ? 1 : 0)
            }));
            setLastUpdate(0); // Reset timer on update
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Statistics configuration
    const statsConfig = [
        {
            icon: <Activity size={16} className="text-emerald-400" />,
            label: "Şu an aktif",
            value: stats.currentVisitors,
            suffix: "",
            color: "emerald",
            live: true
        },
        {
            icon: <Zap size={16} className="text-purple-400" />,
            label: "Bugün demo",
            value: stats.demosToday,
            suffix: "",
            color: "purple",
            live: false
        },
        {
            icon: <Users size={16} className="text-blue-400" />,
            label: "Haftalık kullanıcı",
            value: stats.weeklyUsers,
            suffix: "",
            color: "blue",
            live: false
        },
        {
            icon: <GraduationCap size={16} className="text-pink-400" />,
            label: "Öğrenci indirimi",
            value: stats.studentDiscounts,
            suffix: "",
            color: "pink",
            live: false
        },
        {
            icon: <FolderPlus size={16} className="text-brand-orange" />,
            label: "Toplam proje",
            value: stats.totalProjects,
            suffix: "",
            color: "orange",
            live: false
        }
    ];

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-30 hidden lg:block transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-[#0A0B14]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden w-64">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        </div>
                        <span className="text-xs text-white font-bold uppercase tracking-wider">Canlı Veriler</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock size={10} />
                        <span>{lastUpdate}s önce</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-3 space-y-2">
                    {statsConfig.map((stat, idx) => (
                        <div
                            key={idx}
                            className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-default"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs text-slate-400">{stat.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-white">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </span>
                                {stat.live && (
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
                    <div className="flex items-start gap-2">
                        <Shield size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 leading-tight">
                                Veriler anonim tutulur, kişisel bilgiler toplanmaz.
                            </p>
                            <p className="text-[10px] text-slate-600 leading-tight">
                                Gerçek zamanlı istatistikler düzenli güncellenir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
