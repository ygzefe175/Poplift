import { useState, useEffect, useRef } from 'react';
import { VisitorTag } from '@/lib/types';

export function useVisitorTracker() {
    const [tag, setTag] = useState<VisitorTag>('standard');
    const [isExitIntent, setIsExitIntent] = useState(false);
    const scrollSpeedrRef = useRef<number[]>([]);
    const lastScrollPos = useRef(0);
    const timeOnPage = useRef(0);
    const pricingHoverTime = useRef(0);

    useEffect(() => {
        // Timer for time on page & section analysis
        const timer = setInterval(() => {
            timeOnPage.current += 1;

            // 1. Analyze Indecision: High time on page but low activity
            if (timeOnPage.current > 45 && scrollSpeedrRef.current.length > 0) {
                const avgSpeed = scrollSpeedrRef.current.reduce((a, b) => a + b, 0) / scrollSpeedrRef.current.length;
                if (avgSpeed < 5) setTag(prev => prev === 'standard' ? 'indecisive' : prev);
            }

            // 2. Analyze Section Focus: Check if user is viewing specific converted sections
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                const rect = pricingSection.getBoundingClientRect();
                const isViewingPricing = rect.top < window.innerHeight && rect.bottom >= 0;

                if (isViewingPricing) {
                    pricingHoverTime.current += 1;
                    // If they stay on pricing, they might be indecisive, but let's not force a specific tag here for now
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const speed = Math.abs(currentScroll - lastScrollPos.current);
            scrollSpeedrRef.current.push(speed);
            if (scrollSpeedrRef.current.length > 50) scrollSpeedrRef.current.shift();
            lastScrollPos.current = currentScroll;

            // Fast scrolling tracking disabled/removed
            // if (speed > 150) {
            //     setTag('hasty');
            // }
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Exit intent logic (mouse moving up fast towards top of browser)
            if (e.clientY < 20 && e.movementY < -10) {
                setIsExitIntent(true);
            }
        };

        // Check localstorage for simple returning visitor logic
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const visits = localStorage.getItem('visit_count');
                if (!visits) {
                    localStorage.setItem('visit_count', '1');
                    // First time visitors default to Trust Seeking until they prove otherwise
                    setTag(prev => prev === 'standard' ? 'trust_seeking' : prev);
                } else {
                    const count = parseInt(visits);
                    localStorage.setItem('visit_count', (count + 1).toString());
                }
            }
        } catch {
            // localStorage not available, continue silently
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return { tag, isExitIntent, setTag };
}
