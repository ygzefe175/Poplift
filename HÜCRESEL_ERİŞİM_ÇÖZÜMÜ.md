# Hücresel Veriyle Erişim Sorunu Çözümü

## 🚨 Problem
Popwise sitesi sadece WiFi ile erişilebiliyor, hücresel veriyle erişilemiyor.

**Sebep:** Vercel'in `.vercel.app` domain'i Türkiye'deki mobil operatörler tarafından bloklanıyor.

---

## ✅ ÇÖZÜM 1: Özel Domain Ekle (ÖNERİLEN)

### Adım 1: Domain Satın Al
- **İyi seçenekler:** 
  - popwise.com.tr
  - popwise.io
  - popwise.app
  - getpopwise.com

- **Nereden alınır:**
  - GoDaddy.com
  - Namecheap.com
  - CloudFlare Registrar (en ucuz)
  - Natro.com (Türk firma)

### Adım 2: Vercel'e Domain Ekle

1. Vercel Dashboard'a git: https://vercel.com/dashboard
2. Projeyi seç: `conversion-system` veya `popwisee`
3. **Settings** > **Domains** git
4. Yeni domain ekle (örn: `popwise.com.tr`)
5. DNS kayıtlarını kopyala

### Adım 3: DNS Ayarları

Domain sağlayıcında (GoDaddy, Namecheap vb.) şu kayıtları ekle:

```
Type: CNAME
Name: www
Target: cname.vercel-dns.com

Type: A
Name: @
Target: 76.76.21.21
```

**VEYA Cloudflare Kullan (Daha İyi):**

1. Cloudflare.com'da hesap aç
2. Domain'i ekle
3. Nameserver'ları değiştir
4. Cloudflare'de:
   - A Record: @ -> 76.76.21.21  
   - CNAME Record: www -> cname.vercel-dns.com
5. SSL/TLS -> Full (strict) seç
6. Proxy açık olsun (turuncu bulut)

### Adım 4: Vercel'de Doğrula
- Vercel panelinden domain'i doğrula
- SSL sertifikası otomatik oluşacak (10-30 dakika)
- Artık hem WiFi hem hücresel veriyle erişilebilir!

---

## ✅ ÇÖZÜM 2: Alternatif Hosting (Domain Kullanmazsanız)

### Netlify'a Taşı

```powershell
# Netlify CLI kur
npm install -g netlify-cli

# Giriş yap
netlify login

# Deploy et
netlify deploy --prod
```

### Railway.app'e Taşı

```powershell
# Railway CLI kur
npm install -g @railway/cli

# Giriş yap
railway login

# Deploy et
railway up
```

### Render.com'a Taşı

1. render.com'da hesap aç
2. "New Static Site" oluştur
3. GitHub repo'yu bağla
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Environment variables ekle (.env.local'den)

---

## ⚡ Hızlı Test: Domain Alana Kadar Geçici

### Cloudflare Tunnel (Ücretsiz CDN)

Cloudflare'in Workers kullanarak Vercel'i proxy edebilirsiniz ama bu advanced bir yöntem.

### Netlify'da Barındır (En Hızlı)

Netlify Türkiye'de genelde bloklanmıyor:

```powershell
cd C:\Users\Yağız\.gemini\antigravity\scratch\conversion-system

# Netlify CLI ile yayınla
npx netlify-cli deploy --prod
```

---

## 📊 Karşılaştırma

| Platform | Türkiye'de Erişim | Ücretsiz Plan | Custom Domain |
|----------|-------------------|---------------|---------------|
| Vercel (.vercel.app) | ❌ Bloklu (mobil) | ✅ Var | ✅ Destekler |
| Vercel (özel domain) | ✅ Çalışır | ✅ Var | ✅ Gerekli |
| Netlify | ✅ Genelde çalışır | ✅ Var | ✅ Destekler |
| Railway | ✅ Çalışır | ⚠️ Kredi kartı gerekir | ✅ Destekler |
| Render | ✅ Çalışır | ✅ Var | ✅ Destekler |

---

## 🎯 ÖNERİM

**En profesyonel ve kalıcı çözüm:**

1. ✅ `popwise.com.tr` veya `popwise.io` domain satın al (50-200 TL/yıl)
2. ✅ Cloudflare'e ekle (ücretsiz)
3. ✅ Vercel'e bağla
4. ✅ Hem WiFi hem mobil veri çalışacak

**Hızlı geçici çözüm:**

1. ⚡ Netlify'a deploy et (5 dakika)
2. ⚡ Test et, çalışıyor mu kontrol et
3. ⚡ Sonradan domain eklersin

---

## 🛠️ Yardım Lazımsa

Hangi yöntemle gitmek istediğini söyle:
- "Domain alacağım, Cloudflare + Vercel kuralım"
- "Netlify'a taşıyalım hemen"
- "Render.com'u deneyelim"

Ben adım adım yardımcı olurum! 🚀
