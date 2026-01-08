"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Lock, Zap, CheckCircle2, Loader2, Moon, Sun, Languages, FileText, HelpCircle, BookOpen, Target } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';

/**
 * AI Content Generator Component - Geliştirilmiş Versiyon
 * Kullanıcıların kısa açıklamalardan landing page içerikleri üretmesini sağlar
 * 
 * Yeni Özellikler:
 * - SEO anahtar kelime önerileri
 * - Meta title ve meta description (ayrı kartlarda)
 * - FAQ (Sık Sorulan Sorular) üretimi
 * - Blog yazısı taslağı/outline üretimi
 * - Her kartta kopyala butonu
 * - Dark/Light mode toggle
 * - TR/EN dil değiştirici
 * - Karakter sayacı
 * - Hazır örnek prompt önerileri
 * - localStorage ile sonuçların saklanması
 */

// Genişletilmiş içerik interface'i
interface GeneratedContent {
    mainHeadline: string;
    subHeadline: string;
    ctaButtons: string[]; // Birden fazla CTA önerisi
    productDescription: string;
    metaTitle: string;
    metaDescription: string;
    seoKeywords: string[]; // SEO anahtar kelimeleri
    faqs: Array<{ question: string; answer: string }>; // FAQ listesi
    blogOutline: {
        title: string;
        introduction: string;
        sections: Array<{ title: string; content: string; keyPoints: string[] }>;
        conclusion: string;
    };
    generatedAt: string;
}

// Dil desteği için çeviri objesi
const translations: Record<string, Record<string, string>> = {
    tr: {
        'ai_content_generator': 'AI Destekli İçerik Üretici',
        'create_landing_content': 'Landing Page İçeriklerinizi AI ile Oluşturun',
        'enter_description': 'Ürün veya Hizmet Açıklaması',
        'generate_content': 'İçerik Oluştur',
        'generating': 'Oluşturuluyor...',
        'main_headline': 'Ana Başlık',
        'sub_headline': 'Alt Başlık',
        'cta_buttons': 'CTA Buton Metinleri',
        'product_description': 'Ürün Açıklaması',
        'meta_title': 'Meta Title (SEO)',
        'meta_description': 'Meta Description (SEO)',
        'seo_keywords': 'SEO Anahtar Kelimeleri',
        'faq': 'Sık Sorulan Sorular (FAQ)',
        'blog_outline': 'Blog Yazısı Taslağı',
        'copy': 'Kopyala',
        'copied': 'Kopyalandı!',
        'example_prompts': 'Hazır Örnekler',
        'char_count': 'Karakter',
        'free_generations': 'ücretsiz üretim',
        'unlimited_premium': '✨ Premium: Sınırsız üretim',
        'premium_required': 'Premium gerekli 🔒'
    },
    en: {
        'ai_content_generator': 'AI Content Generator',
        'create_landing_content': 'Create Your Landing Page Content with AI',
        'enter_description': 'Product or Service Description',
        'generate_content': 'Generate Content',
        'generating': 'Generating...',
        'main_headline': 'Main Headline',
        'sub_headline': 'Subheadline',
        'cta_buttons': 'CTA Button Texts',
        'product_description': 'Product Description',
        'meta_title': 'Meta Title (SEO)',
        'meta_description': 'Meta Description (SEO)',
        'seo_keywords': 'SEO Keywords',
        'faq': 'Frequently Asked Questions (FAQ)',
        'blog_outline': 'Blog Post Outline',
        'copy': 'Copy',
        'copied': 'Copied!',
        'example_prompts': 'Example Prompts',
        'char_count': 'Characters',
        'free_generations': 'free generations',
        'unlimited_premium': '✨ Premium: Unlimited generations',
        'premium_required': 'Premium required 🔒'
    }
};

// Hazır örnek prompt'lar
const examplePrompts = {
    tr: [
        'E-ticaret sitesi için sepet terk önleme popup sistemi',
        'Online fitness koçluğu platformu',
        'Yapay zeka destekli email pazarlama aracı',
        'Grafik tasarım hizmeti sunan freelance ajansı',
        'SaaS projesi için landing page içerikleri'
    ],
    en: [
        'E-commerce cart abandonment popup system',
        'Online fitness coaching platform',
        'AI-powered email marketing tool',
        'Freelance agency offering graphic design services',
        'Landing page content for SaaS project'
    ]
};

export default function AIContentGenerator() {
    const { isPremium, isLoading: premiumLoading } = usePremium();
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [language, setLanguage] = useState<'tr' | 'en'>('tr');

    // Ücretsiz kullanıcılar için limit kontrolü
    const MAX_FREE_GENERATIONS = 2;
    const canGenerateMore = isPremium || generatedContents.length < MAX_FREE_GENERATIONS;

    // localStorage'dan sonuçları yükle
    useEffect(() => {
        const saved = localStorage.getItem('ai_content_generations');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setGeneratedContents(parsed);
            } catch (e) {
                console.error('Failed to load saved generations:', e);
            }
        }

        // Tema ve dil tercihlerini yükle
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (savedTheme) setTheme(savedTheme);
        const savedLang = localStorage.getItem('language') as 'tr' | 'en' | null;
        if (savedLang) setLanguage(savedLang);
    }, []);

    // Tema ve dil değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Çeviri helper
    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    /**
     * AI içerik üretimi simülasyonu - Geliştirilmiş versiyon
     * Gerçek uygulamada burada AI API çağrısı yapılmalı
     */
    const generateContent = async () => {
        if (!input.trim()) {
            toast.error(language === 'tr' ? 'Lütfen bir açıklama girin' : 'Please enter a description');
            return;
        }

        if (input.length < 10) {
            toast.error(language === 'tr' ? 'Lütfen en az 10 karakter girin' : 'Please enter at least 10 characters');
            return;
        }

        if (!canGenerateMore) {
            toast.error(language === 'tr' ? 'Ücretsiz planınız için günlük limit doldu. Premium\'a geçin!' : 'Daily limit reached for free plan. Upgrade to Premium!');
            return;
        }

        setIsGenerating(true);

        try {
            // Simüle edilmiş AI üretimi (gerçek uygulamada API çağrısı yapılmalı)
            // Daha gerçekçi simülasyon için 2-3 saniye bekliyoruz
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

            const newContent: GeneratedContent = {
                mainHeadline: generateMainHeadline(input),
                subHeadline: generateSubHeadline(input),
                ctaButtons: generateCTAButtons(input), // Birden fazla CTA
                productDescription: generateProductDescription(input),
                metaTitle: generateMetaTitle(input),
                metaDescription: generateMetaDescription(input),
                seoKeywords: generateSEOKeywords(input), // SEO anahtar kelimeleri
                faqs: generateFAQs(input), // FAQ listesi
                blogOutline: generateBlogOutline(input), // Blog taslağı
                generatedAt: new Date().toISOString()
            };

            const updated = [newContent, ...generatedContents.slice(0, 9)];
            setGeneratedContents(updated);
            
            // localStorage'a kaydet
            localStorage.setItem('ai_content_generations', JSON.stringify(updated));
            
            setIsGenerating(false);
            toast.success(language === 'tr' ? 'İçerik başarıyla oluşturuldu! ✨' : 'Content generated successfully! ✨');
        } catch (error) {
            setIsGenerating(false);
            toast.error(language === 'tr' ? 'İçerik oluşturulurken bir hata oluştu' : 'An error occurred while generating content');
            console.error('Content generation error:', error);
        }
    };

    /**
     * İçeriği kopyala - Her kart için ayrı kopyalama
     */
    const copyToClipboard = (text: string, itemId: string) => {
        if (!text) return;

        navigator.clipboard.writeText(text);
        setCopiedItem(itemId);
        toast.success(language === 'tr' ? 'Panoya kopyalandı!' : 'Copied to clipboard!');
        setTimeout(() => setCopiedItem(null), 2000);
    };

    /**
     * Örnek prompt'u seç
     */
    const selectExamplePrompt = (prompt: string) => {
        setInput(prompt);
        toast.success(language === 'tr' ? 'Örnek yüklendi! Analiz etmek için "İçerik Oluştur" butonuna tıklayın.' : 'Example loaded! Click "Generate Content" to analyze.');
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
     * Tüm içeriği JSON olarak dışa aktar (Premium)
     */
    const exportContent = (content: GeneratedContent, index: number) => {
        if (!isPremium) {
            toast.error(language === 'tr' ? 'Bu özellik Premium üyeler içindir 🔒' : 'This feature is for Premium members only 🔒');
            return;
        }

        try {
            const jsonContent = JSON.stringify(content, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-content-${index + 1}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(language === 'tr' ? 'İçerik dışa aktarıldı!' : 'Content exported!');
        } catch (error) {
            toast.error(language === 'tr' ? 'Dışa aktarma sırasında bir hata oluştu' : 'An error occurred during export');
            console.error('Export error:', error);
        }
    };

    /**
     * Başlık üretimi simülasyonu - Daha yaratıcı ve çekici başlıklar
     */
    const generateMainHeadline = (desc: string): string => {
        // Desc'den anahtar kelimeleri çıkar
        const keywords = desc.toLowerCase().split(' ').slice(0, 3).join(' ');
        const templates = [
            // Soru formatlı başlıklar
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} ile Satışlarınızı %40 Artırır mısınız?`,
            `Neden ${desc} Kullanan Şirketler Rakip Farkı Yaratıyor?`,
            
            // İstatistik/ROI odaklı
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} ile %50 Daha Verimli Çalışın`,
            `5000+ Şirket ${desc} ile Hedefine Ulaştı - Sıradaki Siz Olun`,
            
            // Problem-Çözüm formatı
            `${desc} Sorununuzu Çözmüyor mu? İşte Gerçek Çözüm`,
            `Sonunda: ${desc} İçin Profesyonel Çözüm`,
            
            // Değer önerisi
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} ile Zamanınızı Geri Kazanın, Kazancınızı Artırın`,
            `${desc} Konusunda Uzmanların Tercih Ettiği Platform`,
            
            // Duygusal bağlantı
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} Hayalinizdeki Başarıyı Getirir`,
            `İşinizi ${desc} ile Büyütün - Başarı Hikayeleri Sizi Bekliyor`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    };

    /**
     * Alt başlık üretimi simülasyonu - Daha detaylı ve açıklayıcı
     */
    const generateSubHeadline = (desc: string): string => {
        const templates = [
            // Özellik vurgulu
            `${desc} için özel olarak tasarlanmış profesyonel çözüm. 3 dakikada kurulum, ilk sonuçlar bugün.`,
            `Binlerce başarılı şirket ${desc} ile iş süreçlerini optimize ediyor. Siz de aralarına katılın.`,
            
            // İstatistik odaklı
            `${desc} sayesinde %50 daha verimli çalışan ekipler, %30 daha fazla gelir elde ediyor.`,
            `Ortalama 14 günde ROI pozitif olan ${desc} çözümü, işinizi bir üst seviyeye taşıyor.`,
            
            // Fayda odaklı
            `${desc} ile karmaşık süreçleri basitleştirin, zaman kazanın ve odaklanmanız gereken işlere yönelin.`,
            `Kullanıcı dostu arayüzü ve güçlü özellikleriyle ${desc} deneyimini bugün keşfedin.`,
            
            // Sosyal kanıt
            `Türkiye'nin en başarılı şirketlerinin tercih ettiği ${desc} platformu.`,
            `${desc} ile hedefinize ulaşmanın kolay yolunu bulun. Ücretsiz deneyin, farkı görün.`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    };

    /**
     * CTA buton metinleri üretimi - Birden fazla öneri
     */
    const generateCTAButtons = (desc: string): string[] => {
        const allTemplates = [
            // Aciliyet yaratan
            language === 'tr' ? 'Hemen Başla - Ücretsiz' : 'Start Now - Free',
            language === 'tr' ? 'Şimdi Deneyin - Kredi Kartı Yok' : 'Try Now - No Credit Card',
            language === 'tr' ? 'Bugün Başlayın' : 'Start Today',
            
            // Değer vurgulu
            language === 'tr' ? 'Ücretsiz Dene - 14 Gün' : 'Try Free - 14 Days',
            language === 'tr' ? 'Başarıya Başla' : 'Start Succeeding',
            language === 'tr' ? 'Hemen Keşfet' : 'Discover Now',
            
            // Merak uyandıran
            language === 'tr' ? 'Nasıl Çalıştığını Gör' : 'See How It Works',
            language === 'tr' ? 'Demo İzle' : 'Watch Demo',
            language === 'tr' ? 'Detayları Öğren' : 'Learn More',
            
            // Aksiyon odaklı
            language === 'tr' ? 'Hemen Satın Al' : 'Buy Now',
            language === 'tr' ? 'Planı İncele' : 'View Plans',
            language === 'tr' ? 'Sizi Arayalım' : 'Request Call'
        ];
        
        // 3-5 arası rastgele CTA seç
        const count = 3 + Math.floor(Math.random() * 3);
        const selected: string[] = [];
        const used = new Set<number>();
        
        while (selected.length < count && used.size < allTemplates.length) {
            const idx = Math.floor(Math.random() * allTemplates.length);
            if (!used.has(idx)) {
                used.add(idx);
                selected.push(allTemplates[idx]);
            }
        }
        
        return selected;
    };

    /**
     * Meta Title üretimi - SEO optimize
     */
    const generateMetaTitle = (desc: string): string => {
        const keywords = extractKeywords(desc);
        const templates = [
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} | ${language === 'tr' ? 'En İyi Çözüm' : 'Best Solution'} 2024`,
            `${language === 'tr' ? 'Profesyonel' : 'Professional'} ${desc} ${language === 'tr' ? 'Hizmeti' : 'Service'} | ${keywords[0] || 'Online'}`,
            `${desc.charAt(0).toUpperCase() + desc.slice(1)} ${language === 'tr' ? 'ile Başarıya Ulaşın' : 'for Success'} | ${keywords[1] || 'Premium'}`,
            `${keywords[0] || desc.charAt(0).toUpperCase() + desc.slice(1)} ${language === 'tr' ? 'Çözümü' : 'Solution'} - ${desc.slice(0, 40)}`
        ];
        const title = templates[Math.floor(Math.random() * templates.length)];
        // 60 karakter limiti
        return title.length > 60 ? title.slice(0, 57) + '...' : title;
    };

    /**
     * Ürün açıklaması üretimi - Daha zengin ve ikna edici
     */
    const generateProductDescription = (desc: string): string => {
        const descriptions = [
            `${desc} konusunda ihtiyacınız olan tüm araçları tek bir platformda bulun. Kullanıcı dostu arayüzü, güçlü özellikleri ve 7/24 destek ile ${desc} süreçlerinizi kolaylaştırın. Binlerce memnun müşteri ile kanıtlanmış çözüm.`,
            
            `${desc} için tasarlanmış profesyonel platform, iş süreçlerinizi optimize eder ve verimliliğinizi artırır. Kolay kurulum, anında sonuç. Deneyen binlerce şirket %40 oranında daha verimli çalıştıklarını raporladı.`,
            
            `Modern işletmelerin tercih ettiği ${desc} çözümü, size zamandan ve paradan tasarruf sağlar. Otomatikleştirilmiş süreçler, detaylı raporlama ve özelleştirilebilir özelliklerle işinizi büyütün. İlk 30 gün garantili para iadesi.`
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    };

    /**
     * SEO meta description üretimi - 150-160 karakter optimize
     */
    const generateMetaDescription = (desc: string): string => {
        const keywords = extractKeywords(desc);
        const templates = [
            language === 'tr' 
                ? `${desc} için profesyonel çözüm. ${keywords[0] || 'Güvenilir'}, ${keywords[1] || 'hızlı'} ve ${keywords[2] || 'etkili'}. Ücretsiz deneme mevcut.`
                : `Professional solution for ${desc}. ${keywords[0] || 'Reliable'}, ${keywords[1] || 'fast'} and ${keywords[2] || 'effective'}. Free trial available.`,
            language === 'tr'
                ? `Türkiye'nin en popüler ${desc} platformu. Binlerce başarılı şirket. Kolay kurulum, anında sonuçlar.`
                : `Turkey's most popular ${desc} platform. Thousands of successful companies. Easy setup, instant results.`,
            language === 'tr'
                ? `${desc} ile iş süreçlerinizi optimize edin. Kullanıcı dostu, güçlü özellikler, 7/24 destek. Bugün başlayın.`
                : `Optimize your business processes with ${desc}. User-friendly, powerful features, 24/7 support. Start today.`
        ];
        const description = templates[Math.floor(Math.random() * templates.length)];
        // 155 karakter limiti
        return description.length > 155 ? description.slice(0, 152) + '...' : description;
    };

    /**
     * SEO anahtar kelimeleri üretimi
     */
    const generateSEOKeywords = (desc: string): string[] => {
        const baseKeywords = extractKeywords(desc);
        const additionalKeywords = language === 'tr' 
            ? ['online', 'profesyonel', 'güvenilir', 'hızlı', 'etkili', 'çözüm', 'platform', 'hizmet', 'araç', 'sistem']
            : ['online', 'professional', 'reliable', 'fast', 'effective', 'solution', 'platform', 'service', 'tool', 'system'];
        
        const allKeywords = [...new Set([...baseKeywords, ...additionalKeywords])];
        // 10-15 arası anahtar kelime seç
        return allKeywords.slice(0, 10 + Math.floor(Math.random() * 6));
    };

    /**
     * Anahtar kelimeleri çıkar
     */
    const extractKeywords = (text: string): string[] => {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        // Stop words'leri filtrele
        const stopWords = language === 'tr' 
            ? ['için', 'ile', 'veya', 've', 'bir', 'bu', 'şu', 'olan', 'olarak']
            : ['for', 'with', 'or', 'and', 'a', 'an', 'the', 'this', 'that', 'is', 'are'];
        
        return words.filter(word => !stopWords.includes(word)).slice(0, 5);
    };

    /**
     * FAQ (Sık Sorulan Sorular) üretimi
     */
    const generateFAQs = (desc: string): Array<{ question: string; answer: string }> => {
        const faqTemplates = language === 'tr'
            ? [
                {
                    question: `${desc} nedir ve nasıl çalışır?`,
                    answer: `${desc}, iş süreçlerinizi optimize etmenizi sağlayan profesyonel bir çözümdür. Kullanıcı dostu arayüzü sayesinde kolayca kullanılabilir ve hızlı sonuçlar verir.`
                },
                {
                    question: `${desc} için ücret ne kadar?`,
                    answer: `${desc} hizmetimiz için esnek fiyatlandırma seçeneklerimiz mevcuttur. İhtiyacınıza uygun planı seçebilir ve ücretsiz deneme ile başlayabilirsiniz.`
                },
                {
                    question: `${desc} kurulumu ne kadar sürer?`,
                    answer: `${desc} kurulumu oldukça basittir ve genellikle 5-10 dakika içinde tamamlanır. Teknik destek ekibimiz kurulum sürecinde size yardımcı olacaktır.`
                },
                {
                    question: `${desc} mobil cihazlarda çalışır mı?`,
                    answer: `Evet, ${desc} tamamen mobil uyumludur. Hem iOS hem de Android cihazlarda sorunsuz çalışır ve tüm özelliklere erişebilirsiniz.`
                },
                {
                    question: `${desc} için destek alabilir miyim?`,
                    answer: `Tabii ki! ${desc} için 7/24 müşteri desteği sunuyoruz. E-posta, canlı sohbet veya telefon ile bize ulaşabilirsiniz.`
                }
            ]
            : [
                {
                    question: `What is ${desc} and how does it work?`,
                    answer: `${desc} is a professional solution that helps you optimize your business processes. It features a user-friendly interface, is easy to use, and delivers fast results.`
                },
                {
                    question: `How much does ${desc} cost?`,
                    answer: `We offer flexible pricing options for ${desc}. You can choose a plan that suits your needs and start with a free trial.`
                },
                {
                    question: `How long does ${desc} setup take?`,
                    answer: `${desc} setup is quite simple and usually completes within 5-10 minutes. Our technical support team will assist you during the setup process.`
                },
                {
                    question: `Does ${desc} work on mobile devices?`,
                    answer: `Yes, ${desc} is fully mobile compatible. It works seamlessly on both iOS and Android devices, and you can access all features.`
                },
                {
                    question: `Can I get support for ${desc}?`,
                    answer: `Of course! We offer 24/7 customer support for ${desc}. You can reach us via email, live chat, or phone.`
                }
            ];
        
        // 3-5 arası FAQ seç
        const count = 3 + Math.floor(Math.random() * 3);
        const selected: Array<{ question: string; answer: string }> = [];
        const used = new Set<number>();
        
        while (selected.length < count && used.size < faqTemplates.length) {
            const idx = Math.floor(Math.random() * faqTemplates.length);
            if (!used.has(idx)) {
                used.add(idx);
                selected.push(faqTemplates[idx]);
            }
        }
        
        return selected;
    };

    /**
     * Blog yazısı taslağı/outline üretimi
     */
    const generateBlogOutline = (desc: string): {
        title: string;
        introduction: string;
        sections: Array<{ title: string; content: string; keyPoints: string[] }>;
        conclusion: string;
    } => {
        const sections = language === 'tr'
            ? [
                {
                    title: `${desc} Nedir?`,
                    content: `${desc} hakkında genel bilgiler ve temel kavramlar.`,
                    keyPoints: [
                        `${desc} tanımı`,
                        `${desc} temel özellikleri`,
                        `${desc} kullanım alanları`
                    ]
                },
                {
                    title: `${desc} Avantajları`,
                    content: `${desc} kullanmanın sağladığı avantajlar ve faydalar.`,
                    keyPoints: [
                        'Zaman tasarrufu',
                        'Maliyet etkinliği',
                        'Verimlilik artışı'
                    ]
                },
                {
                    title: `${desc} Nasıl Kullanılır?`,
                    content: `${desc} kullanımı için adım adım rehber.`,
                    keyPoints: [
                        'Kurulum adımları',
                        'Temel kullanım',
                        'İleri seviye özellikler'
                    ]
                },
                {
                    title: `${desc} İçin En İyi Uygulamalar`,
                    content: `${desc} kullanımında başarı için öneriler ve ipuçları.`,
                    keyPoints: [
                        'En iyi pratikler',
                        'Yaygın hatalar',
                        'Optimizasyon ipuçları'
                    ]
                }
            ]
            : [
                {
                    title: `What is ${desc}?`,
                    content: `General information and basic concepts about ${desc}.`,
                    keyPoints: [
                        `${desc} definition`,
                        `Key features of ${desc}`,
                        `Use cases of ${desc}`
                    ]
                },
                {
                    title: `Benefits of ${desc}`,
                    content: `Advantages and benefits of using ${desc}.`,
                    keyPoints: [
                        'Time savings',
                        'Cost effectiveness',
                        'Increased efficiency'
                    ]
                },
                {
                    title: `How to Use ${desc}?`,
                    content: `Step-by-step guide for using ${desc}.`,
                    keyPoints: [
                        'Setup steps',
                        'Basic usage',
                        'Advanced features'
                    ]
                },
                {
                    title: `Best Practices for ${desc}`,
                    content: `Recommendations and tips for success with ${desc}.`,
                    keyPoints: [
                        'Best practices',
                        'Common mistakes',
                        'Optimization tips'
                    ]
                }
            ];
        
        const selectedSections = sections.slice(0, 3 + Math.floor(Math.random() * 2));
        
        return {
            title: language === 'tr'
                ? `${desc} Hakkında Kapsamlı Rehber: Başarıya Giden Yol`
                : `Comprehensive Guide to ${desc}: Path to Success`,
            introduction: language === 'tr'
                ? `${desc} günümüz iş dünyasında kritik bir rol oynamaktadır. Bu rehberde ${desc} hakkında bilmeniz gereken her şeyi bulacaksınız.`
                : `${desc} plays a critical role in today's business world. In this guide, you'll find everything you need to know about ${desc}.`,
            sections: selectedSections,
            conclusion: language === 'tr'
                ? `${desc} ile ilgili tüm bu bilgiler, işinizi bir üst seviyeye taşımanıza yardımcı olacaktır. Başlamak için hemen bugün adım atın.`
                : `All this information about ${desc} will help you take your business to the next level. Take action today to get started.`
        };
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#000212]' : 'bg-gray-50'} text-white py-24 px-4 md:px-6 transition-colors`}>
            <div className="max-w-6xl mx-auto">
                {/* Header Controls - Dark Mode & Language Toggle */}
                <div className="flex justify-end gap-2 mb-4 animate-fade-in">
                    <button
                        onClick={toggleLanguage}
                        className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'} border transition-all flex items-center gap-2 text-sm`}
                        title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
                    >
                        <Languages size={18} />
                        <span className="hidden sm:inline">{language === 'tr' ? 'EN' : 'TR'}</span>
                    </button>
                    <button
                        onClick={toggleThemeMode}
                        className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'} border transition-all`}
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-brand-orange/10 border-brand-orange/20' : 'bg-orange-100 border-orange-300'} border rounded-full text-brand-orange text-xs font-bold mb-6 uppercase tracking-wider`}>
                        <Sparkles size={16} />
                        {t('ai_content_generator')}
                    </div>
                    <h1 className={`text-4xl md:text-6xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 leading-tight`}>
                        {t('create_landing_content')}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-200">
                            {language === 'tr' ? 'AI ile Oluşturun' : 'Generate with AI'}
                        </span>
                    </h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto mb-6`}>
                        {language === 'tr' 
                            ? 'Kısa bir açıklama girerek profesyonel landing page başlıkları, alt başlıklar, CTA metinleri, SEO açıklamaları, FAQ ve blog taslakları oluşturun.'
                            : 'Enter a short description to generate professional landing page headlines, subheadlines, CTA texts, SEO descriptions, FAQs and blog outlines.'}
                    </p>
                    
                    {/* Detaylı Açıklama Kutusu */}
                    <div className={`max-w-4xl mx-auto bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6 md:p-8 text-left mb-8 animate-slide-up`}>
                        <h2 className={`text-2xl font-black mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            <Zap className="text-brand-orange" size={24} />
                            {language === 'tr' ? 'Bu Araç Ne Yapar?' : 'What Does This Tool Do?'}
                        </h2>
                        <div className={`space-y-4 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                            <p>
                                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t('ai_content_generator')}</strong>
                                {' '}
                                {language === 'tr' 
                                    ? ', pazarlama ve satış ekiplerinin ihtiyaç duyduğu landing page içeriklerini saniyeler içinde oluşturmanızı sağlar. Ürün veya hizmetiniz hakkında kısa bir açıklama yazmanız yeterli; sistem sizin için profesyonel, SEO uyumlu ve dönüşüm odaklı içerikler üretir.'
                                    : ', helps you create landing page content that marketing and sales teams need in seconds. Just write a short description about your product or service; the system generates professional, SEO-compliant and conversion-focused content for you.'}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                <div className={`${theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                                    <h3 className={`font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                        {language === 'tr' ? 'Nasıl Çalışır?' : 'How Does It Work?'}
                                    </h3>
                                    <ol className={`text-sm space-y-2 ml-6 list-decimal ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                                        <li>{language === 'tr' ? 'Ürün/hizmet açıklamanızı girin' : 'Enter your product/service description'}</li>
                                        <li>{language === 'tr' ? 'AI sistem içeriği analiz eder' : 'AI system analyzes the content'}</li>
                                        <li>{language === 'tr' ? '8+ farklı içerik türü üretilir' : '8+ different content types are generated'}</li>
                                        <li>{language === 'tr' ? 'Kopyalayıp kullanmaya hazır!' : 'Ready to copy and use!'}</li>
                                    </ol>
                                </div>
                                
                                <div className={`${theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                                    <h3 className={`font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <CheckCircle2 size={18} className="text-brand-orange" />
                                        {language === 'tr' ? 'Ne Üretir?' : 'What Does It Generate?'}
                                    </h3>
                                    <ul className={`text-sm space-y-2 ml-6 list-disc ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                                        <li>{language === 'tr' ? 'Ana başlık ve alt başlık' : 'Main headline and subheadline'}</li>
                                        <li>{language === 'tr' ? 'CTA buton metinleri' : 'CTA button texts'}</li>
                                        <li>{language === 'tr' ? 'Meta title ve description (SEO)' : 'Meta title and description (SEO)'}</li>
                                        <li>{language === 'tr' ? 'SEO anahtar kelimeleri' : 'SEO keywords'}</li>
                                        <li>{language === 'tr' ? 'FAQ (Sık Sorulan Sorular)' : 'FAQ (Frequently Asked Questions)'}</li>
                                        <li>{language === 'tr' ? 'Blog yazısı taslağı' : 'Blog post outline'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kullanım Örnekleri */}
                    <div className={`max-w-4xl mx-auto bg-gradient-to-br ${theme === 'dark' ? 'from-brand-orange/10 to-yellow-400/10 border-brand-orange/20' : 'from-orange-100 to-yellow-100 border-orange-300'} border rounded-2xl p-6 md:p-8 text-left mb-8 animate-slide-up`}>
                        <h2 className={`text-2xl font-black mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            <Sparkles className="text-brand-orange" size={24} />
                            {language === 'tr' ? 'Örnek Kullanımlar' : 'Usage Examples'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {(language === 'tr' ? [
                                {
                                    example: "E-ticaret sitesi için sepet terk önleme popup sistemi",
                                    result: "Sepeti Terk Edenleri Dur, %27 Daha Fazla Satış Yap"
                                },
                                {
                                    example: "Online fitness koçluğu platformu",
                                    result: "Evden Spor Yap, Hedefine Ulaş - Kişisel Antrenör Deneyimi"
                                },
                                {
                                    example: "Yapay zeka destekli email pazarlama aracı",
                                    result: "Email Pazarlamanı AI ile Güçlendir, Açılma Oranını 3x Artır"
                                }
                            ] : [
                                {
                                    example: "E-commerce cart abandonment popup system",
                                    result: "Stop Cart Abandonment, Increase Sales by 27%"
                                },
                                {
                                    example: "Online fitness coaching platform",
                                    result: "Workout from Home, Reach Your Goals - Personal Trainer Experience"
                                },
                                {
                                    example: "AI-powered email marketing tool",
                                    result: "Enhance Your Email Marketing with AI, 3x Open Rate"
                                }
                            ]).map((item, idx) => (
                                <div key={idx} className={`${theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-4 hover:border-brand-orange/30 transition-all`}>
                                    <p className={`text-xs mb-2 font-bold uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                        {language === 'tr' ? 'Örnek Giriş:' : 'Example Input:'}
                                    </p>
                                    <p className={`text-sm mb-3 italic ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>"{item.example}"</p>
                                    <p className={`text-xs mb-2 font-bold uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                        {language === 'tr' ? 'Üretilen Başlık:' : 'Generated Headline:'}
                                    </p>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>"{item.result}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hazır Örnek Prompt Önerileri */}
                <div className="max-w-4xl mx-auto mb-6 animate-slide-up">
                    <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-200'} border rounded-xl p-4`}>
                        <label className={`block text-xs font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
                            {t('example_prompts')}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {examplePrompts[language].slice(0, 3).map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectExamplePrompt(prompt)}
                                    disabled={isGenerating}
                                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${theme === 'dark' ? 'border-white/10 hover:border-brand-orange/50 hover:bg-brand-orange/10 text-slate-300' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Section - Karakter Sayacı ile */}
                <div className="mb-8 animate-slide-up">
                    <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-200'} border rounded-2xl p-6 md:p-8 backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-3">
                            <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                                {t('enter_description')}
                            </label>
                            {/* Karakter Sayacı */}
                            <span className={`text-xs ${input.length > 400 ? 'text-yellow-400' : input.length > 450 ? 'text-red-400' : theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                {input.length}/500 {t('char_count')}
                            </span>
                        </div>
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) {
                                        setInput(e.target.value);
                                    }
                                }}
                                placeholder={language === 'tr' ? 'Örn: E-ticaret sitesi için sepet terk önleme popup sistemi...' : 'e.g: E-commerce cart abandonment popup system...'}
                                className={`w-full h-32 ${theme === 'dark' ? 'bg-[#0F1117] border-white/10 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-brand-orange' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500'} border rounded-xl px-4 py-3 focus:ring-1 outline-none transition-all resize-none`}
                                disabled={isGenerating}
                                maxLength={500}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                            <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                {isPremium ? (
                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        {t('unlimited_premium')}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        {generatedContents.length}/{MAX_FREE_GENERATIONS} {t('free_generations')}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={generateContent}
                                disabled={isGenerating || !input.trim() || input.length < 10 || !canGenerateMore}
                                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="hidden sm:inline">{t('generating')}</span>
                                        <span className="sm:hidden">...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        <span className="hidden sm:inline">{t('generate_content')}</span>
                                        <span className="sm:hidden">{language === 'tr' ? 'Oluştur' : 'Generate'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {(language === 'tr' ? [
                        { icon: Sparkles, title: 'AI Destekli', desc: 'Gelişmiş AI algoritmaları ile profesyonel içerik' },
                        { icon: Zap, title: 'Hızlı Üretim', desc: 'Saniyeler içinde hazır landing page içerikleri' },
                        { icon: CheckCircle2, title: 'SEO Optimize', desc: 'Arama motorları için optimize edilmiş metinler' }
                    ] : [
                        { icon: Sparkles, title: 'AI Powered', desc: 'Professional content with advanced AI algorithms' },
                        { icon: Zap, title: 'Fast Generation', desc: 'Ready landing page content in seconds' },
                        { icon: CheckCircle2, title: 'SEO Optimized', desc: 'Search engine optimized texts' }
                    ]).map((feature, idx) => (
                        <div
                            key={idx}
                            className={`${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-brand-orange/30' : 'bg-white border-gray-300 hover:border-orange-400'} border rounded-xl p-6 transition-all animate-fade-in`}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <feature.icon className="text-brand-orange mb-3" size={24} />
                            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Generated Contents - Ayrı Kartlarda Gösterim */}
                {generatedContents.length > 0 && (
                    <div className="space-y-8">
                        <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                            {language === 'tr' ? `Oluşturulan İçerikler (${generatedContents.length})` : `Generated Contents (${generatedContents.length})`}
                        </h2>
                        {generatedContents.map((content, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6 md:p-8 hover:border-brand-orange/30 transition-all animate-slide-up`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${theme === 'dark' ? 'bg-brand-orange/10' : 'bg-orange-100'} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-brand-orange font-black text-lg">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {language === 'tr' ? `İçerik Seti #${index + 1}` : `Content Set #${index + 1}`}
                                            </h3>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                                                {language === 'tr' ? 'Az önce oluşturuldu' : 'Just created'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            onClick={() => copyToClipboard(JSON.stringify(content, null, 2), `all-${index}`)}
                                            className={`p-2.5 rounded-xl border transition-all ${
                                                isPremium
                                                    ? theme === 'dark'
                                                        ? 'border-white/10 hover:border-brand-orange/50 hover:bg-brand-orange/10 text-white'
                                                        : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
                                                    : theme === 'dark'
                                                        ? 'border-white/5 text-slate-600 cursor-not-allowed relative group'
                                                        : 'border-gray-200 text-gray-400 cursor-not-allowed relative group'
                                            }`}
                                            title={isPremium ? (language === 'tr' ? 'Tümünü Kopyala' : 'Copy All') : t('premium_required')}
                                        >
                                            {isPremium ? (
                                                copiedItem === `all-${index}` ? (
                                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                                ) : (
                                                    <Copy size={18} />
                                                )
                                            ) : (
                                                <>
                                                    <Lock size={18} />
                                                    <span className={`absolute -top-8 left-1/2 -translate-x-1/2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-800'} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10`}>
                                                        {t('premium_required')}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        {isPremium && (
                                            <button
                                                onClick={() => exportContent(content, index)}
                                                className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'border-white/10 hover:border-brand-orange/50 hover:bg-brand-orange/10 text-white' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700'}`}
                                                title={language === 'tr' ? 'Dışa Aktar (JSON)' : 'Export (JSON)'}
                                            >
                                                <Download size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Sonuç Paneli - Ayrı Kartlarda */}
                                <div className="space-y-6">
                                    {/* Başlıklar Bölümü */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ResultCard
                                            label={t('main_headline')}
                                            value={content.mainHeadline}
                                            itemId={`headline-${index}`}
                                            copied={copiedItem === `headline-${index}`}
                                            onCopy={() => copyToClipboard(content.mainHeadline, `headline-${index}`)}
                                            theme={theme}
                                            language={language}
                                        />
                                        <ResultCard
                                            label={t('sub_headline')}
                                            value={content.subHeadline}
                                            itemId={`subheadline-${index}`}
                                            copied={copiedItem === `subheadline-${index}`}
                                            onCopy={() => copyToClipboard(content.subHeadline, `subheadline-${index}`)}
                                            theme={theme}
                                            language={language}
                                        />
                                    </div>

                                    {/* CTA Butonları */}
                                    <ResultCard
                                        label={t('cta_buttons')}
                                        value={Array.isArray(content.ctaButtons) ? content.ctaButtons.join('\n• ') : content.ctaButtons}
                                        itemId={`cta-${index}`}
                                        copied={copiedItem === `cta-${index}`}
                                        onCopy={() => copyToClipboard(Array.isArray(content.ctaButtons) ? content.ctaButtons.join('\n') : content.ctaButtons, `cta-${index}`)}
                                        theme={theme}
                                        language={language}
                                        multiline
                                        prefix="• "
                                    />

                                    {/* Ürün Açıklaması */}
                                    <ResultCard
                                        label={t('product_description')}
                                        value={content.productDescription}
                                        itemId={`description-${index}`}
                                        copied={copiedItem === `description-${index}`}
                                        onCopy={() => copyToClipboard(content.productDescription, `description-${index}`)}
                                        theme={theme}
                                        language={language}
                                        multiline
                                    />

                                    {/* SEO Meta Tags */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ResultCard
                                            label={t('meta_title')}
                                            value={content.metaTitle || (language === 'tr' ? 'Eksik' : 'Missing')}
                                            itemId={`meta-title-${index}`}
                                            copied={copiedItem === `meta-title-${index}`}
                                            onCopy={() => content.metaTitle && copyToClipboard(content.metaTitle, `meta-title-${index}`)}
                                            theme={theme}
                                            language={language}
                                        />
                                        <ResultCard
                                            label={t('meta_description')}
                                            value={content.metaDescription}
                                            itemId={`meta-desc-${index}`}
                                            copied={copiedItem === `meta-desc-${index}`}
                                            onCopy={() => copyToClipboard(content.metaDescription, `meta-desc-${index}`)}
                                            theme={theme}
                                            language={language}
                                            multiline
                                        />
                                    </div>

                                    {/* SEO Anahtar Kelimeleri */}
                                    {content.seoKeywords && content.seoKeywords.length > 0 && (
                                        <ResultCard
                                            label={t('seo_keywords')}
                                            value={content.seoKeywords.join(', ')}
                                            itemId={`keywords-${index}`}
                                            copied={copiedItem === `keywords-${index}`}
                                            onCopy={() => copyToClipboard(content.seoKeywords.join(', '), `keywords-${index}`)}
                                            theme={theme}
                                            language={language}
                                            badges={content.seoKeywords}
                                        />
                                    )}

                                    {/* FAQ Bölümü */}
                                    {content.faqs && content.faqs.length > 0 && (
                                        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    <HelpCircle size={20} className="text-brand-orange" />
                                                    {t('faq')}
                                                </h3>
                                                <button
                                                    onClick={() => copyToClipboard(
                                                        content.faqs.map(faq => `S: ${faq.question}\nC: ${faq.answer}`).join('\n\n'),
                                                        `faq-${index}`
                                                    )}
                                                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-all`}
                                                    title={t('copy')}
                                                >
                                                    {copiedItem === `faq-${index}` ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {content.faqs.map((faq, faqIdx) => (
                                                    <div key={faqIdx} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-gray-200'} border`}>
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {faqIdx + 1}. {faq.question}
                                                            </p>
                                                            <button
                                                                onClick={() => copyToClipboard(`S: ${faq.question}\nC: ${faq.answer}`, `faq-item-${index}-${faqIdx}`)}
                                                                className="p-1.5 rounded hover:bg-white/10 transition-all flex-shrink-0"
                                                            >
                                                                {copiedItem === `faq-item-${index}-${faqIdx}` ? (
                                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                                ) : (
                                                                    <Copy size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'} ml-4`}>
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Blog Taslağı */}
                                    {content.blogOutline && (
                                        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-2xl p-6`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    <BookOpen size={20} className="text-brand-orange" />
                                                    {t('blog_outline')}
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        const outlineText = `${content.blogOutline.title}\n\n${content.blogOutline.introduction}\n\n${content.blogOutline.sections.map((s, idx) => 
                                                            `${idx + 1}. ${s.title}\n   ${s.content}\n   ${s.keyPoints.map(kp => `   - ${kp}`).join('\n')}`
                                                        ).join('\n\n')}\n\n${content.blogOutline.conclusion}`;
                                                        copyToClipboard(outlineText, `blog-${index}`);
                                                    }}
                                                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-all`}
                                                    title={t('copy')}
                                                >
                                                    {copiedItem === `blog-${index}` ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {content.blogOutline.title}
                                                    </h4>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'} mb-4`}>
                                                        {content.blogOutline.introduction}
                                                    </p>
                                                </div>
                                                {content.blogOutline.sections.map((section, sectionIdx) => (
                                                    <div key={sectionIdx} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-gray-200'} border`}>
                                                        <h5 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                            {sectionIdx + 1}. {section.title}
                                                        </h5>
                                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                                                            {section.content}
                                                        </p>
                                                        <ul className={`text-xs space-y-1 ml-4 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                                                            {section.keyPoints.map((point, pointIdx) => (
                                                                <li key={pointIdx} className="list-disc">{point}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                <div>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                                                        {content.blogOutline.conclusion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Premium Upgrade CTA */}
                {!isPremium && generatedContents.length >= MAX_FREE_GENERATIONS && (
                    <div className={`mt-12 bg-gradient-to-r ${theme === 'dark' ? 'from-brand-orange/10 to-yellow-400/10 border-brand-orange/20' : 'from-orange-100 to-yellow-100 border-orange-300'} border-2 rounded-2xl p-6 md:p-8 text-center animate-fade-in`}>
                        <Lock className="text-brand-orange mx-auto mb-4" size={48} />
                        <h3 className={`text-xl md:text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'tr' ? 'Premium\'a Geçin, Sınırsız Üretin!' : 'Upgrade to Premium, Generate Unlimited!'}
                        </h3>
                        <p className={`text-sm md:text-base mb-6 max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {language === 'tr' 
                                ? 'Premium üyelik ile sınırsız içerik üretimi, kopyalama ve dışa aktarma özelliklerinin keyfini çıkarın.'
                                : 'Enjoy unlimited content generation, copying and export features with Premium membership.'}
                        </p>
                        <a
                            href="/pricing"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            {language === 'tr' ? 'Premium\'a Geç' : 'Upgrade to Premium'}
                            <Zap size={18} />
                        </a>
                    </div>
                )}

                {/* Empty State */}
                {generatedContents.length === 0 && !isGenerating && (
                    <div className="text-center py-12 md:py-16 animate-fade-in">
                        <Sparkles className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} size={48} />
                        <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-slate-500' : 'text-gray-600'}`}>
                            {language === 'tr' ? 'Henüz içerik oluşturulmadı' : 'No content generated yet'}
                        </p>
                        <p className={`text-sm mt-2 px-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-500'}`}>
                            {language === 'tr' ? 'Yukarıdaki alana açıklamanızı girerek başlayın' : 'Start by entering your description in the field above'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Sonuç kartı bileşeni - Her kartta kopyala butonu ile
 */
interface ResultCardProps {
    label: string;
    value: string;
    itemId: string;
    copied: boolean;
    onCopy: () => void;
    theme: 'dark' | 'light';
    language: 'tr' | 'en';
    multiline?: boolean;
    prefix?: string;
    badges?: string[];
}

function ResultCard({ label, value, itemId, copied, onCopy, theme, language, multiline = false, prefix, badges }: ResultCardProps) {
    return (
        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-white/5 to-white/[0.02] border-white/10' : 'from-gray-50 to-white border-gray-300'} border rounded-xl p-4 hover:border-brand-orange/30 transition-all`}>
            <div className="flex items-center justify-between mb-2 gap-2">
                <label className={`text-xs font-bold uppercase tracking-wider flex-1 truncate ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {label}
                </label>
                <button
                    onClick={onCopy}
                    className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${theme === 'dark' ? 'hover:bg-brand-orange/10 text-slate-400 hover:text-brand-orange' : 'hover:bg-orange-50 text-gray-500 hover:text-orange-600'}`}
                    title={language === 'tr' ? 'Kopyala' : 'Copy'}
                >
                    {copied ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                        <Copy size={16} />
                    )}
                </button>
            </div>
            {badges ? (
                <div className="flex flex-wrap gap-2 mt-2">
                    {badges.slice(0, 8).map((badge, idx) => (
                        <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' : 'bg-orange-100 text-orange-700 border border-orange-300'}`}
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            ) : (
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium text-sm sm:text-base break-words ${multiline ? 'leading-relaxed whitespace-pre-line' : ''}`}>
                    {prefix && value ? prefix + value.replace(/\n/g, '\n' + prefix) : value}
                </p>
            )}
            {value && !badges && (
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                    {value.length} {language === 'tr' ? 'karakter' : 'characters'}
                </p>
            )}
        </div>
    );
}

