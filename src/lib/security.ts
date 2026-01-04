/**
 * Security utilities for Poplift
 */

// Rate limiting store (in-memory for serverless, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiter for API routes
 * @param identifier - IP address or user ID
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    // Clean up old entries periodically
    if (rateLimitStore.size > 10000) {
        const cutoff = now - windowMs * 2;
        for (const [key, value] of rateLimitStore.entries()) {
            if (value.resetTime < cutoff) {
                rateLimitStore.delete(key);
            }
        }
    }

    if (!record || record.resetTime < now) {
        // New window
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs
        });
        return { allowed: true, remaining: limit - 1, resetIn: windowMs };
    }

    if (record.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: record.resetTime - now
        };
    }

    record.count++;
    return {
        allowed: true,
        remaining: limit - record.count,
        resetIn: record.resetTime - now
    };
}

/**
 * Validate UUID format
 */
export function isValidUUID(str: string): boolean {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

/**
 * Sanitize string input (remove potential XSS)
 */
export function sanitizeString(input: unknown, maxLength: number = 1000): string {
    if (typeof input !== 'string') return '';

    // Limit length
    let sanitized = input.slice(0, maxLength);

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Basic HTML entity encoding for dangerous characters
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

    return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: unknown): boolean {
    if (typeof email !== 'string') return false;
    // Basic email validation - not perfect but good enough
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Get client IP from request (handles proxies)
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        // Take first IP in chain (original client)
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

/**
 * CORS origins whitelist
 */
const ALLOWED_ORIGINS = [
    'https://poplift.vercel.app',
    'https://www.poplift.com',
    'http://localhost:3000',
    'http://localhost:3001',
];

/**
 * Check if origin is allowed for CORS
 */
export function isAllowedOrigin(origin: string | null): boolean {
    if (!origin) return false;

    // Allow any origin for public pixel/tracking endpoints
    // These are meant to be embedded on customer sites
    return true;
}

/**
 * Get CORS headers for API response
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
    return {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}

/**
 * Content Security Policy header value
 */
export const CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
].join('; ');
