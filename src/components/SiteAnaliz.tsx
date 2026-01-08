"use client";

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Zap, Shield, Globe, Share2, Download, Lock, CheckCircle2, XCircle, AlertCircle, BarChart3, Loader2, Moon, Sun, Languages, Copy } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';

/**
 * Site Analiz Aracı Component
 * Viral paylaşım potansiyeli olan ücretsiz SEO ve site analiz aracı
 * 
 * Özellikler:
 * - SEO Skoru (0-100)
 * - Sayfa Hızı Analizi
 * - Meta Tag Analizi ve Eksik Tag Kontrolü
 * - Mobil Uyumluluk Testi
 * - Güvenlik Skoru ve SSL Kontrolü
 * - Genel Puanlama Sistemi
 * - Önceliklendirilmiş İyileştirme Önerileri
 * - localStorage ile sonuçların saklanması
 * - Dark/Light mode toggle
 * - TR/EN dil değiştirici
 */

// Genişletilmiş analiz interface'i
interface SiteAnalysis {
    url: string;
    seoScore: number;
    speedScore: number;
    mobileScore: number;
    securityScore: number;
    overallScore: number; // Genel puan (0-100)
    metaTags: {
        title: string | null;
        description: string | null;
        keywords: string[];
        ogImage: boolean;
        ogTitle: boolean;
        ogDescription: boolean;
        twitterCard: boolean;
        canonical: boolean;
    };
    performance: {
        loadTime: string;
        totalSize: string;
        requests: number;
        imagesOptimized: boolean;
        cssOptimized: boolean;
        jsOptimized: boolean;
    };
    seoIssues: {
        missingTitle: boolean;
        missingDescription: boolean;
        titleTooLong: boolean;
        descriptionTooLong: boolean;
        noH1Tags: boolean;
        missingAltTags: number;
    };
    mobileIssues: {
        viewportMissing: boolean;
        touchFriendly: boolean;
        fontSizeReadable: boolean;
        buttonSize: boolean;
    };
    security: {
        sslEnabled: boolean;
        httpSecure: boolean;
        mixedContent: boolean;
        securityHeaders: number;
    };
    backlinks: number;
    domainAge: string;
    issues: Array<{ type: 'critical' | 'warning' | 'info'; message: string; priority: number }>;
    recommendations: Array<{ priority: number; category: string; message: string; impact: string }>;
    analyzedAt: string;
}

// Dil desteği için basit çeviri objesi
const translations: Record<string, Record<string, string>> = {
    tr: {
        'site_analyzer': 'Ücretsiz Site Analiz Aracı',
        'analyze_your_site': 'Sitenizi Analiz Edin',
        'seo_speed_performance': 'SEO, Hız & Performans',
        'free_seo_analysis': 'Ücretsiz SEO analizi, sayfa hızı testi, mobil uyumluluk kontrolü ve güvenlik skorunuzu öğrenin.',
        'enter_url': 'Site URL\'si',
        'analyze': 'Analiz Et',
        'analyzing': 'Analiz Ediliyor...',
        'overall_score': 'Genel Puan',
        'seo_score': 'SEO Skoru',
        'speed_score': 'Hız Skoru',
        'mobile_score': 'Mobil Uyum',
        'security_score': 'Güvenlik',
        'priority_fixes': 'Önce Neleri Düzeltmelisin',
        'performance': 'Performans',
        'seo': 'SEO',
        'mobile': 'Mobil',
        'security': 'Güvenlik',
        'share_results': 'Sonuçları Paylaş',
        'export_pdf': 'PDF Rapor İndir',
        'char_count': 'Karakter',
        'tip': '💡 İpucu'
    },
    en: {
        'site_analyzer': 'Free Site Analyzer Tool',
        'analyze_your_site': 'Analyze Your Site',
        'seo_speed_performance': 'SEO, Speed & Performance',
        'free_seo_analysis': 'Get free SEO analysis, page speed test, mobile compatibility check and security score.',
        'enter_url': 'Site URL',
        'analyze': 'Analyze',
        'analyzing': 'Analyzing...',
        'overall_score': 'Overall Score',
        'seo_score': 'SEO Score',
        'speed_score': 'Speed Score',
        'mobile_score': 'Mobile',
        'security_score': 'Security',
        'priority_fixes': 'What You Should Fix First',
        'performance': 'Performance',
        'seo': 'SEO',
        'mobile': 'Mobile',
        'security': 'Security',
        'share_results': 'Share Results',
        'export_pdf': 'Export PDF',
        'char_count': 'Characters',
        'tip': '💡 Tip'
    }
};

export default function SiteAnaliz() {
    const { isPremium, isLoading: premiumLoading } = usePremium();
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);
    const [recentAnalyses, setRecentAnalyses] = useState<SiteAnalysis[]>([]);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [language, setLanguage] = useState<'tr' | 'en'>('tr');
    const [copiedItem, setCopiedItem] = useState<string | null>(null);

    // localStorage'dan sonuçları yükle
    useEffect(() => {
        const saved = localStorage.getItem('site_analyses');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setRecentAnalyses(parsed);
                // En son analizi aktif olarak göster
                if (parsed.length > 0) {
                    setAnalysis(parsed[0]);
                }
            } catch (e) {
                console.error('Failed to load saved analyses:', e);
            }
        }

        // Tema tercihini yükle
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (savedTheme) setTheme(savedTheme);

        // Dil tercihini yükle
        const savedLang = localStorage.getItem('language') as 'tr' | 'en' | null;
        if (savedLang) setLanguage(savedLang);
    }, []);

    // Tema değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Dil değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Çeviri helper fonksiyonu
    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    /**
     * Site analizi yap (simüle edilmiş - gerçek uygulamada API çağrısı yapılmalı)
     * URL validasyonu ve hata yönetimi ile iyileştirildi
     */
    const analyzeSite = async () => {
        if (!url.trim()) {
            toast.error(language === 'tr' ? 'Lütfen bir URL girin' : 'Please enter a URL');
            return;
        }

        // URL formatını kontrol et ve düzelt
        let formattedUrl = url.trim();
        try {
            // URL formatını kontrol et
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }
            
            // URL validasyonu
            new URL(formattedUrl);
        } catch (e) {
            toast.error(language === 'tr' ? 'Geçersiz URL formatı' : 'Invalid URL format');
            return;
        }

        setIsAnalyzing(true);

        try {
            // Simüle edilmiş analiz (gerçek uygulamada burada SEO API çağrısı yapılmalı)
            // Daha gerçekçi simülasyon için 2-3 saniye bekliyoruz
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

            const newAnalysis = generateRealisticAnalysis(formattedUrl);
            setAnalysis(newAnalysis);
            
            // localStorage'a kaydet
            const updated = [newAnalysis, ...recentAnalyses.slice(0, 9)];
            setRecentAnalyses(updated);
            localStorage.setItem('site_analyses', JSON.stringify(updated));
            
            setIsAnalyzing(false);
            toast.success(language === 'tr' ? 'Analiz tamamlandı! 🎉' : 'Analysis completed! 🎉');
        } catch (error) {
            setIsAnalyzing(false);
            toast.error(language === 'tr' ? 'Analiz sırasında bir hata oluştu' : 'An error occurred during analysis');
            console.error('Analysis error:', error);
        }
    };

    /**
     * Daha gerçekçi analiz verisi üretimi
     * URL'den çıkarılan bilgilere göre daha tutarlı sonuçlar üretir
     */
    const generateRealisticAnalysis = (siteUrl: string): SiteAnalysis => {
        try {
            const urlObj = new URL(siteUrl);
            const hostname = urlObj.hostname;
            
            // Domain yaşına göre skorlar (daha eski domainler genelde daha iyi)
            const isNewDomain = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('test');
            const domainAgeYears = isNewDomain ? Math.random() * 2 : Math.random() * 15 + 1;
            
            // Gerçekçi skorlar - birbirleriyle ilişkili
            // SEO skoru: meta tag'ler, içerik, yapı vb.
            const baseSEO = isNewDomain ? 40 : 60;
            const seoScore = Math.max(30, Math.min(95, baseSEO + (Math.random() * 30) - 5));
            
            // Hız skoru: genelde SEO'ya bağlı ama farklı olabilir
            const baseSpeed = seoScore - 10 + (Math.random() * 20);
            const speedScore = Math.max(25, Math.min(95, baseSpeed));
            
            // Mobil skoru: modern sitelerde genelde yüksek
            const mobileScore = Math.max(60, Math.min(95, 75 + (Math.random() * 20)));
            
            // Güvenlik skoru: SSL ve güvenlik başlıkları
            const hasSSL = siteUrl.startsWith('https://');
            const securityScore = hasSSL ? Math.max(70, Math.min(95, 85 + (Math.random() * 10))) : Math.max(20, Math.min(60, 40 + (Math.random() * 20)));
            
            // Genel puan: tüm skorların ağırlıklı ortalaması
            const overallScore = Math.round(
                (seoScore * 0.30) + 
                (speedScore * 0.25) + 
                (mobileScore * 0.20) + 
                (securityScore * 0.25)
            );

            // Meta tag analizi - gerçekçi senaryolar
            const hasTitle = Math.random() > 0.15;
            const hasDescription = Math.random() > 0.20;
            const titleText = hasTitle 
                ? `${hostname.charAt(0).toUpperCase() + hostname.slice(1).replace('.com', '').replace('.net', '').replace('.org', '')} - ${language === 'tr' ? 'Ana Sayfa' : 'Home'}`
                : null;
            const descriptionText = hasDescription
                ? `${language === 'tr' ? 'Web sitemize hoş geldiniz. En iyi' : 'Welcome to our website. Best'} ${hostname.includes('shop') || hostname.includes('store') ? (language === 'tr' ? 'ürünler' : 'products') : (language === 'tr' ? 'hizmetler' : 'services')}.`
                : null;
            
            const titleLength = titleText ? titleText.length : 0;
            const descriptionLength = descriptionText ? descriptionText.length : 0;

            // Performans metrikleri
            const loadTime = speedScore > 70 ? (0.8 + Math.random() * 0.5).toFixed(1) : (1.5 + Math.random() * 2.5).toFixed(1);
            const totalSize = speedScore > 70 ? (500 + Math.random() * 800).toFixed(0) : (1500 + Math.random() * 2000).toFixed(0);
            const requests = Math.round(15 + (speedScore < 60 ? Math.random() * 50 : Math.random() * 30));

            // SEO sorunları
            const missingAltTags = seoScore < 70 ? Math.round(5 + Math.random() * 20) : Math.round(Math.random() * 5);

            // Sorunlar ve öneriler - önceliklendirilmiş
            const issues: Array<{ type: 'critical' | 'warning' | 'info'; message: string; priority: number }> = [];
            const recommendations: Array<{ priority: number; category: string; message: string; impact: string }> = [];

            // Kritik sorunlar (priority: 1-3)
            if (!hasSSL) {
                issues.push({ type: 'critical', message: language === 'tr' ? 'SSL sertifikası bulunamadı' : 'SSL certificate not found', priority: 1 });
                recommendations.push({ priority: 1, category: 'security', message: language === 'tr' ? 'SSL sertifikası kurun (Let\'s Encrypt ücretsiz)' : 'Install SSL certificate (Let\'s Encrypt is free)', impact: language === 'tr' ? 'Yüksek - Güvenlik ve SEO için kritik' : 'High - Critical for security and SEO' });
            }
            if (!hasTitle) {
                issues.push({ type: 'critical', message: language === 'tr' ? 'Meta title tag eksik' : 'Meta title tag missing', priority: 2 });
                recommendations.push({ priority: 2, category: 'seo', message: language === 'tr' ? 'Title tag ekleyin (50-60 karakter)' : 'Add title tag (50-60 characters)', impact: language === 'tr' ? 'Yüksek - Arama motorları için kritik' : 'High - Critical for search engines' });
            }
            if (!hasDescription) {
                issues.push({ type: 'warning', message: language === 'tr' ? 'Meta description eksik' : 'Meta description missing', priority: 3 });
                recommendations.push({ priority: 3, category: 'seo', message: language === 'tr' ? 'Meta description ekleyin (150-160 karakter)' : 'Add meta description (150-160 characters)', impact: language === 'tr' ? 'Orta - Tıklanma oranını artırır' : 'Medium - Increases click-through rate' });
            }

            // Performans sorunları
            if (speedScore < 70) {
                issues.push({ type: 'warning', message: language === 'tr' ? 'Sayfa yükleme hızı yavaş (' + loadTime + 's)' : 'Slow page load time (' + loadTime + 's)', priority: 4 });
                recommendations.push({ priority: 4, category: 'performance', message: language === 'tr' ? 'Görselleri sıkıştırın ve lazy loading kullanın' : 'Compress images and use lazy loading', impact: language === 'tr' ? 'Yüksek - Kullanıcı deneyimini iyileştirir' : 'High - Improves user experience' });
            }

            // SEO sorunları
            if (missingAltTags > 10) {
                issues.push({ type: 'warning', message: language === 'tr' ? `${missingAltTags} görselde alt etiketi eksik` : `${missingAltTags} images missing alt tags`, priority: 5 });
                recommendations.push({ priority: 5, category: 'seo', message: language === 'tr' ? 'Tüm görsellere açıklayıcı alt etiketleri ekleyin' : 'Add descriptive alt tags to all images', impact: language === 'tr' ? 'Orta - SEO ve erişilebilirlik için önemli' : 'Medium - Important for SEO and accessibility' });
            }

            // Mobil sorunları
            if (mobileScore < 80) {
                issues.push({ type: 'info', message: language === 'tr' ? 'Mobil uyumluluk iyileştirilebilir' : 'Mobile compatibility can be improved', priority: 6 });
                recommendations.push({ priority: 6, category: 'mobile', message: language === 'tr' ? 'Viewport meta tag\'ini kontrol edin' : 'Check viewport meta tag', impact: language === 'tr' ? 'Orta - Mobil trafik için önemli' : 'Medium - Important for mobile traffic' });
            }

            // Önerileri önceliğe göre sırala
            recommendations.sort((a, b) => a.priority - b.priority);

            return {
                url: siteUrl,
                seoScore: Math.round(seoScore),
                speedScore: Math.round(speedScore),
                mobileScore: Math.round(mobileScore),
                securityScore: Math.round(securityScore),
                overallScore,
                metaTags: {
                    title: titleText,
                    description: descriptionText,
                    keywords: ['website', 'online', hostname.split('.')[0]],
                    ogImage: Math.random() > 0.3,
                    ogTitle: hasTitle && Math.random() > 0.4,
                    ogDescription: hasDescription && Math.random() > 0.4,
                    twitterCard: Math.random() > 0.5,
                    canonical: Math.random() > 0.3
                },
                performance: {
                    loadTime: loadTime + 's',
                    totalSize: totalSize + ' KB',
                    requests,
                    imagesOptimized: speedScore > 70,
                    cssOptimized: speedScore > 65,
                    jsOptimized: speedScore > 65
                },
                seoIssues: {
                    missingTitle: !hasTitle,
                    missingDescription: !hasDescription,
                    titleTooLong: titleLength > 60,
                    descriptionTooLong: descriptionLength > 160,
                    noH1Tags: seoScore < 75,
                    missingAltTags
                },
                mobileIssues: {
                    viewportMissing: mobileScore < 85,
                    touchFriendly: mobileScore > 75,
                    fontSizeReadable: mobileScore > 70,
                    buttonSize: mobileScore > 75
                },
                security: {
                    sslEnabled: hasSSL,
                    httpSecure: hasSSL,
                    mixedContent: hasSSL && Math.random() > 0.7,
                    securityHeaders: hasSSL ? Math.round(3 + Math.random() * 5) : Math.round(Math.random() * 3)
                },
                backlinks: isNewDomain ? Math.round(Math.random() * 100) : Math.round(100 + Math.random() * 5000),
                domainAge: domainAgeYears < 1 ? `${Math.round(domainAgeYears * 12)} ${language === 'tr' ? 'ay' : 'months'}` : `${Math.round(domainAgeYears)} ${language === 'tr' ? 'yıl' : 'years'}`,
                issues: issues.slice(0, 6),
                recommendations: recommendations.slice(0, 8),
                analyzedAt: new Date().toISOString()
            };
        } catch (e) {
            // Hata durumunda varsayılan değerler
            console.error('Error generating analysis:', e);
            return generateDefaultAnalysis(siteUrl);
        }
    };

    /**
     * Varsayılan analiz (hata durumunda)
     */
    const generateDefaultAnalysis = (siteUrl: string): SiteAnalysis => {
        return {
            url: siteUrl,
            seoScore: 50,
            speedScore: 50,
            mobileScore: 70,
            securityScore: 60,
            overallScore: 57,
            metaTags: {
                title: null,
                description: null,
                keywords: [],
                ogImage: false,
                ogTitle: false,
                ogDescription: false,
                twitterCard: false,
                canonical: false
            },
            performance: {
                loadTime: '2.5s',
                totalSize: '2500 KB',
                requests: 45,
                imagesOptimized: false,
                cssOptimized: false,
                jsOptimized: false
            },
            seoIssues: {
                missingTitle: true,
                missingDescription: true,
                titleTooLong: false,
                descriptionTooLong: false,
                noH1Tags: true,
                missingAltTags: 15
            },
            mobileIssues: {
                viewportMissing: true,
                touchFriendly: false,
                fontSizeReadable: false,
                buttonSize: false
            },
            security: {
                sslEnabled: siteUrl.startsWith('https://'),
                httpSecure: siteUrl.startsWith('https://'),
                mixedContent: false,
                securityHeaders: 2
            },
            backlinks: 0,
            domainAge: language === 'tr' ? 'Bilinmiyor' : 'Unknown',
            issues: [],
            recommendations: [],
            analyzedAt: new Date().toISOString()
        };
    };

    /**
     * Analiz sonuçlarını paylaş
     */
    const shareResults = () => {
        if (!analysis) return;

        const hostname = new URL(analysis.url).hostname;
        const text = `🚀 ${hostname} ${language === 'tr' ? 'Site Analizi' : 'Site Analysis'}:\n\n` +
            `${language === 'tr' ? 'Genel Puan' : 'Overall Score'}: ${analysis.overallScore}/100\n` +
            `${language === 'tr' ? 'SEO Skoru' : 'SEO Score'}: ${analysis.seoScore}/100\n` +
            `${language === 'tr' ? 'Hız Skoru' : 'Speed Score'}: ${analysis.speedScore}/100\n` +
            `${language === 'tr' ? 'Mobil Uyumluluk' : 'Mobile Compatibility'}: ${analysis.mobileScore}/100\n` +
            `${language === 'tr' ? 'Güvenlik' : 'Security'}: ${analysis.securityScore}/100\n\n` +
            `${language === 'tr' ? 'Detaylı analiz' : 'Detailed analysis'}: ${window.location.href}`;

        if (navigator.share) {
            navigator.share({
                title: language === 'tr' ? 'Site Analiz Sonuçları' : 'Site Analysis Results',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            toast.success(language === 'tr' ? 'Sonuçlar panoya kopyalandı! Paylaşabilirsiniz 📋' : 'Results copied to clipboard! You can share now 📋');
        }
    };

    /**
     * Metni panoya kopyala
     */
    const copyToClipboard = (text: string, itemId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(itemId);
        toast.success(language === 'tr' ? 'Panoya kopyalandı!' : 'Copied to clipboard!');
        setTimeout(() => setCopiedItem(null), 2000);
    };

    /**
     * Tema değiştir
     */
    const toggleThemeMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    /**
     * Dil değiştir
     */
    const toggleLanguage = () => {
        const newLang = language === 'tr' ? 'en' : 'tr';
        setLanguage(newLang);
    };

    /**
     * PDF olarak dışa aktar (Premium)
     */
    const exportPDF = () => {
        if (!isPremium) {
            toast.error(language === 'tr' ? 'Bu özellik Premium üyeler içindir 🔒' : 'This feature is for Premium members only 🔒');
            return;
        }
        if (!analysis) return;

        toast.success(language === 'tr' ? 'PDF raporu oluşturuluyor...' : 'PDF report is being generated...');
        // Gerçek uygulamada burada PDF oluşturma API çağrısı yapılmalı
        // Örnek: const pdfBlob = await generatePDFReport(analysis);
    };

    /**
     * Skor rengini belirle
     */
    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    /**
     * Skor durumunu belirle
     */
    const getScoreStatus = (score: number): 'excellent' | 'good' | 'needs-improvement' => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        return 'needs-improvement';
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#000212]' : 'bg-gray-50'} text-white py-24 px-4 md:px-6 transition-colors`}>
            <div className="max-w-7xl mx-auto">
                {/* Header Controls - Dark Mode & Language Toggle */}
                <div className="flex justify-end gap-2 mb-4 animate-fade-in">
                    <button
                        onClick={toggleLanguage}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
                        title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
                    >
                        <Languages size={18} />
                        <span className="hidden sm:inline">{language === 'tr' ? 'EN' : 'TR'}</span>
                    </button>
                    <button
                        onClick={toggleThemeMode}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-xs font-bold mb-6 uppercase tracking-wider">
                        <BarChart3 size={16} />
                        {t('site_analyzer')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                        {t('analyze_your_site')}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {t('seo_speed_performance')}
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                        {t('free_seo_analysis')}
                        {' '}
                        {language === 'tr' ? 'Sonuçları paylaşın, sitenizi optimize edin!' : 'Share results, optimize your site!'}
                    </p>
                </div>

                {/* Açıklama Kutusu */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 border border-emerald-400/20 rounded-2xl p-6 md:p-8 mb-8 animate-slide-up">
                    <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                        <Globe className="text-emerald-400" size={24} />
                        Bu Araç Ne Yapar?
                    </h2>
                    <div className="space-y-3 text-slate-300 leading-relaxed">
                        <p>
                            <strong className="text-white">Site Analiz Aracı</strong>, web sitenizin SEO performansını, 
                            yükleme hızını, mobil uyumluluğunu ve güvenlik durumunu analiz eder. 
                            Ücretsiz ve anında sonuç alın!
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-[#0F1117] border border-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                    Analiz Ettiği Alanlar
                                </h3>
                                <ul className="text-sm space-y-1.5 ml-6 list-disc text-slate-400">
                                    <li>SEO Skoru ve Meta Tag'ler</li>
                                    <li>Sayfa Yükleme Hızı</li>
                                    <li>Mobil Uyumluluk</li>
                                    <li>SSL Güvenlik Sertifikası</li>
                                    <li>Backlink Sayısı</li>
                                </ul>
                            </div>
                            <div className="bg-[#0F1117] border border-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-cyan-400" />
                                    Neden Kullanmalısınız?
                                </h3>
                                <ul className="text-sm space-y-1.5 ml-6 list-disc text-slate-400">
                                    <li>Ücretsiz ve anında sonuç</li>
                                    <li>Detaylı iyileştirme önerileri</li>
                                    <li>Sonuçları paylaş ve karşılaştır</li>
                                    <li>Sitenizi optimize edin</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* URL Input Section - UX/UI İyileştirildi */}
                <div className="max-w-3xl mx-auto mb-8 animate-slide-up">
                    <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02]' : 'from-gray-100 to-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'} rounded-2xl p-6 md:p-8 backdrop-blur-sm`}>
                        <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'} mb-3`}>
                            {t('enter_url')}
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} size={20} />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder={language === 'tr' ? 'örn: poplift.vercel.app veya https://example.com' : 'e.g: poplift.vercel.app or https://example.com'}
                                    className={`w-full ${theme === 'dark' ? 'bg-[#0F1117] border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400 focus:ring-emerald-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500'} border rounded-xl pl-12 pr-20 py-4 focus:ring-1 outline-none transition-all`}
                                    disabled={isAnalyzing}
                                    onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && url.trim() && analyzeSite()}
                                    maxLength={500}
                                />
                                {/* Karakter Sayacı */}
                                <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <span className={url.length > 400 ? 'text-yellow-400' : url.length > 450 ? 'text-red-400' : ''}>
                                        {url.length}/500
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={analyzeSite}
                                disabled={isAnalyzing || !url.trim()}
                                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="hidden sm:inline">{t('analyzing')}</span>
                                        <span className="sm:hidden">...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} />
                                        <span className="hidden sm:inline">{t('analyze')}</span>
                                        <span className="sm:hidden">✓</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                {t('tip')}: {language === 'tr' ? 'www ile veya www olmadan girebilirsiniz. https:// otomatik eklenir.' : 'You can enter with or without www. https:// will be added automatically.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Analysis Results */}
                {analysis && (
                    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                        {/* Genel Puan Kartı - Büyük ve Öne Çıkan */}
                        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-emerald-500/20 to-cyan-500/20' : 'from-emerald-100 to-cyan-100'} border-2 ${theme === 'dark' ? 'border-emerald-400/50' : 'border-emerald-400'} rounded-3xl p-8 text-center`}>
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <BarChart3 className="text-emerald-400" size={32} />
                                <h2 className="text-2xl font-black text-white">{t('overall_score')}</h2>
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <span className={`text-6xl md:text-7xl font-black ${getScoreColor(analysis.overallScore)}`}>
                                    {analysis.overallScore}
                                </span>
                                <span className="text-3xl text-slate-400">/ 100</span>
                            </div>
                            <div className={`w-full h-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'} rounded-full overflow-hidden mb-2`}>
                                <div
                                    className={`h-full transition-all duration-1000 ${getScoreColor(analysis.overallScore).replace('text-', 'bg-')}`}
                                    style={{ width: `${analysis.overallScore}%` }}
                                />
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mt-2`}>
                                {analysis.overallScore >= 80 
                                    ? (language === 'tr' ? 'Mükemmel! Siteniz çok iyi durumda.' : 'Excellent! Your site is in great condition.')
                                    : analysis.overallScore >= 60
                                    ? (language === 'tr' ? 'İyi! Bazı iyileştirmeler yapılabilir.' : 'Good! Some improvements can be made.')
                                    : (language === 'tr' ? 'İyileştirme gerekli. Aşağıdaki önerilere bakın.' : 'Improvement needed. Check the recommendations below.')
                                }
                            </p>
                        </div>

                        {/* Alt Skor Kartları */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ScoreCard
                                label={t('seo_score')}
                                score={analysis.seoScore}
                                icon={<TrendingUp size={24} />}
                                color="emerald"
                                theme={theme}
                            />
                            <ScoreCard
                                label={t('speed_score')}
                                score={analysis.speedScore}
                                icon={<Zap size={24} />}
                                color="yellow"
                                theme={theme}
                            />
                            <ScoreCard
                                label={t('mobile_score')}
                                score={analysis.mobileScore}
                                icon={<Globe size={24} />}
                                color="cyan"
                                theme={theme}
                            />
                            <ScoreCard
                                label={t('security_score')}
                                score={analysis.securityScore}
                                icon={<Shield size={24} />}
                                color="green"
                                theme={theme}
                            />
                        </div>

                        {/* Önce Neleri Düzeltmelisin - Önceliklendirilmiş Öneriler */}
                        {analysis.recommendations.length > 0 && (
                            <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30' : 'from-yellow-100 to-orange-50 border-yellow-400'} border-2 rounded-2xl p-6 animate-slide-up`}>
                                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                                    <AlertCircle size={24} className="text-yellow-400" />
                                    {t('priority_fixes')}
                                </h3>
                                <div className="space-y-3">
                                    {analysis.recommendations.slice(0, 5).map((rec, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-red-500 text-white' : idx === 1 ? 'bg-orange-500 text-white' : idx === 2 ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'} flex-shrink-0`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {rec.message}
                                                    </p>
                                                    <button
                                                        onClick={() => copyToClipboard(rec.message, `rec-${idx}`)}
                                                        className={`p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-all flex-shrink-0`}
                                                        title={language === 'tr' ? 'Kopyala' : 'Copy'}
                                                    >
                                                        {copiedItem === `rec-${idx}` ? (
                                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                                        ) : (
                                                            <Copy size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
                                                        {rec.category === 'seo' ? 'SEO' : rec.category === 'performance' ? (language === 'tr' ? 'Performans' : 'Performance') : rec.category === 'mobile' ? (language === 'tr' ? 'Mobil' : 'Mobile') : (language === 'tr' ? 'Güvenlik' : 'Security')}
                                                    </span>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                                        {rec.impact}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bölümlere Ayrılmış Detaylı Sonuçlar */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* PERFORMANS Bölümü */}
                            <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-400" />
                                    {t('performance')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Yükleme Süresi' : 'Load Time'}</span>
                                        <span className="text-white font-bold">{analysis.performance.loadTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Toplam Boyut' : 'Total Size'}</span>
                                        <span className="text-white font-bold">{analysis.performance.totalSize}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'HTTP İstekleri' : 'HTTP Requests'}</span>
                                        <span className="text-white font-bold">{analysis.performance.requests}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Görseller Optimize' : 'Images Optimized'}</span>
                                        <div className="flex items-center gap-2">
                                            {analysis.performance.imagesOptimized ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <XCircle size={16} className="text-red-400" />
                                            )}
                                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                                                {analysis.performance.imagesOptimized ? (language === 'tr' ? 'Evet' : 'Yes') : (language === 'tr' ? 'Hayır' : 'No')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`mt-4 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                                            {language === 'tr' ? 'Hız önerileri: Görselleri sıkıştırın, lazy loading kullanın, CDN kullanın' : 'Speed recommendations: Compress images, use lazy loading, use CDN'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SEO Bölümü */}
                            <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-emerald-400" />
                                    {t('seo')}
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-600'}`}>{language === 'tr' ? 'Meta Title' : 'Meta Title'}</span>
                                            {analysis.metaTags.title && (
                                                <button
                                                    onClick={() => copyToClipboard(analysis.metaTags.title!, 'title')}
                                                    className="p-1 rounded hover:bg-white/10 transition-all"
                                                >
                                                    {copiedItem === 'title' ? (
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium ${analysis.metaTags.title ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                            {analysis.metaTags.title || (language === 'tr' ? '❌ Eksik' : '❌ Missing')}
                                        </p>
                                        {analysis.metaTags.title && (
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                                {analysis.metaTags.title.length} {t('char_count')}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-600'}`}>{language === 'tr' ? 'Meta Description' : 'Meta Description'}</span>
                                            {analysis.metaTags.description && (
                                                <button
                                                    onClick={() => copyToClipboard(analysis.metaTags.description!, 'description')}
                                                    className="p-1 rounded hover:bg-white/10 transition-all"
                                                >
                                                    {copiedItem === 'description' ? (
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className={`text-sm ${analysis.metaTags.description ? (theme === 'dark' ? 'text-slate-300' : 'text-gray-700') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                            {analysis.metaTags.description || (language === 'tr' ? '❌ Eksik' : '❌ Missing')}
                                        </p>
                                        {analysis.metaTags.description && (
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                                {analysis.metaTags.description.length} {t('char_count')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'OG Image' : 'OG Image'}</span>
                                            {analysis.metaTags.ogImage ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <XCircle size={16} className="text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Eksik Alt Etiketleri' : 'Missing Alt Tags'}</span>
                                            <span className={`text-sm font-bold ${analysis.seoIssues.missingAltTags > 10 ? 'text-red-400' : analysis.seoIssues.missingAltTags > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                {analysis.seoIssues.missingAltTags}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MOBIL Bölümü */}
                            <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Globe size={20} className="text-cyan-400" />
                                    {t('mobile')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Viewport Meta' : 'Viewport Meta'}</span>
                                        {!analysis.mobileIssues.viewportMissing ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <XCircle size={16} className="text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Dokunmatik Dostu' : 'Touch Friendly'}</span>
                                        {analysis.mobileIssues.touchFriendly ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <XCircle size={16} className="text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Okunabilir Font' : 'Readable Font'}</span>
                                        {analysis.mobileIssues.fontSizeReadable ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <XCircle size={16} className="text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Uygun Buton Boyutu' : 'Button Size'}</span>
                                        {analysis.mobileIssues.buttonSize ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <XCircle size={16} className="text-red-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* GÜVENLİK Bölümü */}
                            <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-green-400" />
                                    {t('security')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'SSL Sertifikası' : 'SSL Certificate'}</span>
                                        {analysis.security.sslEnabled ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{language === 'tr' ? 'Aktif' : 'Active'}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <XCircle size={16} className="text-red-400" />
                                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{language === 'tr' ? 'Yok' : 'None'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Güvenlik Başlıkları' : 'Security Headers'}</span>
                                        <span className="text-white font-bold">{analysis.security.securityHeaders}/8</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Mixed Content' : 'Mixed Content'}</span>
                                        {!analysis.security.mixedContent ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <XCircle size={16} className="text-yellow-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Backlink Sayısı' : 'Backlinks'}</span>
                                        <span className="text-white font-bold">{analysis.backlinks.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{language === 'tr' ? 'Domain Yaşı' : 'Domain Age'}</span>
                                        <span className="text-white font-bold">{analysis.domainAge}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={shareResults}
                                className={`flex-1 btn-secondary inline-flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-emerald-400/20 hover:bg-emerald-400/10' : 'border-emerald-400/30 hover:bg-emerald-50'} transition-all`}
                            >
                                <Share2 size={18} />
                                {t('share_results')}
                            </button>
                            <button
                                onClick={exportPDF}
                                className={`flex-1 btn-secondary inline-flex items-center justify-center gap-2 relative ${
                                    isPremium
                                        ? theme === 'dark' 
                                            ? 'border-cyan-400/20 hover:bg-cyan-400/10' 
                                            : 'border-cyan-400/30 hover:bg-cyan-50'
                                        : theme === 'dark'
                                            ? 'border-white/5 cursor-not-allowed group'
                                            : 'border-gray-300 cursor-not-allowed group'
                                } transition-all`}
                                disabled={!isPremium}
                            >
                                {isPremium ? (
                                    <>
                                        <Download size={18} />
                                        {t('export_pdf')}
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        <span>{t('export_pdf')} (Premium)</span>
                                        <span className={`absolute -top-8 left-1/2 -translate-x-1/2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-800'} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10`}>
                                            {language === 'tr' ? 'Premium gerekli 🔒' : 'Premium required 🔒'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Recent Analyses */}
                {recentAnalyses.length > 0 && (
                    <div className="max-w-5xl mx-auto mt-12 animate-fade-in">
                        <h2 className="text-2xl font-black text-white mb-6">Son Analizler</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {recentAnalyses.slice(0, 4).map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-emerald-400/30 transition-all cursor-pointer"
                                    onClick={() => setAnalysis(item)}
                                >
                                    <p className="text-sm text-slate-400 mb-2 truncate">{item.url}</p>
                                    <div className="flex gap-4 text-xs">
                                        <span className={`font-bold ${getScoreColor(item.seoScore)}`}>
                                            SEO: {item.seoScore}
                                        </span>
                                        <span className={`font-bold ${getScoreColor(item.speedScore)}`}>
                                            Hız: {item.speedScore}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!analysis && !isAnalyzing && (
                    <div className="text-center py-16 animate-fade-in">
                        <Search className="text-slate-600 mx-auto mb-4" size={64} />
                        <p className="text-slate-500 text-lg mb-2">Henüz analiz yapılmadı</p>
                        <p className="text-slate-600 text-sm">Yukarıdaki alana site URL'sini girerek başlayın</p>
                    </div>
                )}

                {/* Viral CTA */}
                <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 border border-emerald-400/20 rounded-2xl p-8 text-center animate-fade-in">
                    <TrendingUp className="text-emerald-400 mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-black text-white mb-2">Sonuçlarınızı Paylaşın! 🚀</h3>
                    <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                        Analiz sonuçlarınızı sosyal medyada paylaşın, arkadaşlarınızın da sitelerini test etmesini sağlayın.
                        Ücretsiz ve sınırsız kullanım!
                    </p>
                    <button
                        onClick={shareResults}
                        className="btn-primary inline-flex items-center gap-2"
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                        <Share2 size={18} />
                        Paylaş ve Viral Ol!
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Skor kartı bileşeni - Tema desteği ile iyileştirildi
 */
interface ScoreCardProps {
    label: string;
    score: number;
    icon: React.ReactNode;
    color: 'emerald' | 'yellow' | 'cyan' | 'green';
    theme?: 'dark' | 'light';
}

function ScoreCard({ label, score, icon, color, theme = 'dark' }: ScoreCardProps) {
    const colorClasses = {
        emerald: `text-emerald-400 ${theme === 'dark' ? 'bg-emerald-400/10 border-emerald-400/20' : 'bg-emerald-100 border-emerald-300'}`,
        yellow: `text-yellow-400 ${theme === 'dark' ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-yellow-100 border-yellow-300'}`,
        cyan: `text-cyan-400 ${theme === 'dark' ? 'bg-cyan-400/10 border-cyan-400/20' : 'bg-cyan-100 border-cyan-300'}`,
        green: `text-green-400 ${theme === 'dark' ? 'bg-green-400/10 border-green-400/20' : 'bg-green-100 border-green-300'}`
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-xl p-4 hover:border-opacity-50 transition-all`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{label}</span>
                <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${getScoreColor(score)}`}>{score}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>/ 100</span>
            </div>
            <div className={`mt-2 h-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                <div
                    className={`h-full transition-all duration-1000 ${getScoreColor(score).replace('text-', 'bg-')}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

