"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Settings, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#000212]/80 backdrop-blur-md transition-all">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl text-white tracking-tight hover:opacity-90 transition-opacity">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                    </span>
                    Poplift
                </Link>
                <div className="hidden md:flex items-center gap-10 text-sm text-coffee-800/80 font-bold tracking-wide">
                    <Link href="/demo" className={clsx("hover:text-brand-orange transition-colors", pathname === '/demo' && "text-brand-orange")}>Demo</Link>
                    <Link href="/pricing" className={clsx("hover:text-brand-orange transition-colors", pathname === '/pricing' && "text-brand-orange")}>Fiyatlandırma</Link>
                    {user && (
                        <>
                            <Link href="/dashboard" className={clsx("hover:text-brand-orange transition-colors", pathname === '/dashboard' && "text-brand-orange")}>Panel</Link>
                            <Link href="/analytics" className={clsx("hover:text-brand-orange transition-colors", pathname === '/analytics' && "text-brand-orange")}>Analitik</Link>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
                                >
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#000212]"></span>
                                </button>

                                {/* Dropdown */}
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                                        <div className="absolute top-full right-0 mt-2 w-80 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-fade-in origin-top-right">
                                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                                <h4 className="font-bold text-white text-sm">Bildirimler</h4>
                                                <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full font-bold">2 Yeni</span>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                                    <div className="flex gap-3">
                                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm text-slate-300 font-medium mb-1">Hoş Geldiniz! 👋</p>
                                                            <p className="text-xs text-slate-500">Demo süreniz başladı. İlk kampanyalarınızı oluşturmak için acele edin.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                                                    <div className="flex gap-3">
                                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm text-slate-300 font-medium mb-1">Kurulum Tamamlandı</p>
                                                            <p className="text-xs text-slate-500">Pixel kodunuz başarıyla çalışıyor. Veriler akmaya başladı.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <Link href="/settings" className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors mr-2" title="Ayarlar">
                                <Settings size={20} />
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="hidden sm:flex items-center gap-2 btn-secondary py-2 px-5 text-sm"
                            >
                                <LogOut size={16} /> Çıkış
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-coffee-900 hover:text-brand-orange transition-colors hidden sm:block">
                                Giriş Yap
                            </Link>
                            <Link href="/register" className="btn-primary py-2.5 px-6 text-sm shadow-[0_3px_0_0_#D97706] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#D97706]">
                                Başla
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
