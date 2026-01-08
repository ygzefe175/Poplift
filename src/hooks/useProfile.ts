import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    company: string | null;
    website: string | null;
    created_at?: string;
    updated_at?: string;
};

export function useProfile(userId: string | null) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setProfile(null);
            setLoading(false);
            return;
        }

        async function fetchProfile() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    // It's possible the trigger hasn't finished yet or RLS blocked it, 
                    // but usually it's fine. 
                    // If not found, we just return null profile.
                    console.error('Error fetching profile:', error);
                } else {
                    setProfile(data as Profile);
                }
            } catch (e) {
                console.error('Exception fetching profile:', e);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [userId]);

    const updateProfile = async (updates: Partial<Profile>) => {
        try {
            if (!userId) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            setProfile(data as Profile);
            return { data, error: null };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { data: null, error };
        }
    };

    return { profile, loading, updateProfile };
}
