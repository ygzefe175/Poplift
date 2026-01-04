-- Migration script to add position and settings columns to popups table
-- Run this in Supabase SQL Editor

-- Add position column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'popups' AND column_name = 'position'
    ) THEN
        ALTER TABLE popups 
        ADD COLUMN position VARCHAR(20) DEFAULT 'center';
    END IF;
END $$;

-- Add settings column if it doesn't exist (JSONB for flexibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'popups' AND column_name = 'settings'
    ) THEN
        ALTER TABLE popups 
        ADD COLUMN settings JSONB DEFAULT NULL;
    END IF;
END $$;

-- Add delay_seconds column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'popups' AND column_name = 'delay_seconds'
    ) THEN
        ALTER TABLE popups 
        ADD COLUMN delay_seconds INTEGER DEFAULT 5;
    END IF;
END $$;

-- Add scroll_percent column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'popups' AND column_name = 'scroll_percent'
    ) THEN
        ALTER TABLE popups 
        ADD COLUMN scroll_percent INTEGER DEFAULT 50;
    END IF;
END $$;

-- Update existing popups to have center position
UPDATE popups SET position = 'center' WHERE position IS NULL;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'popups' 
ORDER BY ordinal_position;
