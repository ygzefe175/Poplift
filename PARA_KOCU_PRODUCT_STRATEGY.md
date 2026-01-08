# 🚀 POPLIFT PARA KOÇU: PRODUCT STRATEGY & MONETIZATION ROADMAP

**Versiyon:** 2.0 (Growth Focus)  
**Tarih:** 7 Ocak 2026  
**Hedef:** Yüksek Retention, Mikro-Ödeme Döngüsü, Veri Bağımlılığı

---

## 💎 AŞAMA 1: ÇEKİRDEK DEĞERİ (CORE VALUE)

### TEK CÜMLELİK VAAT:
> **"Bu şekilde harcamaya devam edersen, paran tam olarak ayın kaçında bitecek?"**

Bu vaat, ürünün "Kuzey Yıldızı"dır. Tüm özellikler bu soruyu cevaplamaya veya bu cevabı değiştirmeye (iyileştirmeye) hizmet etmelidir. Kullanıcının siteye girmesinin tek sebebi: **Yüzleşmek.**

---

## 🗺️ GROWTH & EXECUTION ROADMAP

### 1️⃣ FAZ 1: "YÜZLEŞME & KORKU" (DÖNÜŞÜM ODAĞI)
*Amaç: Kullanıcıyı kaydettirmek ve ilk "Aha!" anını yaşatmak.*

#### A. "Ölüm Tarihi" Hesaplayıcısı (Geliştirildi)
*   **Mevcut:** Sadece gün sayısı veriyor.
*   **Yeni:** **"Paran 23 Ocak Çarşamba, Saat 14:00 civarında bitecek."**
*   **Neden Gerekli:** Soyut "18 gün" korkutmaz. Somut "23 Ocak" panik ve aksiyon yaratır.
*   **Paraya Dönüş:** Tarihi gören kullanıcı, "Bunu nasıl 1 Şubat yaparım?" butonuna tıklar -> PREMIUM.

#### B. Sürdürülebilirlik İbresi (Burn Rate Gauge)
*   **Özellik:** Gelir vs Gider Hızı göstergesi.
*   **Mesaj:** "Şu an gelirinin %120'si hızında harcıyorsun. Hızın 100km/s ama yolun sonu uçurum."
*   **Teknik:** Basit, renkli bir gauge chart (Kırmızı-Yeşil bölge). SVG ile implemente edilecek.

### 2️⃣ FAZ 2: "GÜNLÜK BAĞIMLILIK" (RETENTION ODAĞI)
*Amaç: Kullanıcının uygulamayı her gün açmasını sağlamak.*

#### A. "Bugün Harcama Yaptın mı?" (Daily Check-in)
*   **UX:** Ana sayfada devasa tek soru. "Bugün para harcadın mı?"
    *   [Evet]: Hızlıca tutar gir -> Bakiye Grafiği anında düşer (Görsel Ceza).
    *   [Hayır]: Konfeti patlar, bitiş tarihi 1 gün ileri atar (Görsel Ödül).
*   **Kullanıcıya Etkisi:** Oyunlaştırma (Gamification) ve suçluluk/ödül döngüsü.
*   **Teknik:** LocalStorage öncelikli, Supabase sync arka planda. PWA manifest ile "Add to Home Screen" teşviki.

#### B. Bildirim Sistemi (Sessiz Koç)
*   **Mekanik:** Tarayıcı push bildirimi (veya e-posta).
*   **Tetikleyici:** Kullanıcı 24 saat giriş yapmazsa.
*   **Copy:** "Cüzdanında hareket var mı? Bugünün durumunu 1 tıkla güncelle."
*   **Paraya Dönüş:** Sık gelen kullanıcı Premium'a daha yatkındır.

### 3️⃣ FAZ 3: "PREMIUM KİLİDİ" (MONETIZATION ODAĞI)
*Amaç: Ücretsiz kullanıcının "duvara çarpıp" ödeme yapması.*

#### A. "Geleceği Görme" Kilidi
*   **Ücretsiz:** Sadece bugünün durumunu ve bitiş tarihini görür.
*   **Premium Duvarı:** "Eğer şimdi günde 50 TL kısarsan, ay sonunda +1.500 TL ile çıkarsın. **Simülasyonu görmek için tıkla.**"
*   **Psikoloji:** Korkuyu (bitiş tarihi) ücretsiz ver, ilacı (çözüm yolu) sat.

#### B. Akıllı Senaryolar (What-If Analysis)
*   **Özellik:** Slider ile "Keyfi harcamayı %20 kıs" dediğinde grafiklerin *real-time* değişmesi.
*   **Neden Gerekli:** Kullanıcıya kontrol hissi satıyoruz.

### 4️⃣ FAZ 4: "MİKRO-ÖDEME MODELİ"
*   **Fiyat:** 29 TL / Hafta (Kahve parası altı) veya 99 TL / Ay.
*   **Konumlandırma:** "Bir kahve parasına, bir aylık finansal huzur."

---

## 🛠️ TEKNİK UYGULAMA GERÇEKLİĞİ

### 1. Frontend & State (Next.js 14)
*   **State:** `Zustand` kullanılacak. `persist` middleware ile LocalStorage'a anında yazılacak. Kullanıcı refresh etse bile veri asla kaybolmamalı.
*   **SSR vs CSR:** Hesaplama modülleri tamamen `client-side` (CSR) çalışmalı. Sunucu maliyeti sıfır olmalı. Veriler sadece yedekleme (sync) için Supabase'e gitmeli.

### 2. Görselleştirme (Charts)
*   **Kütüphane:** `Recharts` (Hafif, React-native uyumlu, özelleştirilebilir).
*   **Neden:** Mevcut SVG çözümü basit bar chart için iyi ama detaylı "Line Chart Trend" ve "Donut Drill-down" için yetersiz kalacak.
*   **Plan:**
    *   `BakiyeProjeksiyonu`: AreaChart (Yeşil alan, Kırmıza düşüş).
    *   `HarcamaDagilimi`: PieChart (Aktif kategori vurgulu).

### 3. Database (Supabase)
*   **Tablo:** `daily_logs`
    *   `user_id`, `date`, `amount`, `category`, `mood` (harcarken nasıl hissettin - opsiyonel)
*   **Tablo:** `financial_snapshot`
    *   Her günün sonunda otomatik özet satırı.

---

## 🎯 SONUÇ: 30 GÜN SONRA POPLIFT
PopLift, "hesap yapan bir site" olmaktan çıkıp;
Kullanıcının sabah uyanınca **"Bugün param ne kadar kaldı?"** diye kontrol ettiği, harcama yaparken **"Bunu girersem grafiğim bozulur mu?"** diye düşündüğü, **dijital bir finansal vicdan** haline gelecek.

**İlk Aksiyon:** "Ölüm Tarihi Hesaplayıcısı"nın dilini sertleştir ve "Günlük Check-in" modülünü ana sayfaya (Dashboard) ekle.
