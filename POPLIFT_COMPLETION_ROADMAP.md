# 🚀 POPLIFT EKSİK MODÜLLER VE PRODUCTION ROADMAP

**Versiyon:** 3.0 (Completion & Retention)  
**Tarih:** 7 Ocak 2026  
**Hedef:** Ürünü "Hesap Makinesi"nden "Kişisel Finans Koçu"na dönüştürmek.

---

## 🛑 MEVCUT DURUM ANALİZİ
Şu an elimizde güçlü bir **"Korku Faktörü"** (Ölüm Tarihi) ve temel bir **"Günlük Check-in"** var. Ancak, **kişiselleştirme, tarihsel hafıza ve gerçek bir simülasyon deneyimi** eksik. Kullanıcı bir kez hesaplayıp çıkabilir. Onu içeride tutacak ve geri getirecek derinlik yok.

Aşağıdaki plan, bu eksikleri kapatmak için önceliklendirilmiştir.

---

## 1️⃣ [ÖNCELİK 1] AKTİF SENARYO SİMÜLASYONU (INTERACTIVE PLAYGROUND)

### 🚨 Neden Kritik?
Şu an kullanıcı sonucu görüyor ve "Peki ne yapacağım?" diyor. Cevap yok. Kullanıcıya **kontrol** hissi vermeliyiz. "Eğer" sorusunun cevabını anında görmeli.

### 🧠 Kullanıcı Psikolojisi
"Kaderimi değiştirebilirim." hissi = Güven = Satın Alma İsteği.

### 🛠️ Teknik & UX Detayı
*   **Yerleşim:** Hesaplama sonucunun (`Result`) hemen altına.
*   **Component:** `InteractiveSlider.tsx`
*   **State:** Local state (hızlı tepki için).
*   **Flow:**
    1.  Kullanıcı hesaplama yapar.
    2.  Sonuç ekranında "Değişimi Gör" slider'ı belirir.
    3.  Slider: "Günlük Harcama: ₺150" (Mevcut) -> Sola kaydır -> "₺120"
    4.  **ANINDA:** PAranın bitiş tarihi grafikte ileri atar (+5 gün).
    5.  Premium Kancası: "Bu tempoyla ay sonu +900₺ kalır. Bu parayla ne yapmalısın? [Premium Tavsiye]"

### 💰 Monetization
Slider'ın belli bir noktasından sonrası (örn. çok radikal tasarruf senaryoları veya yatırım tavsiyesi) **Premium** kilitli olur.

---

## 2️⃣ [ÖNCELİK 2] TARİHSEL HAFIZA & KIYAS (PROGRESS TRACKING)

### 🚨 Neden Kritik?
Kullanıcı dün de girdi, bugün de. Gelişme var mı? Bilmiyoruz. İnsan beyni **gelişimi görmeyi sever**.

### 🧠 Kullanıcı Psikolojisi
"İlerleme kaydediyorum, o zaman bu uygulamayı kullanmaya devam etmeliyim." (Sunk Cost Fallacy + Achievement).

### 🛠️ Teknik & UX Detayı
*   **Yerleşim:** Dashboard ve Hesaplama Sonucu üstü.
*   **Storage:** `localStorage` içinde `history_log` array'i.
*   **Logic:**
    *   Son hesaplamayı kaydet.
    *   Yeni hesaplama yapıldığında: `Current - Last = Diff`
*   **UI Metni:**
    *   [İyi]: "Harika! Geçen haftaya göre günlük harcaman ₺20 düşmüş." 🟢
    *   [Kötü]: "Dikkat! Geçen hesaplamadan bu yana harcama hızın artmış." 🔴

### 💰 Monetization
Basit kıyas ücretsiz. **Detaylı Aylık Trend Grafiği** Premium.

---

## 3️⃣ [ÖNCELİK 3] GERÇEK KİŞİSELLEŞTİRME (SMART INSIGHTS)

### 🚨 Neden Kritik?
"Merhaba Kullanıcı" yerine "Merhaba, maaşına 12 gün kalan ama parası 5 günde bitecek olan Kullanıcı" demek çok daha etkilidir.

### 🧠 Kullanıcı Psikolojisi
"Beni tanıyor, o zaman dediklerine güvenebilirim."

### 🛠️ Teknik & UX Detayı
*   **Yerleşim:** Dashboard Hero alanı ("SENİN DURUMUN").
*   **Logic:**
    *   Veri: Maaş Günü, Bakiye, Harcama Hızı.
    *   Rule Engine:
        *   `MaaşGünü - Bugün > BitişTarihi - Bugün` => **KRİTİK (Kırmızı)**
        *   `KalanPara < SabitGiderler` => **ACİL (Mor)**
*   **Copy:** "Yağız, durumlar sıkışık. Maaşına 15 gün var ama bu hızla para 10 günde biter."

---

## 4️⃣ [ÖNCELİK 4] PAYLAŞILABİLİR SONUÇ KARTI (VIRAL LOOP)

### 🚨 Neden Kritik?
Organik büyüme için kullanıcıların acılarını veya başarılarını paylaşması gerekir.

### 🛠️ Teknik & UX Detayı
*   **Özellik:** Instagram Story boyutunda, şık, temiz bir görsel oluşturma.
*   **İçerik:**
    *   "PopLift diyor ki: Mart ayını çıkaramıyorum." 📉
    *   "PopLift Skor: Finansal Dahi." 📈
*   **Teknik:** `html2canvas` veya pre-made görsel üzerine dinamik text.

---

## 📅 14 GÜNLÜK UYGULAMA PLANI

### 1-3. Gün: İnteraktif Simülasyon (Faz 1 Tamamlayıcısı)
*   Slider komponentini yap.
*   Hesaplama algoritmasını anlık (real-time) çalışacak hale getir.
*   Sonuç ekranına entegre et.

### 4-6. Gün: Tarihsel Hafıza (Backend-Free Analytics)
*   `localStorage` yapısını güncelle (`history` array).
*   Her hesaplamada log tut.
*   Dashboard'a "Gelişim" widget'ı ekle.

### 7-10. Gün: Kişiselleştirme & Dashboard Revizyonu
*   Dashboard'u statik halden dinamik hale getir.
*   "Senin Durumun" kartını en tepeye koy.
*   Kullanıcı ismini ve durumunu (kırmızı/yeşil) dinamik bas.

### 11-14. Gün: Premium Kilitleri & Polish
*   Simülasyonda "Yatırım Tavsiyesi"ni kilitle.
*   Trend grafiğini kilitle.
*   Paylaşım kartını ekle.

---

## 🚀 HEMEN BAŞLANACAK GÖREV: İNTERAKTİF SİMÜLASYON

Kullanıcıya hesaplama sonucunun hemen altında, **"Harcamanı değiştirirsen ne olur?"** slider'ı sunacağız. Bu, statik bir sonuçtan dinamik bir deneyime geçişin anahtarıdır.

**Beklenen Etki:** Kullanıcı slider ile oynarken "Aaa, günde sadece 50 lira kısarsam ay sonunu getiriyorum" aydınlanmasını yaşayacak.
