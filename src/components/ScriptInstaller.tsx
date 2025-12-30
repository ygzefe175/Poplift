"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check, Code2, Globe, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface ScriptInstallerProps {
    userId: string;
    onCopy?: () => void;
}

export default function ScriptInstaller({ userId, onCopy }: ScriptInstallerProps) {
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    // Get the base URL on client side to prevent hydration mismatch
    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        setBaseUrl(url);
    }, []);

    // Production-ready embed code
    const scriptCode = `<!-- Popwise - Conversion Optimization -->
<script src="${baseUrl}/api/pixel?id=${userId || 'YOUR_USER_ID'}" async></script>`;

    const handleCopy = () => {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = scriptCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        } else {
            navigator.clipboard.writeText(scriptCode);
        }
        setCopied(true);
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden shadow-lg mb-8 animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code2 className="text-brand-orange" size={24} />
                        Kurulum Kodunuz
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Bu kodu sitenizin <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs font-mono">&lt;head&gt;</code> etiketleri arasına yapıştırın.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {userId ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 size={14} />
                            Pixel Hazır
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                            <AlertCircle size={14} />
                            Giriş Gerekli
                        </div>
                    )}
                </div>
            </div>

            {/* Code Block */}
            <div className="p-6 bg-[#0F1117]">
                <div className="relative group">
                    <pre className="font-mono text-sm text-slate-300 bg-[#090a0d] p-6 rounded-xl border border-white/10 overflow-x-auto selection:bg-indigo-500/30">
                        <code>{scriptCode}</code>
                    </pre>

                    <button
                        onClick={handleCopy}
                        disabled={!userId}
                        className={clsx(
                            "absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg",
                            copied
                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                : userId
                                    ? "bg-white text-black hover:bg-brand-orange hover:text-black shadow-white/10"
                                    : "bg-slate-600 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check size={16} /> Kopyalandı!
                            </>
                        ) : (
                            <>
                                <Copy size={16} /> Kodu Kopyala
                            </>
                        )}
                    </button>
                </div>

                {/* Installation Steps */}
                <div className="mt-6 space-y-4">
                    <h4 className="text-white font-bold text-sm">📋 Kurulum Adımları:</h4>
                    <div className="grid gap-3">
                        <div className="flex items-start gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">1</span>
                            <span className="text-slate-400">Yukarıdaki kodu <span className="text-white font-medium">kopyalayın</span></span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">2</span>
                            <span className="text-slate-400">Sitenizin <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">&lt;head&gt;</code> bölümüne <span className="text-white font-medium">yapıştırın</span></span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">3</span>
                            <span className="text-slate-400">Değişiklikleri <span className="text-white font-medium">kaydedin</span> ve sitenizi yenileyin</span>
                        </div>
                    </div>
                </div>

                {/* Platform Compatibility */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Globe size={14} />
                            <span>Desteklenen Platformlar:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['WordPress', 'Shopify', 'Wix', 'Squarespace', 'HTML/CSS', 'React', 'Next.js'].map((platform) => (
                                <span
                                    key={platform}
                                    className="px-2 py-1 rounded bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 transition-colors"
                                >
                                    {platform}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Help Link */}
                <div className="mt-4 flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                    <p className="text-slate-500">
                        Yardıma mı ihtiyacınız var?{' '}
                        <a href="/help" className="text-brand-orange hover:underline inline-flex items-center gap-1">
                            Kurulum Rehberi <ExternalLink size={12} />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
