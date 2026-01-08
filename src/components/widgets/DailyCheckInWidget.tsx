"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Plus, Wallet, Coffee, ShoppingBag, Car, Home } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

// Mevcut localStorage anahtarı ile uyumlu çalışması için
const STORAGE_KEY = 'money_coach_data';

export default function DailyCheckInWidget() {
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [isSpending, setIsSpending] = useState(false);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('other');
    const [streak, setStreak] = useState(0);

    // Günlük kontrol yapılıp yapılmadığını kontrol et
    useEffect(() => {
        const lastCheckIn = localStorage.getItem('last_check_in_date');
        const today = new Date().toDateString();

        if (lastCheckIn === today) {
            setHasCheckedIn(true);
        }

        // Mock streak verisi (gerçekte DB'den gelecek)
        setStreak(parseInt(localStorage.getItem('check_in_streak') || '0'));
    }, []);

    const handleNoSpend = () => {
        const today = new Date().toDateString();
        localStorage.setItem('last_check_in_date', today);

        // Streak arttır
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('check_in_streak', newStreak.toString());

        setHasCheckedIn(true);
        toast.success('Harika! Başarılı bir tasarruf günü. 🎉');

        // Konfeti efekti tetiklenebilir burada
    };

    const handleSpendSubmit = () => {
        if (!amount) return;

        // Mevcut bakiyeden düş
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const data = JSON.parse(savedData);
                const currentBalance = parseFloat(data.currentBalance.replace(/\./g, ''));
                const spendAmount = parseFloat(amount);

                if (!isNaN(currentBalance) && !isNaN(spendAmount)) {
                    const newBalance = currentBalance - spendAmount;

                    // Veriyi güncelle
                    data.currentBalance = newBalance.toString(); // Basit string çevrimi, formatlama gerekebilir
                    data.dailySpending = ((parseFloat(data.dailySpending || '0') + spendAmount) / 2).toString(); // Ortalamayı güncelle (basit mantık)

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    toast.success(`Harcama kaydedildi. Yeni bakiye: ₺${newBalance}`);
                }
            }
        } catch (e) {
            console.error('Bakiye güncellenemedi', e);
        }

        const today = new Date().toDateString();
        localStorage.setItem('last_check_in_date', today);
        setHasCheckedIn(true);
        setIsSpending(false);
    };

    if (hasCheckedIn) {
        return (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Bugün Tamamlandı!</h3>
                        <p className="text-slate-400 text-sm">Finansal farkındalığın {streak} gündür devam ediyor.</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">STREAK</p>
                    <p className="text-3xl font-black text-emerald-400">🔥 {streak}</p>
                </div>
            </div>
        );
    }

    if (isSpending) {
        return (
            <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Harcama Ekle</h3>
                    <button onClick={() => setIsSpending(false)} className="text-slate-500 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {[
                        { id: 'food', icon: Coffee, label: 'Yemek' },
                        { id: 'shopping', icon: ShoppingBag, label: 'Alışveriş' },
                        { id: 'transport', icon: Car, label: 'Ulaşım' },
                        { id: 'bills', icon: Home, label: 'Fatura' },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={clsx(
                                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                                category === cat.id
                                    ? "bg-brand-orange/20 border-brand-orange text-brand-orange"
                                    : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                            )}
                        >
                            <cat.icon size={20} />
                            <span className="text-xs font-bold">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="relative mb-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-orange"
                        autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">TL</span>
                </div>

                <button
                    onClick={handleSpendSubmit}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-black font-bold py-4 rounded-xl transition-all"
                >
                    Kaydet ve Bitir
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-8 text-center relative overflow-hidden group">
            {/* Arka plan efektleri */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <h2 className="text-2xl font-black text-white mb-2 relative z-10">
                Bugün Harcama Yaptın mı?
            </h2>
            <p className="text-indigo-200 mb-8 relative z-10 max-w-md mx-auto">
                Günlük kontrolünü yap, seriyi bozma. Finansal farkındalık küçük adımlarla başlar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <button
                    onClick={handleNoSpend}
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={20} />
                    Hayır, Temizim! 🎉
                </button>

                <button
                    onClick={() => setIsSpending(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                    <Wallet size={20} className="text-brand-orange" />
                    Evet, Harcadım
                </button>
            </div>
        </div>
    );
}
