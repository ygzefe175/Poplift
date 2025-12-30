import { NextRequest, NextResponse } from 'next/server';

// Handle CORS preflight for pixel script
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    // Get the base URL - prioritize environment variable for production
    const requestUrl = new URL(request.url);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${requestUrl.protocol}//${requestUrl.host}`;

    // Minified and optimized pixel script with comprehensive error handling
    const pixelScript = `
(function() {
    'use strict';
    
    // Prevent double initialization
    if (window.POPWISE_INITIALIZED) return;
    window.POPWISE_INITIALIZED = true;
    
    var POPWISE = {
        version: '2.0.0',
        userId: '${userId || ''}',
        apiBase: '${baseUrl}',
        popups: [],
        shown: {},
        config: {
            maxRetries: 3,
            retryDelay: 1000,
            sessionKey: 'popwise_session_' + '${userId || ''}',
            cooldownHours: 24 // Don't show same popup for 24 hours
        },
        
        // Safe logging
        log: function(msg, type) {
            if (typeof console !== 'undefined' && console[type || 'log']) {
                console[type || 'log']('[Popwise] ' + msg);
            }
        },
        
        // Initialize the system
        init: function() {
            var self = this;
            
            // Validate user ID
            if (!this.userId || this.userId === 'null' || this.userId === 'undefined' || this.userId === '') {
                this.log('No valid user ID provided. Popups will not load.', 'warn');
                return;
            }
            
            // Load session data
            this.loadSession();
            
            // Fetch popups with retry mechanism
            this.fetchPopupsWithRetry(0);
        },
        
        // Load previous session data from localStorage
        loadSession: function() {
            try {
                if (typeof localStorage !== 'undefined') {
                    var sessionData = localStorage.getItem(this.config.sessionKey);
                    if (sessionData) {
                        var parsed = JSON.parse(sessionData);
                        this.shown = parsed.shown || {};
                        // Clean old entries (older than cooldown period)
                        var now = Date.now();
                        var cooldownMs = this.config.cooldownHours * 60 * 60 * 1000;
                        for (var key in this.shown) {
                            if (now - this.shown[key] > cooldownMs) {
                                delete this.shown[key];
                            }
                        }
                    }
                }
            } catch (e) {
                // localStorage not available or error parsing, continue silently
            }
        },
        
        // Save session data to localStorage
        saveSession: function() {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(this.config.sessionKey, JSON.stringify({
                        shown: this.shown,
                        updated: Date.now()
                    }));
                }
            } catch (e) {
                // localStorage not available, continue silently
            }
        },
        
        // Fetch popups with retry logic
        fetchPopupsWithRetry: function(attempt) {
            var self = this;
            var url = this.apiBase + '/api/popups/' + encodeURIComponent(this.userId);
            
            this.fetchWithTimeout(url, 10000)
                .then(function(res) {
                    if (!res.ok) {
                        throw new Error('HTTP ' + res.status);
                    }
                    return res.json();
                })
                .then(function(data) {
                    if (data && Array.isArray(data.popups)) {
                        self.popups = data.popups;
                        self.log('Loaded ' + self.popups.length + ' popup(s)');
                        self.setupTriggers();
                    } else if (data && data.error) {
                        self.log('API Error: ' + data.error, 'warn');
                    }
                })
                .catch(function(err) {
                    if (attempt < self.config.maxRetries) {
                        self.log('Fetch failed, retrying... (' + (attempt + 1) + '/' + self.config.maxRetries + ')', 'warn');
                        setTimeout(function() {
                            self.fetchPopupsWithRetry(attempt + 1);
                        }, self.config.retryDelay * (attempt + 1));
                    } else {
                        self.log('Failed to load popups after ' + self.config.maxRetries + ' attempts: ' + err.message, 'error');
                    }
                });
        },
        
        // Fetch with timeout
        fetchWithTimeout: function(url, timeout) {
            return new Promise(function(resolve, reject) {
                var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                var timeoutId = setTimeout(function() {
                    if (controller) controller.abort();
                    reject(new Error('Request timeout'));
                }, timeout);
                
                var fetchOptions = {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    mode: 'cors',
                    cache: 'no-cache'
                };
                
                if (controller) {
                    fetchOptions.signal = controller.signal;
                }
                
                fetch(url, fetchOptions)
                    .then(function(res) {
                        clearTimeout(timeoutId);
                        resolve(res);
                    })
                    .catch(function(err) {
                        clearTimeout(timeoutId);
                        reject(err);
                    });
            });
        },
        
        // Setup triggers for all popups
        setupTriggers: function() {
            var self = this;
            
            this.popups.forEach(function(popup) {
                // Skip if already shown in this session (with cooldown)
                if (self.shown[popup.id]) {
                    self.log('Popup ' + popup.id + ' already shown in session, skipping');
                    return;
                }
                
                switch(popup.type) {
                    case 'exit_intent':
                        self.setupExitIntent(popup);
                        break;
                    case 'scroll':
                        self.setupScrollTrigger(popup);
                        break;
                    case 'time_based':
                        self.setupTimeTrigger(popup);
                        break;
                    case 'urgency':
                    case 'gift':
                    case 'standard':
                    default:
                        // Default: show after 3 seconds
                        setTimeout(function() { 
                            if (!self.shown[popup.id]) {
                                self.showPopup(popup); 
                            }
                        }, 3000);
                }
            });
        },
        
        // Exit intent detection (desktop only)
        setupExitIntent: function(popup) {
            var self = this;
            var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // On mobile, use back button or scroll up trigger
                var lastScrollY = window.scrollY;
                var scrollUpCount = 0;
                
                window.addEventListener('scroll', function() {
                    if (self.shown[popup.id]) return;
                    
                    if (window.scrollY < lastScrollY && window.scrollY < 100) {
                        scrollUpCount++;
                        if (scrollUpCount > 3) {
                            self.showPopup(popup);
                        }
                    } else {
                        scrollUpCount = 0;
                    }
                    lastScrollY = window.scrollY;
                }, { passive: true });
            } else {
                // Desktop: mouse leave detection
                document.addEventListener('mouseout', function(e) {
                    if (self.shown[popup.id]) return;
                    if (e.clientY < 10 && e.relatedTarget === null) {
                        self.showPopup(popup);
                    }
                });
            }
        },
        
        // Scroll trigger
        setupScrollTrigger: function(popup) {
            var self = this;
            var triggered = false;
            var scrollPercent = popup.scroll_percent || 50;
            
            var handler = function() {
                if (triggered || self.shown[popup.id]) return;
                
                var docHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                );
                var winHeight = window.innerHeight;
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                var currentPercent = (scrollTop / (docHeight - winHeight)) * 100;
                
                if (currentPercent > scrollPercent) {
                    triggered = true;
                    self.showPopup(popup);
                }
            };
            
            window.addEventListener('scroll', handler, { passive: true });
        },
        
        // Time-based trigger
        setupTimeTrigger: function(popup) {
            var self = this;
            var delay = (popup.delay_seconds || 5) * 1000;
            
            setTimeout(function() {
                if (!self.shown[popup.id]) {
                    self.showPopup(popup);
                }
            }, delay);
        },
        
        // Show popup with animation
        showPopup: function(popup) {
            if (this.shown[popup.id]) return;
            this.shown[popup.id] = Date.now();
            this.saveSession();
            
            var self = this;
            
            // Track impression
            this.track(popup.id, 'impression');
            
            // Create styles (inject once)
            this.injectStyles();
            
            // Create overlay
            var overlay = document.createElement('div');
            overlay.id = 'popwise-overlay-' + popup.id;
            overlay.className = 'popwise-overlay';
            
            // Create popup container
            var container = document.createElement('div');
            container.id = 'popwise-' + popup.id;
            container.className = 'popwise-container popwise-pos-' + (popup.position || 'center');
            
            // Safe text rendering
            var headline = this.escapeHtml(popup.headline || 'Özel Teklif!');
            var subtext = this.escapeHtml(popup.subtext || '');
            var ctaText = this.escapeHtml(popup.cta_text || 'Devam Et');
            
            container.innerHTML = 
                '<div class="popwise-content">' +
                    '<button class="popwise-close" data-popup-id="' + popup.id + '" aria-label="Kapat">&times;</button>' +
                    '<h2 class="popwise-headline">' + headline + '</h2>' +
                    '<p class="popwise-subtext">' + subtext + '</p>' +
                    '<button class="popwise-cta" data-popup-id="' + popup.id + '">' + ctaText + '</button>' +
                '</div>';
            
            document.body.appendChild(overlay);
            document.body.appendChild(container);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Animate in (use requestAnimationFrame for smoother animation)
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    overlay.classList.add('popwise-visible');
                    container.classList.add('popwise-visible');
                });
            });
            
            // Close handler function
            var closePopup = function() {
                overlay.classList.remove('popwise-visible');
                container.classList.remove('popwise-visible');
                document.body.style.overflow = '';
                
                setTimeout(function() {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    if (container.parentNode) container.parentNode.removeChild(container);
                }, 300);
                
                self.track(popup.id, 'close');
            };
            
            // Event delegation for close button
            container.querySelector('.popwise-close').onclick = closePopup;
            overlay.onclick = closePopup;
            
            // CTA click handler
            container.querySelector('.popwise-cta').onclick = function(e) {
                e.stopPropagation();
                self.track(popup.id, 'click');
                
                // If there's a URL, navigate to it
                if (popup.cta_url) {
                    window.location.href = popup.cta_url;
                } else {
                    closePopup();
                }
            };
            
            // ESC key to close
            var escHandler = function(e) {
                if (e.key === 'Escape' || e.keyCode === 27) {
                    closePopup();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        },
        
        // Inject CSS styles (only once)
        injectStyles: function() {
            if (document.getElementById('popwise-styles')) return;
            
            var style = document.createElement('style');
            style.id = 'popwise-styles';
            style.textContent = [
                '.popwise-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:2147483646;opacity:0;transition:opacity 0.3s ease;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}',
                '.popwise-overlay.popwise-visible{opacity:1;}',
                '.popwise-container{position:fixed;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,sans-serif;transform:scale(0.9);opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);}',
                '.popwise-container.popwise-visible{transform:scale(1);opacity:1;}',
                '.popwise-pos-center{top:50%;left:50%;transform:translate(-50%,-50%);}',
                '.popwise-pos-center.popwise-visible{transform:translate(-50%,-50%) scale(1);}',
                '.popwise-pos-top_left{top:20px;left:20px;}',
                '.popwise-pos-top_right{top:20px;right:20px;}',
                '.popwise-pos-top_center{top:20px;left:50%;transform:translateX(-50%);}',
                '.popwise-pos-top_center.popwise-visible{transform:translateX(-50%) scale(1);}',
                '.popwise-pos-bottom_left{bottom:20px;left:20px;}',
                '.popwise-pos-bottom_right{bottom:20px;right:20px;}',
                '.popwise-pos-bottom_center{bottom:20px;left:50%;transform:translateX(-50%);}',
                '.popwise-pos-bottom_center.popwise-visible{transform:translateX(-50%) scale(1);}',
                '.popwise-content{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);border-radius:20px;padding:32px;max-width:400px;width:90vw;box-shadow:0 25px 50px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);position:relative;box-sizing:border-box;}',
                '.popwise-close{position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.1);border:none;color:#999;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;line-height:1;}',
                '.popwise-close:hover{background:rgba(255,255,255,0.2);color:#fff;}',
                '.popwise-headline{color:#fff;font-size:24px;font-weight:700;margin:0 0 12px 0;line-height:1.3;padding-right:30px;}',
                '.popwise-subtext{color:#a0a0a0;font-size:15px;margin:0 0 24px 0;line-height:1.6;}',
                '.popwise-cta{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#000;font-weight:700;font-size:16px;padding:14px 28px;border:none;border-radius:12px;cursor:pointer;width:100%;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 15px rgba(245,158,11,0.3);}',
                '.popwise-cta:hover{transform:scale(1.02);box-shadow:0 6px 20px rgba(245,158,11,0.4);}',
                '@media(max-width:480px){.popwise-content{padding:24px;border-radius:16px;}.popwise-headline{font-size:20px;}.popwise-cta{padding:12px 20px;font-size:14px;}}'
            ].join('');
            
            document.head.appendChild(style);
        },
        
        // Track events
        track: function(popupId, eventType) {
            var self = this;
            var data = {
                popup_id: popupId,
                event_type: eventType,
                url: window.location.href,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            
            var url = this.apiBase + '/api/track';
            var jsonData = JSON.stringify(data);
            
            // Use sendBeacon for reliability (especially on page unload)
            if (typeof navigator.sendBeacon === 'function') {
                try {
                    var blob = new Blob([jsonData], { type: 'application/json' });
                    if (navigator.sendBeacon(url, blob)) {
                        return; // Success
                    }
                } catch (e) {
                    // Fall through to fetch
                }
            }
            
            // Fallback to fetch
            try {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonData,
                    mode: 'cors',
                    keepalive: true
                }).catch(function() {
                    // Silently fail - tracking should not break the page
                });
            } catch (e) {
                // Silently fail
            }
        },
        
        // Escape HTML to prevent XSS
        escapeHtml: function(text) {
            if (!text) return '';
            var div = document.createElement('div');
            div.textContent = String(text);
            return div.innerHTML;
        }
    };
    
    // Auto-init when DOM is ready
    var initPopwise = function() {
        try {
            POPWISE.init();
        } catch (e) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('[Popwise] Initialization error:', e);
            }
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopwise);
    } else {
        // DOM already ready, init immediately
        initPopwise();
    }
    
    // Expose globally for debugging (optional)
    window.POPWISE = POPWISE;
})();
`;

    return new NextResponse(pixelScript, {
        headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
