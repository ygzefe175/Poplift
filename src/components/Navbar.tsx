"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Settings, LogOut, User, Sparkles, Menu, X, ChevronDown, Crown } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Scroll listener for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const navLinks = [
        { href: '/demo', label: 'Demo', active: pathname === '/demo' },
        { href: '/pricing', label: 'Fiyatlandırma', active: pathname === '/pricing' },
        { href: '/para-yonetimi', label: '💰 Para Koçu', active: pathname === '/para-yonetimi', special: 'purple' },
        { href: '/ogrenci', label: '🎓 Öğrenci', active: pathname === '/ogrenci', special: 'pink' },
        { href: '/ai-content-generator', label: 'AI İçerik', active: pathname === '/ai-content-generator', icon: <Sparkles size={16} /> },
        { href: '/site-analiz', label: '🔍 Site Analiz', active: pathname === '/site-analiz', special: 'emerald' },
    ];

    const userNavLinks = [
        { href: '/dashboard', label: 'Panel', active: pathname === '/dashboard' },
        { href: '/analytics', label: 'Analitik', active: pathname === '/analytics' },
    ];

    return (
        <>
            <nav className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-white/10 bg-[#000212]/95 backdrop-blur-xl shadow-lg shadow-black/10"
                    : "border-b border-white/5 bg-[#000212]/80 backdrop-blur-md"
            )}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-black text-2xl text-white tracking-tight hover:opacity-90 transition-opacity group">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange group-hover:scale-110 transition-transform"></span>
                        </span>
                        Poplift
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8 text-sm text-coffee-800/80 font-bold tracking-wide">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "transition-colors flex items-center gap-1.5 py-2 relative group",
                                    link.active ? (
                                        link.special === 'purple' ? 'text-purple-400' :
                                            link.special === 'pink' ? 'text-pink-400' :
                                                link.special === 'emerald' ? 'text-emerald-400' :
                                                    'text-brand-orange'
                                    ) : (
                                        link.special === 'purple' ? 'hover:text-purple-400' :
                                            link.special === 'pink' ? 'hover:text-pink-400' :
                                                link.special === 'emerald' ? 'hover:text-emerald-400' :
                                                    'hover:text-brand-orange'
                                    )
                                )}
                            >
                                {link.icon}
                                {link.label}
                                {/* Active indicator */}
                                <span className={clsx(
                                    "absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300",
                                    link.active ? "w-full bg-current" : "w-0 group-hover:w-full bg-current opacity-50"
                                )} />
                            </Link>
                        ))}
                        {user && userNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "hover:text-brand-orange transition-colors py-2 relative group",
                                    link.active && "text-brand-orange"
                                )}
                            >
                                {link.label}
                                <span className={clsx(
                                    "absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300",
                                    link.active ? "w-full bg-brand-orange" : "w-0 group-hover:w-full bg-brand-orange opacity-50"
                                )} />
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
                                    >
                                        <Bell size={20} />
                                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#000212] animate-pulse"></span>
                                    </button>

                                    {/* Notification Dropdown */}
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

                                <Link href="/settings" className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all hidden sm:flex" title="Ayarlar">
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
                                <Link href="/register" className="btn-primary py-2.5 px-6 text-sm shadow-[0_3px_0_0_#D97706] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#D97706] hidden sm:flex items-center gap-2">
                                    <Crown size={16} /> Başla
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            aria-label="Menü"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div className={clsx(
                "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0A0B14] border-l border-white/10 z-50 transform transition-transform duration-300 ease-out lg:hidden",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2 font-black text-xl text-white">
                            <span className="relative flex h-3 w-3">
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                            </span>
                            Poplift
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex-1 overflow-y-auto py-6 px-4">
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                        link.active
                                            ? "bg-white/10 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {link.icon}
                                    {link.label}
                                    {link.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                                </Link>
                            ))}

                            {user && (
                                <>
                                    <div className="my-4 border-t border-white/5" />
                                    {userNavLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                                link.active
                                                    ? "bg-white/10 text-white"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="p-6 border-t border-white/5 space-y-3">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{user.email}</p>
                                        <p className="text-xs text-slate-500">Profili Görüntüle</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all font-medium"
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-center text-white rounded-xl transition-all font-medium"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full py-3 px-4 bg-brand-orange hover:bg-amber-500 text-center text-black rounded-xl transition-all font-bold flex items-center justify-center gap-2"
                                >
                                    <Crown size={18} /> Ücretsiz Başla
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
