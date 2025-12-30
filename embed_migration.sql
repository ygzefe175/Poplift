-- =====================================================
-- POPWISE EMBED SYSTEM - MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor to add new columns
-- =====================================================

-- 1. Add new columns for popup customization
ALTER TABLE popups ADD COLUMN IF NOT EXISTS cta_url TEXT DEFAULT NULL;
ALTER TABLE popups ADD COLUMN IF NOT EXISTS delay_seconds INTEGER DEFAULT 5;
ALTER TABLE popups ADD COLUMN IF NOT EXISTS scroll_percent INTEGER DEFAULT 50;

-- 2. Add impressions and clicks columns if they don't exist
ALTER TABLE popups ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0;
ALTER TABLE popups ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- 3. Create function to increment impressions (if not exists)
CREATE OR REPLACE FUNCTION increment_impressions(popup_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE popups 
    SET impressions = COALESCE(impressions, 0) + 1 
    WHERE id = popup_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to increment clicks (if not exists)
CREATE OR REPLACE FUNCTION increment_clicks(popup_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE popups 
    SET clicks = COALESCE(clicks, 0) + 1 
    WHERE id = popup_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create popup_events table for detailed analytics (if not exists)
CREATE TABLE IF NOT EXISTS popup_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    popup_id UUID REFERENCES popups(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'close', 'conversion')),
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_popup_events_popup_id ON popup_events(popup_id);
CREATE INDEX IF NOT EXISTS idx_popup_events_created_at ON popup_events(created_at);
CREATE INDEX IF NOT EXISTS idx_popups_user_id_active ON popups(user_id, is_active);

-- 7. Enable RLS on popup_events
ALTER TABLE popup_events ENABLE ROW LEVEL SECURITY;

-- 8. Policy to allow inserts from API (for tracking)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'popup_events' AND policyname = 'Allow anonymous inserts for tracking'
    ) THEN
        CREATE POLICY "Allow anonymous inserts for tracking" ON popup_events
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- 9. Policy to allow users to read their own events
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'popup_events' AND policyname = 'Users can read their own popup events'
    ) THEN
        CREATE POLICY "Users can read their own popup events" ON popup_events
            FOR SELECT
            USING (
                popup_id IN (
                    SELECT id FROM popups WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION increment_impressions TO anon;
GRANT EXECUTE ON FUNCTION increment_clicks TO anon;
GRANT INSERT ON popup_events TO anon;

-- 11. Allow anonymous users to read active popups (for embed script)
-- This is crucial for the embed system to work!
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'popups' AND policyname = 'Allow public read of active popups'
    ) THEN
        CREATE POLICY "Allow public read of active popups" ON popups
            FOR SELECT
            USING (is_active = true);
    END IF;
END $$;

SELECT 'Migration complete! Embed system is ready.' as status;
