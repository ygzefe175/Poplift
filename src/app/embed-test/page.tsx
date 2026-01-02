"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ExternalLink, Play, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function EmbedTestPage() {
    const { user } = useAuth();
    const [iframeKey, setIframeKey] = useState(0);
    const [baseUrl, setBaseUrl] = useState('');

    // Set baseUrl on client side only to prevent hydration mismatch
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const testHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Sitesi - Poplift Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; margin-bottom: 1rem; }
        .card { 
            background: rgba(255,255,255,0.1); 
            backdrop-filter: blur(10px);
            border-radius: 16px; 
            padding: 24px; 
            margin: 20px 0;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .btn {
            background: white;
            color: #764ba2;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
        }
        .notice {
            background: rgba(0,0,0,0.2);
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            margin-top: 40px;
        }
    </style>
    
    <!-- Poplift Conversion System -->
    <script src="${baseUrl}/api/pixel?id=${user?.id || 'demo'}" async></script>
</head>
<body>
    <div class="container">
        <h1>🎉 Örnek E-Ticaret Sitesi</h1>
        <p>Bu sayfa, Poplift embed kodunun nasıl çalıştığını test etmek için oluşturulmuş bir demo sitedir.</p>
        
        <div class="card">
            <h2>🛍️ Ürünlerimiz</h2>
            <p>En kaliteli ürünleri en uygun fiyatlarla sunuyoruz. Hemen alışverişe başlayın!</p>
            <button class="btn">Alışverişe Başla</button>
        </div>
        
        <div class="card">
            <h2>📦 Hızlı Teslimat</h2>
            <p>Tüm siparişleriniz 24 saat içinde kargoya verilir. Ücretsiz kargo fırsatını kaçırmayın!</p>
        </div>
        
        <div class="card">
            <h2>💳 Güvenli Ödeme</h2>
            <p>256-bit SSL şifreleme ile güvenli ödeme. Kredi kartı bilgileriniz bizde güvende.</p>
        </div>
        
        <p style="margin-top: 40px;">Sayfayı kaydırın veya fareyi yukarı çıkarın (exit intent) pop-up'ları tetiklemek için.</p>
        
        <div style="height: 500px;"></div>
        
        <div class="card">
            <h2>📞 İletişim</h2>
            <p>Sorularınız için bize ulaşın: info@example.com</p>
        </div>
        
        <div class="notice">
            ⚡ Bu sayfada Poplift embed kodu aktif. Pop-up'larınız burada görünecek!
        </div>
    </div>
</body>
</html>`;

    return (
        <main className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0f1117]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Dashboard'a Dön
                        </Link>
                        <span className="text-slate-600">|</span>
                        <h1 className="text-white font-bold">Embed Kodu Test Sayfası</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIframeKey(k => k + 1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <RefreshCw size={16} />
                            Yenile
                        </button>
                        <a
                            href={`data:text/html;charset=utf-8,${encodeURIComponent(testHtml)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-amber-500 text-black rounded-lg transition-colors text-sm font-bold"
                        >
                            <ExternalLink size={16} />
                            Yeni Sekmede Aç
                        </a>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
                    <Play size={16} className="text-emerald-500" />
                    <p className="text-emerald-400 text-sm">
                        <strong>Test Modu Aktif:</strong> Aşağıdaki iframe'de embed kodunuz çalışıyor.
                        Pop-up tetiklemek için sayfayı kaydırın veya fareyi yukarı çıkarın.
                    </p>
                </div>
            </div>

            {/* Iframe Container */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-[#1c1c1e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Browser Chrome */}
                    <div className="bg-[#2a2a2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 bg-[#1c1c1e] rounded-lg px-4 py-1.5 text-sm text-slate-400 font-mono">
                            https://ornek-eticaret-sitesi.com
                        </div>
                    </div>

                    {/* Iframe */}
                    <iframe
                        key={iframeKey}
                        srcDoc={testHtml}
                        className="w-full h-[600px] border-0"
                        title="Embed Test"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>

                {/* Debug Info */}
                <div className="mt-8 bg-[#1c1c1e] rounded-2xl border border-white/10 p-6">
                    <h2 className="text-white font-bold text-lg mb-4">🔧 Teknik Bilgiler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">User ID</p>
                            <p className="text-white font-mono text-sm">{user?.id || 'Giriş yapılmamış'}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Pixel URL</p>
                            <p className="text-white font-mono text-sm break-all">{baseUrl}/api/pixel?id={user?.id || 'demo'}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Popups API</p>
                            <p className="text-white font-mono text-sm break-all">{baseUrl}/api/popups/{user?.id || 'demo'}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Track API</p>
                            <p className="text-white font-mono text-sm break-all">{baseUrl}/api/track</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-amber-400 text-sm">
                            <strong>💡 İpucu:</strong> Dashboard'dan en az bir aktif pop-up oluşturduğunuzdan emin olun.
                            Sadece <code className="bg-black/30 px-1.5 py-0.5 rounded">is_active = true</code> olan pop-up'lar görünür.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
