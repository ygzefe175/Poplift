-- =====================================================
-- POPWISE WEB ANALİTİK PAKETİ - DATABASE MIGRATION
-- =====================================================
-- Bu migration'ı Supabase SQL Editor'da çalıştırın
-- Tarih: 2026-01-02
-- =====================================================

-- 1. Kullanıcı abonelik planları tablosu (hangi eklentilere sahip)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'pro', 'growth')),
    -- Eklentiler
    has_analytics BOOLEAN DEFAULT FALSE,
    has_custom_design BOOLEAN DEFAULT FALSE,
    has_ai_assistant BOOLEAN DEFAULT FALSE,
    has_onboarding BOOLEAN DEFAULT FALSE,
    -- Tarihler
    analytics_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
    ON user_subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" 
    ON user_subscriptions FOR UPDATE 
    USING (auth.uid() = user_id);

-- Service role can manage all subscriptions
CREATE POLICY "Service role full access" 
    ON user_subscriptions 
    USING (auth.role() = 'service_role');

-- 2. Sayfa görüntüleme tablosu
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, -- Site sahibi
    session_id TEXT NOT NULL, -- Ziyaretçi oturumu
    visitor_id TEXT NOT NULL, -- Kalıcı ziyaretçi ID (cookie)
    -- Sayfa bilgileri
    page_url TEXT NOT NULL,
    page_title TEXT,
    page_path TEXT,
    referrer TEXT,
    referrer_domain TEXT,
    -- Cihaz bilgileri
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    browser TEXT,
    browser_version TEXT,
    os TEXT,
    os_version TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    -- Davranış metrikleri
    scroll_depth INTEGER DEFAULT 0, -- Max scroll yüzdesi
    time_on_page INTEGER DEFAULT 0, -- Saniye cinsinden
    is_bounce BOOLEAN DEFAULT TRUE, -- Tek sayfa ziyareti mi
    -- Coğrafi bilgi (opsiyonel, IP'den çıkarılabilir)
    country TEXT,
    city TEXT,
    -- Timestamps
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi site verilerini görebilir
CREATE POLICY "Users can view own page views" 
    ON page_views FOR SELECT 
    USING (auth.uid() = user_id);

-- Herkes insert yapabilir (tracking için)
CREATE POLICY "Anyone can insert page views" 
    ON page_views FOR INSERT 
    WITH CHECK (true);

-- Update için service role
CREATE POLICY "Service role can update" 
    ON page_views FOR UPDATE 
    USING (auth.role() = 'service_role');

-- 3. Oturum tablosu (sessions)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, -- Site sahibi
    session_id TEXT NOT NULL UNIQUE,
    visitor_id TEXT NOT NULL,
    -- Oturum bilgileri  
    first_page TEXT,
    last_page TEXT,
    pages_viewed INTEGER DEFAULT 1,
    total_time INTEGER DEFAULT 0, -- Toplam saniye
    -- Kaynak
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer_domain TEXT,
    -- Cihaz
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    -- Dönüşüm
    had_popup_impression BOOLEAN DEFAULT FALSE,
    had_popup_click BOOLEAN DEFAULT FALSE,
    converted BOOLEAN DEFAULT FALSE,
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" 
    ON sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert sessions" 
    ON sessions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can update sessions" 
    ON sessions FOR UPDATE 
    WITH CHECK (true);

-- 4. Günlük özet tablosu (hızlı dashboard sorguları için)
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    -- Temel metrikler
    total_visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    avg_time_on_site INTEGER DEFAULT 0, -- Saniye
    bounce_rate DECIMAL(5,2) DEFAULT 0, -- Yüzde
    -- Popup metrikleri
    popup_impressions INTEGER DEFAULT 0,
    popup_clicks INTEGER DEFAULT 0,
    popup_conversions INTEGER DEFAULT 0,
    -- Cihaz dağılımı
    desktop_visits INTEGER DEFAULT 0,
    mobile_visits INTEGER DEFAULT 0,
    tablet_visits INTEGER DEFAULT 0,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily stats" 
    ON daily_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service can manage daily stats" 
    ON daily_stats FOR ALL 
    USING (auth.role() = 'service_role');

-- 5. İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);

-- 6. Otomatik abonelik oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_subscriptions (user_id, plan_type)
    VALUES (NEW.id, 'free')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Yeni kullanıcı için otomatik subscription
DROP TRIGGER IF EXISTS on_user_created_subscription ON auth.users;
CREATE TRIGGER on_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- 7. Günlük istatistik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_daily_stats(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
    v_total_visitors INTEGER;
    v_unique_visitors INTEGER;
    v_page_views INTEGER;
    v_avg_time INTEGER;
    v_bounce_rate DECIMAL;
    v_desktop INTEGER;
    v_mobile INTEGER;
    v_tablet INTEGER;
BEGIN
    -- Sayaçları hesapla
    SELECT 
        COUNT(*),
        COUNT(DISTINCT visitor_id),
        COALESCE(AVG(time_on_page), 0),
        COALESCE(SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN device_type = 'tablet' THEN 1 ELSE 0 END), 0)
    INTO v_page_views, v_unique_visitors, v_avg_time, v_desktop, v_mobile, v_tablet
    FROM page_views
    WHERE user_id = p_user_id
    AND DATE(created_at) = p_date;

    -- Session sayısı
    SELECT COUNT(*) INTO v_total_visitors
    FROM sessions
    WHERE user_id = p_user_id
    AND DATE(started_at) = p_date;

    -- Bounce rate hesapla
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (SUM(CASE WHEN pages_viewed = 1 THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100
            ELSE 0 
        END
    INTO v_bounce_rate
    FROM sessions
    WHERE user_id = p_user_id
    AND DATE(started_at) = p_date;

    -- Upsert
    INSERT INTO daily_stats (
        user_id, date, total_visitors, unique_visitors, page_views,
        avg_time_on_site, bounce_rate, desktop_visits, mobile_visits, tablet_visits
    ) VALUES (
        p_user_id, p_date, v_total_visitors, v_unique_visitors, v_page_views,
        v_avg_time, v_bounce_rate, v_desktop, v_mobile, v_tablet
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        total_visitors = EXCLUDED.total_visitors,
        unique_visitors = EXCLUDED.unique_visitors,
        page_views = EXCLUDED.page_views,
        avg_time_on_site = EXCLUDED.avg_time_on_site,
        bounce_rate = EXCLUDED.bounce_rate,
        desktop_visits = EXCLUDED.desktop_visits,
        mobile_visits = EXCLUDED.mobile_visits,
        tablet_visits = EXCLUDED.tablet_visits,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- KURULUM TAMAMLANDI
-- =====================================================
-- Bu migration çalıştırıldıktan sonra:
-- 1. Kullanıcılara analytics eklentisi atanabilir
-- 2. Sayfa görüntülemeleri takip edilebilir
-- 3. Oturum verileri kaydedilebilir
-- 4. Günlük özet raporlar oluşturulabilir
-- =====================================================
