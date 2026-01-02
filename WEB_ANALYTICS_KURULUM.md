# 📊 Web Analitik Paketi - Kurulum Rehberi

> Bu rehber, **Premium Analytics** eklentisini satın alan müşterilerin sistemi nasıl kuracağını açıklar.

---

## 🎯 Web Analitik Nedir?

Web Analitik paketi size şunları sağlar:
- **📈 Sayfa Görüntüleme Takibi** - Hangi sayfalar ziyaret edildi
- **⏱️ Zaman Analizi** - Ziyaretçiler ne kadar kaldı
- **📱 Cihaz Dağılımı** - Mobil/Desktop/Tablet oranları
- **🔄 Scroll Derinliği** - Kullanıcılar sayfanın ne kadarını gördü
- **🔗 Trafik Kaynakları** - Ziyaretçiler nereden geliyor
- **🗺️ Kullanıcı Yolculuğu** - Sayfa gezinme sırası

---

## 🚀 Kurulum (3 Dakika)

### Adım 1: Mevcut Kodu Güncelle

Eğer zaten popup kodunu kullanıyorsanız, sadece `&analytics=true` parametresini ekleyin:

```html
<!-- ÖNCEKİ KOD (Sadece Popup) -->
<script src="https://popwise-app.vercel.app/api/pixel?id=KULLANICI_ID" async></script>

<!-- YENİ KOD (Popup + Analytics) -->
<script src="https://popwise-app.vercel.app/api/pixel?id=KULLANICI_ID&analytics=true" async></script>
```

### Adım 2: Kodu Sitenize Ekleyin

Kodu sitenizin **`</head>`** etiketinden hemen önce yapıştırın:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Siteniz</title>
    <!-- ... diğer meta taglar ... -->
    
    <!-- Popwise Analytics -->
    <script src="https://popwise-app.vercel.app/api/pixel?id=KULLANICI_ID&analytics=true" async></script>
</head>
<body>
    <!-- Sayfa içeriği -->
</body>
</html>
```

### Adım 3: Kurulumu Doğrulayın

1. Sitenizi açın
2. Tarayıcının **Developer Tools** > **Console** sekmesini açın (F12)
3. Şu mesajı görmelisiniz:
   ```
   [Popwise] Analytics initialized. Session: s_17357...
   ```

---

## 📊 Dashboard'da Verileri Görüntüleme

1. **[popwise-app.vercel.app](https://popwise-app.vercel.app)** adresine gidin
2. Hesabınıza giriş yapın
3. Sol menüden **"Analitik"** sekmesine tıklayın
4. Tüm verilerinizi görün:
   - Trafik grafiği
   - Dönüşüm oranları
   - Cihaz dağılımı
   - En çok ziyaret edilen sayfalar
   - Trafik kaynakları

---

## 🛒 Platform Kurulumları

### WordPress

1. **Görünüm > Tema Düzenleyici** veya **Tema Özelleştirici** açın
2. `header.php` dosyasını bulun
3. `</head>` etiketinden önce kodu yapıştırın
4. Kaydedin

**Alternatif:** "Insert Headers and Footers" eklentisi kullanın.

### Shopify

1. **Online Store > Themes > Edit Code**
2. `theme.liquid` dosyasını açın
3. `</head>` etiketinden önce kodu yapıştırın
4. Kaydedin

### Wix

1. **Settings > Custom Code**
2. **+ Add Custom Code** tıklayın
3. Kodu yapıştırın
4. Placement: **Head**
5. Pages: **All pages**
6. Kaydedin

### Ticimax / IdeaSoft / T-Soft

1. **Ayarlar > Genel Ayarlar > Ek Kodlar**
2. **Header Scripts** alanına kodu yapıştırın
3. Kaydedin

---

## 🔧 Gelişmiş Ayarlar

### UTM Parametreleri Takibi

Analytics otomatik olarak UTM parametrelerini takip eder:
- `utm_source` - Trafik kaynağı (google, facebook, vb.)
- `utm_medium` - Trafik türü (cpc, email, social, vb.)
- `utm_campaign` - Kampanya adı

**Örnek URL:**
```
https://siteniz.com/?utm_source=instagram&utm_medium=social&utm_campaign=yilbasi
```

### Sayfa Bazlı Takip

Her sayfa otomatik olarak ayrı ayrı takip edilir. Özel sayfaları hariç tutmak için:

```html
<script>
  // Analytics'i belirli sayfalarda devre dışı bırak
  if (window.location.pathname.includes('/admin')) {
    window.POPWISE_DISABLE_ANALYTICS = true;
  }
</script>
<script src="https://popwise-app.vercel.app/api/pixel?id=KULLANICI_ID&analytics=true" async></script>
```

---

## 📈 Takip Edilen Metrikler

| Metrik | Açıklama |
|--------|----------|
| **Ziyaretçi Sayısı** | Toplam ve benzersiz ziyaretçi sayısı |
| **Sayfa Görüntüleme** | Toplam sayfa görüntüleme sayısı |
| **Ortalama Oturum Süresi** | Ziyaretçilerin sitede ortalama kalma süresi |
| **Bounce Rate** | Tek sayfa ziyaret edip çıkanların oranı |
| **Scroll Derinliği** | Sayfanın yüzde kaçının görüntülendiği |
| **Cihaz Dağılımı** | Mobil, Desktop, Tablet kullanım oranları |
| **Tarayıcı Dağılımı** | Chrome, Safari, Firefox vb. oranları |
| **Trafik Kaynakları** | Ziyaretçilerin nereden geldiği |
| **En Popüler Sayfalar** | En çok ziyaret edilen sayfalar |

---

## ❓ Sıkça Sorulan Sorular

### Veriler ne kadar sürede görünür?
İlk veriler **5-10 dakika** içinde Dashboard'da görünür.

### GDPR/KVKK uyumlu mu?
Evet! Analytics kodu kişisel veri toplamaz, IP adresleri saklanmaz. Sadece anonim istatistikler toplanır.

### Site hızını etkiler mi?
Hayır! Script **asenkron** yüklenir ve sayfa yüklemesini engellemez. Boyutu sadece **~5KB**.

### Birden fazla siteye kurabilir miyim?
Premium Analytics paketi hesabınıza bağlıdır. Tüm sitelerinizi tek dashboard'dan takip edebilirsiniz.

---

## 🆘 Destek

Kurulumda sorun yaşarsanız:
- 📧 **destek@popwise.app**
- 💬 Dashboard'daki canlı destek
- 📚 [Yardım Merkezi](https://popwise-app.vercel.app/help)

---

**🎉 Tebrikler!** Web Analitik paketiniz artık aktif. Ziyaretçi davranışlarını analiz ederek dönüşümlerinizi artırın!
