# Poplift Güvenlik Dokümantasyonu

## Güvenlik Önlemleri

Bu doküman, Poplift uygulamasında uygulanan güvenlik önlemlerini listeler.

### 1. HTTP Güvenlik Header'ları

**next.config.ts** dosyasında aşağıdaki güvenlik header'ları aktif:

| Header | Değer | Amaç |
|--------|-------|------|
| `Strict-Transport-Security` | max-age=63072000; includeSubDomains; preload | HTTPS zorunluluğu |
| `X-XSS-Protection` | 1; mode=block | XSS koruması |
| `X-Frame-Options` | DENY | Clickjacking koruması |
| `X-Content-Type-Options` | nosniff | MIME sniffing koruması |
| `Referrer-Policy` | strict-origin-when-cross-origin | Referrer bilgisi kontrolü |
| `Content-Security-Policy` | (detaylı) | Script/resource kontrolü |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=() | Tarayıcı API kısıtlamaları |

### 2. API Rate Limiting

Tüm API endpoint'lerinde rate limiting aktif:

| Endpoint | Limit | Pencere |
|----------|-------|---------|
| `/api/subscription POST` | 10 istek | 1 dakika |
| `/api/subscription GET` | 60 istek | 1 dakika |
| `/api/track POST` | 200 istek | 1 dakika |
| `/api/popups/:userId GET` | 100 istek | 1 dakika |

### 3. Input Validasyonu

- **UUID Validasyonu**: Tüm user_id ve popup_id parametreleri UUID formatında doğrulanır
- **Whitelist Validasyonu**: event_type ve addon_type parametreleri sadece izin verilen değerlerle kabul edilir
- **String Sanitizasyonu**: XSS önleme için HTML karakterleri encode edilir
- **Uzunluk Limitleri**: URL (2000 karakter), user_agent (500 karakter) limitleri

### 4. Kimlik Doğrulama

- **Supabase Auth**: Kullanıcı kimlik doğrulaması Supabase üzerinden yönetilir
- **Email Onayı**: Kayıt sonrası email onayı zorunludur
- **Session Yönetimi**: JWT tabanlı güvenli oturum yönetimi

### 5. Veritabanı Güvenliği

- **Row Level Security (RLS)**: Supabase'de aktif
- **Parametrik Sorgular**: SQL injection koruması (Supabase SDK tarafından sağlanır)
- **Minimum Yetki Prensibi**: API'ler sadece gerekli alanları sorgular

### 6. CORS Kontrolü

- Public endpoint'ler (pixel, tracking) tüm originlerden erişime açık (tasarım gereği)
- Hassas endpoint'ler için origin kontrolü yapılabilir

### 7. Gizlilik

- **IP Hashleme**: Tracking verilerinde IP adresleri hashlenmiş olarak saklanır
- **Minimum Veri**: Sadece gerekli veriler toplanır

### 8. Environment Variables

Hassas bilgiler environment variable'larda saklanır:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=https://poplift.vercel.app
```

**ÖNEMLİ**: Bu değerler kod içinde hardcoded OLMAMALIDIR!

---

## Iyzico Entegrasyonu İçin Gerekli Adımlar

1. **Iyzico Hesap Oluştur**: https://www.iyzico.com/
2. **API Anahtarlarını Al**: Sandbox ve Production anahtarları
3. **Environment Variables Ekle**:
   ```env
   IYZICO_API_KEY=xxx
   IYZICO_SECRET_KEY=xxx
   IYZICO_BASE_URL=https://api.iyzipay.com
   ```
4. **Webhook URL'i Kaydet**: `/api/webhooks/iyzico`
5. **SSL Sertifikası**: Zaten Vercel'de aktif

---

## Güvenlik Kontrol Listesi

- [x] HTTPS zorunluluğu (HSTS)
- [x] XSS koruması (CSP, X-XSS-Protection)
- [x] Clickjacking koruması (X-Frame-Options)
- [x] Rate limiting
- [x] Input validasyonu
- [x] SQL injection koruması (parametrik sorgular)
- [x] Hassas verilerin environment variable'larda saklanması
- [x] API hata mesajlarında hassas bilgi sızıntısı önleme
- [x] Production'da console.log kaldırma
- [ ] Iyzico entegrasyonu (beklemede)
- [ ] 2FA desteği (gelecek özellik)

---

*Son Güncelleme: 2026-01-04*
