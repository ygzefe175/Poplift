import React, { useState } from 'react';
import { Plus, Trash2, Power, MousePointer2, Target, Clock, Scroll, Lock, Zap } from 'lucide-react';
import { Popup } from '@/hooks/usePopups';
import CreateCampaignModal from './CreateCampaignModal';
import clsx from 'clsx';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';

interface AdvancedSettings {
    triggerType: 'time' | 'scroll' | 'exit_intent' | 'click';
    delaySeconds: number;
    scrollPercentage: number;
    frequency: 'always' | 'once_per_session' | 'once_per_day' | 'once_per_week';
    showOnMobile: boolean;
    showOnDesktop: boolean;
}

interface CampaignListProps {
    popups: Popup[];
    loading: boolean;
    createPopup: (name: string, headline: string, subtext: string, cta: string, position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center', type: string, settings?: AdvancedSettings) => Promise<any>;
    deletePopup: (id: string) => Promise<void>;
    togglePopupStatus: (id: string, currentStatus: boolean) => Promise<void>;
    userPlan?: 'free' | 'pro' | 'growth';
}

export default function CampaignList({ popups, loading, createPopup, deletePopup, togglePopupStatus, userPlan = 'free' }: CampaignListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLimitWarning, setShowLimitWarning] = useState(false);

    // Check campaign limit for free users
    const canCreateCampaign = userPlan !== 'free' || popups.length < 2;

    const handleCreate = async (name: string, headline: string, subtext: string, cta: string, position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center', type: string, settings?: AdvancedSettings) => {
        await createPopup(name, headline, subtext, cta, position, type, settings);
        setIsModalOpen(false);
    };

    const handleNewCampaignClick = () => {
        if (canCreateCampaign) {
            setIsModalOpen(true);
        } else {
            setShowLimitWarning(true);
        }
    };

    if (loading) return <div className="text-white text-center py-10">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            {/* Campaign Limit Warning Modal */}
            {showLimitWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1C1C1E] rounded-2xl border border-white/10 p-8 max-w-md text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} className="text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Kampanya Limite Ulaştı</h3>
                        <p className="text-slate-400 mb-6">
                            Ücretsiz planda maksimum 2 kampanya oluşturabilirsiniz. Sınırsız kampanya için Pro'ya geçin!
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/checkout?product=pro"
                                className="block w-full py-3 bg-gradient-to-r from-brand-orange to-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-orange/20"
                            >
                                <Zap size={18} className="inline mr-2" fill="black" />
                                Pro'ya Geç - Sınırsız Kampanya
                            </Link>
                            <button
                                onClick={() => setShowLimitWarning(false)}
                                className="w-full py-2 text-slate-500 hover:text-white text-sm transition-colors"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Kampanyalarım</h2>
                <button
                    onClick={handleNewCampaignClick}
                    className={clsx(
                        "flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl transition-colors",
                        canCreateCampaign
                            ? "bg-white text-black hover:bg-brand-orange"
                            : "bg-white/20 text-white/60 cursor-not-allowed"
                    )}
                >
                    {canCreateCampaign ? <Plus size={18} /> : <Lock size={18} />} Yeni Kampanya
                </button>
            </div>

            {popups.length === 0 ? (
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center text-slate-500 mb-4">
                        <MousePointer2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Henüz Bir Kampanyanız Yok</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-8">Hemen ilk pop-up kampanyanızı oluşturun ve dönüşümleri artırmaya başlayın.</p>
                    <button
                        onClick={handleNewCampaignClick}
                        className="px-8 py-3 bg-brand-orange text-black font-bold rounded-xl hover:brightness-110 transition-all"
                    >
                        İlk Kampanyayı Oluştur
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popups.map((popup) => (
                        <div key={popup.id} className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                    popup.is_active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                )}>
                                    {popup.is_active ? 'Aktif' : 'Pasif'}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => togglePopupStatus(popup.id, popup.is_active)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                                        title={popup.is_active ? "Durdur" : "Başlat"}
                                    >
                                        <Power size={16} />
                                    </button>
                                    <button
                                        onClick={() => deletePopup(popup.id)}
                                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500"
                                        title="Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                {/* Template Type Icon */}
                                {popup.type === 'spinwheel' && (
                                    <span className="text-lg">🎡</span>
                                )}
                                <h3 className="font-bold text-white text-lg">{popup.name}</h3>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-xs text-slate-500 font-mono">
                                    {format(new Date(popup.created_at), 'd MMMM yyyy, HH:mm', { locale: tr })}
                                </p>
                                {/* Template Badge */}
                                {popup.type === 'spinwheel' && (
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400 text-[9px] font-bold rounded-full border border-yellow-500/20">
                                        Gamification
                                    </span>
                                )}
                            </div>

                            <div className="bg-[#0F1117] rounded-xl p-4 border border-white/5">
                                <p className="text-sm font-bold text-white mb-1">{popup.headline}</p>
                                <p className="text-xs text-slate-400 truncate">{popup.subtext}</p>
                            </div>

                            {/* Settings Preview */}
                            {popup.settings && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {popup.settings.triggerType === 'time' && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[9px] text-slate-400 font-medium">
                                            <Clock size={10} /> {popup.settings.delaySeconds}sn
                                        </span>
                                    )}
                                    {popup.settings.triggerType === 'scroll' && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[9px] text-slate-400 font-medium">
                                            <Scroll size={10} /> %{popup.settings.scrollPercentage}
                                        </span>
                                    )}
                                    {popup.settings.triggerType === 'exit_intent' && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[9px] text-slate-400 font-medium">
                                            <Target size={10} /> Exit Intent
                                        </span>
                                    )}
                                    <span className="px-2 py-1 bg-white/5 rounded-lg text-[9px] text-slate-400 font-medium">
                                        {popup.settings.frequency === 'always' && 'Her Ziyaret'}
                                        {popup.settings.frequency === 'once_per_session' && '1x/Oturum'}
                                        {popup.settings.frequency === 'once_per_day' && '1x/Gün'}
                                        {popup.settings.frequency === 'once_per_week' && '1x/Hafta'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}
