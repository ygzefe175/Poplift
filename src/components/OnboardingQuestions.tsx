"use client";

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Target, Rocket, ShoppingCart, Mail, Users, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';

/**
 * OnboardingQuestions Component
 * Multi-step onboarding flow to understand user goals
 * Similar to fitness apps asking about weight goals
 */

interface OnboardingData {
    goal: string;
    businessType: string;
    experience: string;
    monthlyVisitors: string;
}

interface OnboardingQuestionsProps {
    onComplete?: (data: OnboardingData) => void;
    onSkip?: () => void;
}

export default function OnboardingQuestions({ onComplete, onSkip }: OnboardingQuestionsProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<OnboardingData>({
        goal: '',
        businessType: '',
        experience: '',
        monthlyVisitors: ''
    });

    const steps = [
        {
            title: "Poplift'i ne için kullanacaksın?",
            subtitle: "Ana hedefinizi seçin",
            key: 'goal' as keyof OnboardingData,
            options: [
                { value: 'conversion', label: 'Dönüşüm Artırma', icon: <Target size={24} className="text-brand-orange" />, desc: 'Sepet terklerini azalt, satışları artır' },
                { value: 'leads', label: 'Lead Toplama', icon: <Mail size={24} className="text-blue-400" />, desc: 'E-posta listeni büyüt' },
                { value: 'engagement', label: 'Kullanıcı Etkileşimi', icon: <Users size={24} className="text-purple-400" />, desc: 'Ziyaretçi bağlılığını artır' },
                { value: 'announcement', label: 'Duyuru & Kampanya', icon: <Sparkles size={24} className="text-pink-400" />, desc: 'Özel teklifleri duyur' }
            ]
        },
        {
            title: "İşletme türün ne?",
            subtitle: "Size özel öneriler sunalım",
            key: 'businessType' as keyof OnboardingData,
            options: [
                { value: 'ecommerce', label: 'E-Ticaret', icon: <ShoppingCart size={24} className="text-emerald-400" />, desc: 'Online mağaza' },
                { value: 'saas', label: 'SaaS / Yazılım', icon: <Rocket size={24} className="text-blue-400" />, desc: 'Dijital ürün veya hizmet' },
                { value: 'agency', label: 'Ajans / Freelance', icon: <Building2 size={24} className="text-purple-400" />, desc: 'Müşterilerim için kullanacağım' },
                { value: 'other', label: 'Blog / Portfolyo', icon: <Users size={24} className="text-slate-400" />, desc: 'Kişisel site veya blog' }
            ]
        },
        {
            title: "Pop-up deneyimin var mı?",
            subtitle: "Seviyene uygun başlangıç yapalım",
            key: 'experience' as keyof OnboardingData,
            options: [
                { value: 'beginner', label: 'Yeni Başlıyorum', icon: <span className="text-2xl">🌱</span>, desc: 'İlk kez pop-up kullanacağım' },
                { value: 'intermediate', label: 'Biraz Deneyimim Var', icon: <span className="text-2xl">🌿</span>, desc: 'Daha önce kullandım ama geliştirmek istiyorum' },
                { value: 'advanced', label: 'Profesyonelim', icon: <span className="text-2xl">🌳</span>, desc: 'Gelişmiş özellikler arıyorum' }
            ]
        },
        {
            title: "Aylık ziyaretçi sayın ne kadar?",
            subtitle: "Doğru planı önerelim",
            key: 'monthlyVisitors' as keyof OnboardingData,
            options: [
                { value: 'starter', label: '0 - 1.000', icon: <span className="text-xl font-bold text-slate-400">1K</span>, desc: 'Yeni başlayan site' },
                { value: 'growing', label: '1.000 - 10.000', icon: <span className="text-xl font-bold text-blue-400">10K</span>, desc: 'Büyüyen site' },
                { value: 'established', label: '10.000 - 50.000', icon: <span className="text-xl font-bold text-purple-400">50K</span>, desc: 'Yerleşik site' },
                { value: 'enterprise', label: '50.000+', icon: <span className="text-xl font-bold text-brand-orange">50K+</span>, desc: 'Yüksek trafik' }
            ]
        }
    ];

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentStepData.key]: value
        }));

        if (currentStep < steps.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        } else {
            // Complete onboarding
            const finalAnswers = { ...answers, [currentStepData.key]: value };
            onComplete?.(finalAnswers);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#000212] z-50 flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-2xl">
                {/* Skip Button */}
                <button
                    onClick={onSkip}
                    className="absolute -top-12 right-0 text-slate-500 hover:text-white text-sm font-medium transition-colors"
                >
                    Atla →
                </button>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Adım {currentStep + 1} / {steps.length}</span>
                        <span className="text-xs text-slate-500">%{Math.round(progress)}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                    {/* Back Button */}
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Geri
                        </button>
                    )}

                    {/* Title */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                            {currentStepData.title}
                        </h2>
                        <p className="text-slate-400">{currentStepData.subtitle}</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentStepData.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(option.value)}
                                className={`group relative p-5 rounded-2xl border transition-all text-left hover:-translate-y-1 ${answers[currentStepData.key] === option.value
                                        ? 'bg-purple-500/20 border-purple-500'
                                        : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                                    }`}
                            >
                                {/* Selected Check */}
                                {answers[currentStepData.key] === option.value && (
                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        {option.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{option.label}</h4>
                                        <p className="text-sm text-slate-400">{option.desc}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trust Text */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    🔒 Bilgilerin gizli tutulur ve yalnızca deneyimini kişiselleştirmek için kullanılır.
                </p>
            </div>
        </div>
    );
}
