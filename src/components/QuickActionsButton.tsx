"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Plus, X, Zap, BarChart3, Sparkles, MessageSquare,
    BookOpen, Headphones, Gift, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

interface QuickAction {
    icon: React.ReactNode;
    label: string;
    description: string;
    href: string;
    color: string;
    badge?: string;
}

const actions: QuickAction[] = [
    {
        icon: <Zap size={20} />,
        label: 'Yeni Kampanya',
        description: 'Pop-up kampanyası oluştur',
        href: '/dashboard',
        color: 'from-brand-orange to-amber-500'
    },
    {
        icon: <Sparkles size={20} />,
        label: 'AI İçerik Üret',
        description: 'Yapay zeka ile metin oluştur',
        href: '/ai-content-generator',
        color: 'from-purple-500 to-pink-500',
        badge: 'AI'
    },
    {
        icon: <BarChart3 size={20} />,
        label: 'Site Analiz',
        description: 'Sitenin SEO skorunu gör',
        href: '/site-analiz',
        color: 'from-emerald-500 to-teal-500',
        badge: 'ÜCRETSİZ'
    },
    {
        icon: <BookOpen size={20} />,
        label: 'Dokümantasyon',
        description: 'Nasıl kullanılır öğren',
        href: '/docs',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: <Headphones size={20} />,
        label: 'Destek',
        description: 'Yardım al',
        href: 'mailto:destek@poplift.com',
        color: 'from-slate-500 to-slate-600'
    }
];

export default function QuickActionsButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Actions Panel */}
            <div className={clsx(
                "fixed bottom-24 right-6 z-50 transition-all duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}>
                <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-4 shadow-2xl w-72">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-bold text-sm">Hızlı Erişim</h4>
                        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">⌘K</span>
                    </div>

                    <div className="space-y-2">
                        {actions.map((action, idx) => (
                            <Link
                                key={idx}
                                href={action.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shrink-0",
                                    action.color
                                )}>
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-medium text-sm truncate">{action.label}</p>
                                        {action.badge && (
                                            <span className="text-[9px] bg-white/10 text-slate-400 px-1.5 py-0.5 rounded font-bold">
                                                {action.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-xs truncate">{action.description}</p>
                                </div>
                                <ArrowRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {/* Premium CTA */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <Link
                            href="/pricing"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand-orange/10 to-amber-500/10 border border-brand-orange/20 hover:border-brand-orange/40 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                                <Gift size={20} className="text-brand-orange" />
                            </div>
                            <div className="flex-1">
                                <p className="text-brand-orange font-bold text-sm">Pro'ya Geç</p>
                                <p className="text-slate-500 text-xs">Sınırsız özellik</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                    isOpen
                        ? "bg-white/10 border border-white/20 text-white rotate-45"
                        : "bg-gradient-to-br from-brand-orange to-amber-500 text-black hover:scale-110 shadow-brand-orange/30"
                )}
                aria-label={isOpen ? "Menüyü Kapat" : "Hızlı Erişim"}
            >
                {isOpen ? <X size={24} /> : <Plus size={24} strokeWidth={2.5} />}
            </button>
        </>
    );
}
