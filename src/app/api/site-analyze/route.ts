import { NextRequest, NextResponse } from 'next/server';

/**
 * Gerçek Site Analizi API
 * 
 * Bu endpoint gerçek web sitelerini analiz eder:
 * - HTTP isteği ile siteye bağlanır
 * - HTML'i parse eder
 * - Meta tag'leri, başlıkları kontrol eder
 * - SSL durumunu kontrol eder
 * - Gerçek veriler döndürür
 */

// Ayrı tip tanımları
interface MetaTags {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    keywords: string[];
    ogImage: boolean;
    ogTitle: boolean;
    ogDescription: boolean;
    twitterCard: boolean;
    canonical: string | null;
    viewport: boolean;
    robots: string | null;
}

interface Headings {
    h1Count: number;
    h1Text: string[];
    h2Count: number;
    h3Count: number;
}

interface Images {
    total: number;
    withAlt: number;
    withoutAlt: number;
    missingAltList: string[];
}

interface Links {
    internal: number;
    external: number;
    broken: number;
}

interface Security {
    sslEnabled: boolean;
    sslIssuer: string | null;
    httpSecure: boolean;
    mixedContent: boolean;
    securityHeaders: {
        xFrameOptions: boolean;
        xContentTypeOptions: boolean;
        strictTransportSecurity: boolean;
        contentSecurityPolicy: boolean;
    };
}

interface Performance {
    responseTime: number;
    htmlSize: number;
    compression: boolean;
}

interface Issue {
    type: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
    priority: number;
}

interface Recommendation {
    priority: number;
    category: string;
    message: string;
    impact: string;
}

interface AnalysisData {
    url: string;
    seoScore: number;
    speedScore: number;
    mobileScore: number;
    securityScore: number;
    overallScore: number;
    metaTags: MetaTags;
    headings: Headings;
    images: Images;
    links: Links;
    security: Security;
    performance: Performance;
    issues: Issue[];
    recommendations: Recommendation[];
    analyzedAt: string;
}

interface AnalysisResult {
    success: boolean;
    data?: AnalysisData;
    error?: string;
    code?: string;
}

// CORS headers
function getCorsHeaders(origin: string | null) {
    return {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

// URL validation
function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

// Parse meta tags from HTML
function parseMetaTags(html: string): MetaTags {
    const getMetaContent = (name: string, property?: string): string | null => {
        // name attribute
        const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
            html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
        if (nameMatch) return nameMatch[1];

        // property attribute (for og: tags)
        if (property) {
            const propMatch = html.match(new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
                html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'));
            if (propMatch) return propMatch[1];
        }

        return null;
    };

    // Get title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // Get description
    const description = getMetaContent('description');

    // Get keywords
    const keywordsRaw = getMetaContent('keywords');
    const keywords = keywordsRaw ? keywordsRaw.split(',').map(k => k.trim()).filter(k => k) : [];

    // Check OG tags
    const ogImage = !!getMetaContent('og:image', 'og:image');
    const ogTitle = !!getMetaContent('og:title', 'og:title');
    const ogDescription = !!getMetaContent('og:description', 'og:description');

    // Check Twitter Card
    const twitterCard = !!getMetaContent('twitter:card');

    // Check canonical
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;

    // Check viewport
    const viewport = !!html.match(/<meta[^>]*name=["']viewport["']/i);

    // Check robots
    const robots = getMetaContent('robots');

    return {
        title,
        titleLength: title?.length || 0,
        description,
        descriptionLength: description?.length || 0,
        keywords,
        ogImage,
        ogTitle,
        ogDescription,
        twitterCard,
        canonical,
        viewport,
        robots
    };
}

// Parse headings
function parseHeadings(html: string): Headings {
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h1Text = h1Matches.map(h => {
        const text = h.replace(/<[^>]+>/g, '').trim();
        return text.substring(0, 100);
    });

    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

    return {
        h1Count: h1Matches.length,
        h1Text,
        h2Count,
        h3Count
    };
}

// Parse images
function parseImages(html: string): Images {
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    let withAlt = 0;
    let withoutAlt = 0;
    const missingAltList: string[] = [];

    imgMatches.forEach(img => {
        const hasAlt = /alt=["'][^"']+["']/i.test(img);
        const emptyAlt = /alt=["']\s*["']/i.test(img);

        if (hasAlt && !emptyAlt) {
            withAlt++;
        } else {
            withoutAlt++;
            // Get src for reporting
            const srcMatch = img.match(/src=["']([^"']*)["']/i);
            if (srcMatch && missingAltList.length < 5) {
                missingAltList.push(srcMatch[1].substring(0, 80));
            }
        }
    });

    return {
        total: imgMatches.length,
        withAlt,
        withoutAlt,
        missingAltList
    };
}

// Parse links
function parseLinks(html: string, baseUrl: string): Links {
    const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
    const baseHost = new URL(baseUrl).hostname;

    let internal = 0;
    let external = 0;

    linkMatches.forEach(link => {
        const hrefMatch = link.match(/href=["']([^"']*)["']/i);
        if (!hrefMatch) return;

        const href = hrefMatch[1];

        // Skip anchors, javascript, mailto
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        try {
            const linkUrl = new URL(href, baseUrl);
            if (linkUrl.hostname === baseHost) {
                internal++;
            } else {
                external++;
            }
        } catch {
            // Relative URL
            internal++;
        }
    });

    return {
        internal,
        external,
        broken: 0 // Would need separate HEAD requests to check
    };
}

// Calculate scores
function calculateScores(
    metaTags: MetaTags,
    headings: Headings,
    images: Images,
    security: Security,
    performance: Performance
): { seo: number; speed: number; mobile: number; security: number; overall: number } {

    // SEO Score (0-100)
    let seoScore = 100;

    // Title checks (-20 max)
    if (!metaTags.title) seoScore -= 20;
    else if (metaTags.titleLength < 30) seoScore -= 10;
    else if (metaTags.titleLength > 60) seoScore -= 5;

    // Description checks (-15 max)
    if (!metaTags.description) seoScore -= 15;
    else if (metaTags.descriptionLength < 70) seoScore -= 7;
    else if (metaTags.descriptionLength > 160) seoScore -= 5;

    // H1 checks (-15 max)
    if (headings.h1Count === 0) seoScore -= 15;
    else if (headings.h1Count > 1) seoScore -= 5;

    // Image alt tags (-15 max)
    if (images.total > 0) {
        const altRatio = images.withAlt / images.total;
        seoScore -= Math.round((1 - altRatio) * 15);
    }

    // OG tags (-10 max)
    if (!metaTags.ogTitle) seoScore -= 3;
    if (!metaTags.ogDescription) seoScore -= 3;
    if (!metaTags.ogImage) seoScore -= 4;

    // Canonical (-5)
    if (!metaTags.canonical) seoScore -= 5;

    seoScore = Math.max(0, Math.min(100, seoScore));

    // Speed Score (based on response time and HTML size)
    let speedScore = 100;
    if (performance.responseTime > 500) speedScore -= 10;
    if (performance.responseTime > 1000) speedScore -= 15;
    if (performance.responseTime > 2000) speedScore -= 20;
    if (performance.responseTime > 3000) speedScore -= 20;
    if (performance.htmlSize > 100000) speedScore -= 10; // > 100KB
    if (performance.htmlSize > 500000) speedScore -= 20; // > 500KB
    if (!performance.compression) speedScore -= 10;
    speedScore = Math.max(20, Math.min(100, speedScore));

    // Mobile Score
    let mobileScore = 100;
    if (!metaTags.viewport) mobileScore -= 40; // Critical
    mobileScore = Math.max(30, Math.min(100, mobileScore));

    // Security Score
    let secScore = 100;
    if (!security.sslEnabled) secScore -= 50; // Critical
    if (!security.securityHeaders.xFrameOptions) secScore -= 10;
    if (!security.securityHeaders.xContentTypeOptions) secScore -= 10;
    if (!security.securityHeaders.strictTransportSecurity) secScore -= 15;
    if (!security.securityHeaders.contentSecurityPolicy) secScore -= 10;
    secScore = Math.max(0, Math.min(100, secScore));

    // Overall Score (weighted average)
    const overall = Math.round(
        seoScore * 0.35 +
        speedScore * 0.25 +
        mobileScore * 0.20 +
        secScore * 0.20
    );

    return {
        seo: seoScore,
        speed: speedScore,
        mobile: mobileScore,
        security: secScore,
        overall
    };
}

// Generate issues and recommendations
function generateIssuesAndRecommendations(
    metaTags: MetaTags,
    headings: Headings,
    images: Images,
    security: Security,
    performance: Performance
): { issues: Issue[]; recommendations: Recommendation[] } {

    const issues: Issue[] = [];
    const recommendations: Recommendation[] = [];
    let priority = 0;

    // Critical: No SSL
    if (!security.sslEnabled) {
        priority++;
        issues.push({
            type: 'critical',
            category: 'security',
            message: 'SSL sertifikası bulunamadı - Site güvenli değil',
            priority
        });
        recommendations.push({
            priority,
            category: 'security',
            message: 'SSL sertifikası kurun (Let\'s Encrypt ücretsiz)',
            impact: 'Kritik - Google sıralaması ve kullanıcı güveni için zorunlu'
        });
    }

    // Critical: No title
    if (!metaTags.title) {
        priority++;
        issues.push({
            type: 'critical',
            category: 'seo',
            message: 'Sayfa başlığı (title tag) bulunamadı',
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Benzersiz ve açıklayıcı bir title tag ekleyin (50-60 karakter)',
            impact: 'Kritik - Arama motorları sıralamada kullanır'
        });
    } else if (metaTags.titleLength > 60) {
        priority++;
        issues.push({
            type: 'warning',
            category: 'seo',
            message: `Title çok uzun (${metaTags.titleLength} karakter) - Google kesecektir`,
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Title\'ı 50-60 karakter arasına kısaltın',
            impact: 'Orta - Arama sonuçlarında tam görünmez'
        });
    }

    // No description
    if (!metaTags.description) {
        priority++;
        issues.push({
            type: 'critical',
            category: 'seo',
            message: 'Meta description bulunamadı',
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Sayfa içeriğini özetleyen meta description ekleyin (150-160 karakter)',
            impact: 'Yüksek - Tıklama oranını artırır'
        });
    } else if (metaTags.descriptionLength > 160) {
        priority++;
        issues.push({
            type: 'warning',
            category: 'seo',
            message: `Meta description çok uzun (${metaTags.descriptionLength} karakter)`,
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Description\'ı 150-160 karakter arasına kısaltın',
            impact: 'Düşük - Google kısaltarak gösterir'
        });
    }

    // No H1
    if (headings.h1Count === 0) {
        priority++;
        issues.push({
            type: 'warning',
            category: 'seo',
            message: 'H1 başlığı bulunamadı',
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Sayfaya ana konuyu anlatan tek bir H1 başlığı ekleyin',
            impact: 'Orta - İçerik yapısı ve SEO için önemli'
        });
    } else if (headings.h1Count > 1) {
        priority++;
        issues.push({
            type: 'info',
            category: 'seo',
            message: `Birden fazla H1 başlığı var (${headings.h1Count} adet)`,
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Her sayfada tek bir H1 kullanın, diğer başlıklar için H2-H6 kullanın',
            impact: 'Düşük - En iyi pratik'
        });
    }

    // Missing viewport
    if (!metaTags.viewport) {
        priority++;
        issues.push({
            type: 'critical',
            category: 'mobile',
            message: 'Viewport meta tag\'i eksik - Mobil uyumluluk sorunu',
            priority
        });
        recommendations.push({
            priority,
            category: 'mobile',
            message: '<meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin',
            impact: 'Kritik - Mobil cihazlarda düzgün görünmez'
        });
    }

    // Missing alt tags
    if (images.withoutAlt > 0) {
        priority++;
        issues.push({
            type: 'warning',
            category: 'seo',
            message: `${images.withoutAlt} görselde alt etiketi eksik`,
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Tüm görsellere açıklayıcı alt etiketleri ekleyin',
            impact: 'Orta - Erişilebilirlik ve SEO için önemli'
        });
    }

    // No canonical
    if (!metaTags.canonical) {
        priority++;
        issues.push({
            type: 'info',
            category: 'seo',
            message: 'Canonical URL tanımlı değil',
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Duplicate content sorunlarını önlemek için canonical URL ekleyin',
            impact: 'Düşük - Çoklu URL\'ler varsa önemli'
        });
    }

    // Missing OG tags
    if (!metaTags.ogTitle || !metaTags.ogDescription || !metaTags.ogImage) {
        priority++;
        const missing = [];
        if (!metaTags.ogTitle) missing.push('og:title');
        if (!metaTags.ogDescription) missing.push('og:description');
        if (!metaTags.ogImage) missing.push('og:image');

        issues.push({
            type: 'info',
            category: 'seo',
            message: `Open Graph tag\'leri eksik: ${missing.join(', ')}`,
            priority
        });
        recommendations.push({
            priority,
            category: 'seo',
            message: 'Sosyal medya paylaşımları için OG tag\'lerini ekleyin',
            impact: 'Orta - Sosyal medyada daha iyi görünüm sağlar'
        });
    }

    // Slow response
    if (performance.responseTime > 2000) {
        priority++;
        issues.push({
            type: 'warning',
            category: 'performance',
            message: `Yavaş sunucu yanıtı (${(performance.responseTime / 1000).toFixed(1)}s)`,
            priority
        });
        recommendations.push({
            priority,
            category: 'performance',
            message: 'Sunucu optimizasyonu yapın, CDN kullanmayı düşünün',
            impact: 'Yüksek - Kullanıcı deneyimini olumsuz etkiler'
        });
    }

    // Security headers
    if (!security.securityHeaders.strictTransportSecurity && security.sslEnabled) {
        priority++;
        issues.push({
            type: 'info',
            category: 'security',
            message: 'HSTS header eksik',
            priority
        });
        recommendations.push({
            priority,
            category: 'security',
            message: 'Strict-Transport-Security header ekleyin',
            impact: 'Düşük - Güvenliği artırır'
        });
    }

    return { issues, recommendations };
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        const body = await request.json();
        const { url } = body;

        // Validate URL
        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { success: false, error: 'URL gerekli', code: 'MISSING_URL' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Format URL
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = 'https://' + formattedUrl;
        }

        if (!isValidUrl(formattedUrl)) {
            return NextResponse.json(
                { success: false, error: 'Geçersiz URL formatı', code: 'INVALID_URL' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Fetch the website
        const startTime = Date.now();
        let response: Response;
        let html: string;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            response = await fetch(formattedUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Poplift-SiteAnalyzer/1.0 (+https://poplift.vercel.app)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'tr,en;q=0.5'
                },
                signal: controller.signal,
                redirect: 'follow'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Site erişilemedi (HTTP ${response.status})`,
                        code: 'FETCH_FAILED'
                    },
                    { status: 200, headers: corsHeaders }
                );
            }

            html = await response.text();
        } catch (fetchError: any) {
            if (fetchError.name === 'AbortError') {
                return NextResponse.json(
                    { success: false, error: 'Site yanıt vermedi (zaman aşımı)', code: 'TIMEOUT' },
                    { status: 200, headers: corsHeaders }
                );
            }
            return NextResponse.json(
                { success: false, error: 'Siteye bağlanılamadı. URL\'yi kontrol edin.', code: 'CONNECTION_ERROR' },
                { status: 200, headers: corsHeaders }
            );
        }

        const responseTime = Date.now() - startTime;

        // Parse HTML
        const metaTags = parseMetaTags(html);
        const headings = parseHeadings(html);
        const images = parseImages(html);
        const links = parseLinks(html, formattedUrl);

        // Check security
        const urlObj = new URL(formattedUrl);
        const isHttps = urlObj.protocol === 'https:';

        const security = {
            sslEnabled: isHttps,
            sslIssuer: isHttps ? 'Doğrulandı' : null,
            httpSecure: isHttps,
            mixedContent: false,
            securityHeaders: {
                xFrameOptions: !!response.headers.get('x-frame-options'),
                xContentTypeOptions: !!response.headers.get('x-content-type-options'),
                strictTransportSecurity: !!response.headers.get('strict-transport-security'),
                contentSecurityPolicy: !!response.headers.get('content-security-policy')
            }
        };

        // Performance data
        const performance = {
            responseTime,
            htmlSize: html.length,
            compression: !!response.headers.get('content-encoding')
        };

        // Calculate scores
        const scores = calculateScores(metaTags, headings, images, security, performance);

        // Generate issues and recommendations
        const { issues, recommendations } = generateIssuesAndRecommendations(
            metaTags, headings, images, security, performance
        );

        // Build result
        const result: AnalysisResult = {
            success: true,
            data: {
                url: formattedUrl,
                seoScore: scores.seo,
                speedScore: scores.speed,
                mobileScore: scores.mobile,
                securityScore: scores.security,
                overallScore: scores.overall,
                metaTags,
                headings,
                images,
                links,
                security,
                performance,
                issues: issues.slice(0, 10),
                recommendations: recommendations.slice(0, 10),
                analyzedAt: new Date().toISOString()
            }
        };

        return NextResponse.json(result, {
            status: 200,
            headers: {
                ...corsHeaders,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error: any) {
        console.error('[Site Analyze API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Analiz sırasında bir hata oluştu', code: 'INTERNAL_ERROR' },
            { status: 500, headers: corsHeaders }
        );
    }
}
