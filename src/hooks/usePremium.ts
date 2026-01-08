/**
 * Premium durumu kontrolü için hook
 * NOT: Bu hook şu an sahte state ile çalışmaktadır
 * Gerçek uygulamada API'den premium durumu kontrol edilmelidir
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function usePremium() {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Sahte state: localStorage'dan premium durumunu kontrol et
        // Gerçek uygulamada burada API çağrısı yapılmalı
        const checkPremium = async () => {
            if (!user) {
                setIsPremium(false);
                setIsLoading(false);
                return;
            }

            try {
                // Önce localStorage'dan kontrol et (demo için)
                const storedPremium = localStorage.getItem(`premium_${user.id}`);
                if (storedPremium === 'true') {
                    setIsPremium(true);
                    setIsLoading(false);
                    return;
                }

                // Gerçek kontrol: API'den subscription durumunu al
                const response = await fetch(`/api/subscription?user_id=${user.id}`);
                const data = await response.json();

                if (data.success && data.subscription) {
                    const planType = data.subscription.plan_type || 'free';
                    const isProOrGrowth = planType === 'pro' || planType === 'growth';
                    
                    // Premium durumunu ayarla
                    setIsPremium(isProOrGrowth);
                    
                    // Demo için localStorage'a kaydet
                    localStorage.setItem(`premium_${user.id}`, isProOrGrowth ? 'true' : 'false');
                } else {
                    setIsPremium(false);
                }
            } catch (error) {
                console.error('Premium check error:', error);
                setIsPremium(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkPremium();
    }, [user]);

    return { isPremium, isLoading };
}

