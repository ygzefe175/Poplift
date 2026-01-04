"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface Notification {
    id: number;
    logo: string;
    iconBg: string;
    title: string;
    message: string;
    time: string;
    delay: number;
}

const notifications: Notification[] = [
    {
        id: 1,
        logo: '💳',
        iconBg: '#6366F1',
        title: 'Mert Güler Katıldı',
        message: 'Profesyonel Paket satın alımı tamamlandı.',
        time: 'şimdi',
        delay: 3000
    },
    {
        id: 2,
        logo: '📈',
        iconBg: '#10B981',
        title: 'Harika Haber! 🔥',
        message: 'Bir ziyaretçi sepetini terk etmekten vazgeçti.',
        time: '1dk',
        delay: 15000
    },
    {
        id: 3,
        logo: '🏬',
        iconBg: '#3B82F6',
        title: 'İndirim Hazır',
        message: 'Sepetini bırakanlara otomatik teklifler iletildi.',
        time: 'şimdi',
        delay: 28000
    },
    {
        id: 4,
        logo: '💡',
        iconBg: '#F59E0B',
        title: 'AI Önerisi',
        message: "Kampanya süresini uzatırsanız dönüşüm artabilir.",
        time: 'şimdi',
        delay: 42000
    },
    {
        id: 5,
        logo: '🚀',
        iconBg: '#06B6D4',
        title: 'Hız Analizi: %99.9',
        message: 'Akıllı script sitenizi yavaşlatmadan çalışıyor.',
        time: 'şimdi',
        delay: 55000
    }
];

const NotificationCard = ({ notification, onClose }: { notification: Notification, onClose: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, notification.delay);
        return () => clearTimeout(timer);
    }, [notification.delay]);

    if (!isVisible) return null;

    return (
        <div
            onClick={onClose}
            className={clsx(
                "group relative flex items-start gap-3 p-3 pr-6 rounded-xl bg-[#1C1C1E] border border-white/5 shadow-xl w-full mb-3 transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) hover:bg-[#27272a] cursor-pointer hover:border-white/10 sm:gap-3.5 sm:p-3.5 sm:pr-6 sm:hover:translate-x-[-5px]",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[50px] pointer-events-none"
            )}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg sm:w-10 sm:h-10 sm:text-xl"
                style={{ backgroundColor: notification.iconBg }}
            >
                {notification.logo}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                    <h4 className="text-[13px] font-bold text-white leading-tight truncate sm:text-sm">{notification.title}</h4>
                    <span className="text-[9px] text-slate-500 font-bold ml-2 whitespace-nowrap sm:text-[10px]">{notification.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug font-medium line-clamp-2 sm:text-xs">
                    {notification.message}
                </p>
            </div>

            {/* Demo Badge */}
            <div className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-yellow-500 text-black text-[8px] font-black rounded shadow-lg">
                ÖRNEK
            </div>

            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-slate-500 font-bold px-1 rounded bg-black/20">
                KAPAT
            </div>
        </div>
    );
};

// Preference Modal
const PreferenceModal = ({ onAccept, onDecline }: { onAccept: () => void, onDecline: () => void }) => {
    return (
        <div className="fixed top-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-[320px] animate-fade-in">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🔔</span>
                    <h4 className="text-white font-bold text-sm">Bildirim Tercihi</h4>
                </div>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                    Demo bildirimleri göstermeye devam edelim mi? Bunlar örnek bildirimlerdir ve gerçek değildir.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onAccept}
                        className="flex-1 py-2 bg-brand-orange text-black text-xs font-bold rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        ✓ Evet, Göster
                    </button>
                    <button
                        onClick={onDecline}
                        className="flex-1 py-2 bg-white/5 text-slate-300 text-xs font-bold rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                        ✕ Hayır
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function NotificationStack() {
    const [visibleNotifications, setVisibleNotifications] = useState<number[]>(
        notifications.map(n => n.id)
    );
    const [showPreference, setShowPreference] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check localStorage for preference with safe access
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const stored = localStorage.getItem('poplift_notifications_preference');
                if (stored === 'disabled') {
                    setNotificationsEnabled(false);
                } else if (stored === null) {
                    // First visit or no preference set - show preference modal after 5 seconds
                    const timer = setTimeout(() => {
                        setShowPreference(true);
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            }
        } catch {
            // localStorage not available, continue with defaults
        }
    }, []);

    const handleClose = (id: number) => {
        setVisibleNotifications(prev => prev.filter(nId => nId !== id));
    };

    const handleAcceptNotifications = () => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('poplift_notifications_preference', 'enabled');
            }
        } catch {
            // localStorage not available
        }
        setShowPreference(false);
        setNotificationsEnabled(true);
    };

    const handleDeclineNotifications = () => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('poplift_notifications_preference', 'disabled');
            }
        } catch {
            // localStorage not available
        }
        setShowPreference(false);
        setNotificationsEnabled(false);
    };

    if (!isClient) return null;

    // Show preference modal if needed
    if (showPreference) {
        return <PreferenceModal onAccept={handleAcceptNotifications} onDecline={handleDeclineNotifications} />;
    }

    // Don't show notifications if user declined
    if (!notificationsEnabled) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-[320px] pointer-events-none sm:w-[320px]">
            <div className="pointer-events-auto flex flex-col items-end">
                {notifications
                    .filter(n => visibleNotifications.includes(n.id))
                    .map(notification => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onClose={() => handleClose(notification.id)}
                        />
                    ))
                }
            </div>
        </div>
    );
}
