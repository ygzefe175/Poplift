import React from 'react';
import { Shield, CreditCard, Lock, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 py-6 opacity-70">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Lock size={16} className="text-emerald-400" />
                <span className="font-semibold">256-bit SSL Şifreli</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield size={16} className="text-blue-400" />
                <span className="font-semibold">GDPR Uyumlu</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CreditCard size={16} className="text-purple-400" />
                <span className="font-semibold">Kredi Kartı Gerekmez</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CheckCircle size={16} className="text-brand-orange" />
                <span className="font-semibold">30 Gün Para İade</span>
            </div>
        </div>
    );
}
