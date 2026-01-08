import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdvancedSettings {
    triggerType: 'time' | 'scroll' | 'exit_intent' | 'click';
    delaySeconds: number;
    scrollPercentage: number;
    frequency: 'always' | 'once_per_session' | 'once_per_day' | 'once_per_week';
    showOnMobile: boolean;
    showOnDesktop: boolean;
}

export interface Popup {
    id: string;
    name: string;
    type: 'exit_intent' | 'scroll' | 'time_based' | 'custom' | 'standard' | 'urgency' | 'gift' | 'spinwheel' | 'time';
    headline: string;
    subtext: string;
    cta_text: string;
    position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center';
    is_active: boolean;
    created_at: string;
    impressions?: number;
    clicks?: number;
    settings?: AdvancedSettings | null;
}

export function usePopups(userId: string | null) {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        fetchPopups();
    }, [userId]);

    const fetchPopups = async () => {
        try {
            setLoading(true);
            // Select all relevant columns including position
            const { data, error } = await supabase
                .from('popups')
                .select('id, user_id, name, type, headline, subtext, cta_text, position, is_active, created_at, impressions, clicks, settings')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                // If there's a column error, try without some columns
                if (error.code === 'PGRST204' || error.code === '42703') {
                    console.warn('Some columns missing, trying minimal fetch...');
                    const { data: minData, error: minError } = await supabase
                        .from('popups')
                        .select('id, user_id, name, type, headline, subtext, cta_text, position, is_active, created_at')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });

                    if (minError) throw minError;
                    // Add default values for missing columns
                    const enrichedData = (minData || []).map(p => ({
                        ...p,
                        impressions: 0,
                        clicks: 0,
                        position: (p as any).position || 'center',
                        settings: null
                    }));
                    setPopups(enrichedData as Popup[]);
                    return;
                }
                throw error;
            }

            // Add default position for popups that don't have it
            // Parse settings if it's a JSON string
            const enrichedData = (data || []).map(p => {
                let parsedSettings = null;
                try {
                    if ((p as any).settings) {
                        parsedSettings = typeof (p as any).settings === 'string'
                            ? JSON.parse((p as any).settings)
                            : (p as any).settings;
                    }
                } catch (e) {
                    console.warn('Failed to parse settings for popup:', p.id, e);
                    parsedSettings = null;
                }
                return {
                    ...p,
                    position: (p as any).position || 'center',
                    settings: parsedSettings
                };
            });
            setPopups(enrichedData as Popup[]);
        } catch (error) {
            console.error('Error fetching popups:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPopup = async (name: string, headline: string, subtext: string, cta_text: string, position: 'center' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top_center' | 'bottom_center' = 'center', type: any = 'exit_intent', settings?: AdvancedSettings) => {
        try {
            if (!userId) throw new Error('User not found');

            // Map template type to trigger type for the pixel script
            let triggerType = 'time_based';
            if (settings?.triggerType) {
                triggerType = settings.triggerType;
            } else if (type === 'exit_intent') {
                triggerType = 'exit_intent';
            } else if (type === 'scroll') {
                triggerType = 'scroll';
            }

            // Prepare popup data with position and settings
            const popupData: any = {
                user_id: userId,
                name,
                type: triggerType, // Use trigger type for DB
                headline,
                subtext,
                cta_text,
                position, // Include position!
                is_active: true,
                delay_seconds: settings?.delaySeconds || 5,
                scroll_percent: settings?.scrollPercentage || 50,
                settings: settings ? JSON.stringify(settings) : null // Store full settings as JSON
            };

            // Try to insert with all fields
            let { data, error } = await supabase
                .from('popups')
                .insert([popupData])
                .select()
                .single();

            // If position column doesn't exist, try without it
            if (error && (error.code === '42703' || error.message?.includes('position'))) {
                console.warn('Position column not found, trying without...');
                const { position: _, ...dataWithoutPosition } = popupData;
                const retry = await supabase
                    .from('popups')
                    .insert([dataWithoutPosition])
                    .select()
                    .single();
                data = retry.data;
                error = retry.error;

                // Add position locally for UI
                if (!error && data) {
                    data.position = position;
                }
            }

            // If settings column doesn't exist, try without it
            if (error && (error.code === '42703' || error.message?.includes('settings'))) {
                console.warn('Settings column not found, trying without...');
                const { settings: _, ...dataWithoutSettings } = popupData;
                const retry = await supabase
                    .from('popups')
                    .insert([dataWithoutSettings])
                    .select()
                    .single();
                data = retry.data;
                error = retry.error;
            }

            if (error) {
                console.error('Supabase Error Details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            // Ensure position is set in the returned data
            if (data) {
                data.position = data.position || position;
                data.settings = settings;
            }

            setPopups([data, ...popups]);
            return { data, error: null };
        } catch (error: any) {
            console.error('Error creating popup:', error.message || error);
            return { data: null, error };
        }
    };

    const deletePopup = async (id: string) => {
        try {
            const { error } = await supabase
                .from('popups')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPopups(popups.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting popup:', error);
        }
    };

    const togglePopupStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('popups')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            setPopups(popups.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } catch (error) {
            console.error('Error updating popup:', error);
        }
    };

    return {
        popups,
        loading,
        createPopup,
        deletePopup,
        togglePopupStatus,
        refresh: fetchPopups
    };
}
