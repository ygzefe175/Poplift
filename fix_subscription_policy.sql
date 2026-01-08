-- =====================================================
-- SUBSCRIPTION INSERT POLICY FIX
-- =====================================================
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- Problem: user_subscriptions tablosunda INSERT policy eksik
-- Bu da ödeme sırasında hata oluşmasına neden oluyor
-- =====================================================

-- 1. Mevcut INSERT policy'yi temizle (varsa)
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can insert" ON user_subscriptions;

-- 2. INSERT policy ekle - Kullanıcılar kendi aboneliklerini oluşturabilir
CREATE POLICY "Users can insert own subscription" 
    ON user_subscriptions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 3. Service role için tam erişim (API endpoint'leri için)
-- Önce mevcut policy'yi düşür
DROP POLICY IF EXISTS "Service role full access" ON user_subscriptions;

-- UPDATE için service role policy
CREATE POLICY "Service role can update subscriptions" 
    ON user_subscriptions FOR UPDATE 
    USING (true);

-- INSERT için service role policy
CREATE POLICY "Service role can insert subscriptions" 
    ON user_subscriptions FOR INSERT 
    WITH CHECK (true);

-- =====================================================
-- KURULUM TAMAMLANDI
-- =====================================================
-- Bu migration çalıştırıldıktan sonra:
-- 1. Kullanıcılar Pro/Growth planı satın alabilecek
-- 2. API endpoint'leri service role ile çalışabilecek
-- 3. "Ödeme sırasında hata oluştu" sorunu çözülecek
-- =====================================================
