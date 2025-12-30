# Popwise Embed Kurulum Rehberi

## 🚀 Hızlı Başlangıç

Popwise popup sisteminizi herhangi bir web sitesine eklemek sadece **3 adım** alır:

### 1. Kurulum Kodunu Kopyalayın

Dashboard'unuzda gösterilen aşağıdaki kodu kopyalayın:

```html
<!-- Popwise - Conversion Optimization -->
<script src="https://YOUR-DOMAIN.com/api/pixel?id=YOUR-USER-ID" async></script>
```

### 2. Sitenize Ekleyin

Bu kodu sitenizin `<head>` bölümüne yapıştırın:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Siteniz</title>
    <!-- Diğer meta taglar -->
    
    <!-- Popwise Kurulum Kodu -->
    <script src="https://YOUR-DOMAIN.com/api/pixel?id=YOUR-USER-ID" async></script>
</head>
<body>
    <!-- Site içeriğiniz -->
</body>
</html>
```

### 3. Kaydedin ve Test Edin

Değişiklikleri kaydedin ve sitenizi ziyaret edin. Popup'larınız otomatik olarak görünecek!

---

## 🛠️ Platform Bazlı Kurulum

### WordPress

1. **Tema Editörü** > **header.php** dosyasını açın
2. `</head>` etiketinden hemen önce kodu yapıştırın
3. Kaydedin

**Veya** bir Header/Footer eklentisi kullanın:
- Insert Headers and Footers
- WPCode
- Head & Footer Code

### Shopify

1. **Online Store** > **Themes** > **Edit code**
2. **theme.liquid** dosyasını açın
3. `</head>` etiketinden hemen önce kodu yapıştırın
4. Kaydedin

### Wix

1. **Settings** > **Custom Code**
2. **Add Custom Code** tıklayın
3. Kodu yapıştırın
4. **Head** seçin
5. **All pages** seçin
6. Yayınlayın

### Squarespace

1. **Settings** > **Advanced** > **Code Injection**
2. **Header** bölümüne kodu yapıştırın
3. Kaydedin

### React / Next.js

```jsx
// _document.js veya layout.tsx içinde
import Head from 'next/head';

export default function Document() {
  return (
    <Html>
      <Head>
        <script 
          src="https://YOUR-DOMAIN.com/api/pixel?id=YOUR-USER-ID" 
          async
        />
      </Head>
      <body>...</body>
    </Html>
  );
}
```

---

## 📊 Popup Türleri

| Tür | Açıklama | Tetikleyici |
|-----|----------|-------------|
| **Exit Intent** | Kullanıcı sayfadan çıkmaya çalışırken | Mouse sayfa dışına çıktığında |
| **Scroll** | Belirli scroll yüzdesinde | Varsayılan: %50 scroll |
| **Time Based** | Belirli süre sonra | Varsayılan: 5 saniye |
| **Standard** | Sayfa yüklendikten sonra | 3 saniye sonra |

---

## ❓ Sık Sorulan Sorular

### Popup neden görünmüyor?

1. **Kurulum kodunu doğru yere eklediniz mi?** `<head>` bölümünde olmalı.
2. **Aktif popup'ınız var mı?** Dashboard'da en az bir aktif popup olmalı.
3. **Tarayıcı önbelleğini temizleyin** - Ctrl+Shift+R
4. **Console'u kontrol edin** - F12 > Console'da hata var mı bakın

### Popup 24 saat aynı ziyaretçiye görünmüyor

Bu beklenen davranıştır! Sistem aynı popup'ı aynı ziyaretçiye 24 saat boyunca tekrar göstermez. Test için:
- localStorage'ı temizleyin
- Veya farklı bir tarayıcı/gizli mod kullanın

### Mobil cihazlarda çalışıyor mu?

Evet! Popwise otomatik olarak mobil cihazlara uyum sağlar. Exit intent mobilde "scroll up" tetikleyicisine dönüşür.

### Sitenizi yavaşlatır mı?

Hayır. Script `async` ile yüklenir, yani sitenizi engellemez. Sadece 3KB gzip boyutundadır.

---

## 🔧 Gelişmiş Ayarlar

### Belirli sayfalarda devre dışı bırakma

```javascript
// Script'i devre dışı bırakmak için
window.POPWISE_DISABLED = true;
```

### Debug modunu açma

Tarayıcı console'unda:
```javascript
localStorage.setItem('popwise_debug', 'true');
location.reload();
```

---

## 📞 Destek

Sorunuz mu var? 
- Email: destek@popwise.com
- Dashboard içi canlı chat

---

*Popwise - Dönüşümlerinizi Artırın* 🚀
