# 🎯 PARA KOÇU - ÜRÜN GELİŞTİRME ROADMAP'İ

**Hazırlayan:** AI Product Strategist  
**Tarih:** 7 Ocak 2026  
**Versiyon:** 1.0  

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ Mevcut Özellikler
- Eldeki para / günlük harcama / sabit gider girişi
- Paranın biteceği tarih hesaplama
- Bakiye projeksiyon grafiği (bar chart)
- Gider kategorileri (Yemek, Ulaşım, Eğlence, Fatura, Diğer)
- Donut chart ile para dağılımı (Premium)
- "Bu hızla vs Kısarsan" karşılaştırması (Premium)
- Akıllı öneriler (Premium)
- Aile modu (1-4 kişi)
- Veri kaydetme (localStorage)
- Gelir tipi seçimi (Maaşlı, Girişimci, Serbest)

### ❌ Eksik Özellikler
1. Günlük harcama girişi / takibi
2. Geçmiş görüntüleme
3. E-posta raporları
4. Push bildirimleri
5. Dashboard entegrasyonu
6. Kişi bazlı harcama (aile içi)

---

## 🚀 ÖNCELİK SIRASI (P1 → P5)

| Öncelik | Özellik | Etki | Efor | ROI |
|---------|---------|------|------|-----|
| **P1** | Günlük Harcama Takibi | 🔥🔥🔥 | Orta | Çok Yüksek |
| **P1** | Dashboard Entegrasyonu | 🔥🔥🔥 | Düşük | Yüksek |
| **P2** | Haftalık Özet Rapor | 🔥🔥 | Orta | Yüksek |
| **P2** | Push Bildirimler | 🔥🔥 | Orta | Yüksek |
| **P3** | AI Tavsiye Modülü v2 | 🔥🔥 | Yüksek | Orta |
| **P3** | Gelişmiş Aile Modu | 🔥 | Orta | Orta |
| **P4** | E-posta Raporları | 🔥 | Yüksek | Düşük |
| **P5** | Trend Grafikleri | 🔥 | Yüksek | Düşük |

---

## 1️⃣ GÜNLÜK HARCAMA TAKİBİ (P1)

### 📱 UX AKIŞI
```
[Ana Sayfa]
    ↓
[Floating Action Button: "+" ]
    ↓
[Quick Add Modal]
    → Tutar girişi
    → Kategori seçimi (ikonlu)
    → Opsiyonel: Not
    ↓
[Kaydet → Anlık bakiye güncelleme]
    ↓
[Günlük özet kartı güncellenir]
```

### 🎨 GÖRSEL YERLEŞİM
```
┌─────────────────────────────────┐
│  📅 7 Ocak 2026 - Bugün         │
├─────────────────────────────────┤
│  Günlük Harcama: ₺245          │
│  ████████░░░░░░░░ ₺150 kaldı   │
├─────────────────────────────────┤
│  🍽️ Yemek      ₺85             │
│  🚗 Ulaşım     ₺60             │
│  ☕ Kahve      ₺100            │
├─────────────────────────────────┤
│         [+ Harcama Ekle]        │
└─────────────────────────────────┘
```

### 🔧 TEKNİK UYGULAMA

**State Yönetimi:**
```typescript
interface DailyExpense {
    id: string;
    amount: number;
    category: 'food' | 'transport' | 'entertainment' | 'bills' | 'other';
    note?: string;
    timestamp: Date;
}

interface ExpenseStore {
    expenses: DailyExpense[];
    dailyBudget: number;
    todayTotal: number;
    addExpense: (expense: Omit<DailyExpense, 'id' | 'timestamp'>) => void;
    removeExpense: (id: string) => void;
}

// Zustand veya Context API ile
// localStorage sync ile persist
```

**Veritabanı (Supabase):**
```sql
CREATE TABLE user_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    note TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_expenses_date ON user_expenses(user_id, expense_date);
```

**Bileşenler:**
- `ExpenseQuickAdd.tsx` - Modal/Sheet
- `DailyExpenseCard.tsx` - Günlük özet
- `ExpenseList.tsx` - Harcama listesi
- `CategoryPicker.tsx` - İkonlu kategori seçici

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| Günde 5 harcama | Sınırsız |
| Son 7 gün | Tüm geçmiş |
| 5 kategori | Özel kategoriler |
| - | CSV dışa aktarma |

### 🧠 PSİKOLOJİK TETİKLEYİCİLER
- **Streak sistemi:** "3 gündür bütçende kaldın! 🔥"
- **Micro-rewards:** Yeşil tik animasyonu
- **Loss aversion:** "Bugün ₺45 fazla harcadın"
- **Social proof:** "Kullanıcıların %78'i günlük giriş yapıyor"

---

## 2️⃣ DASHBOARD ENTEGRASYONU (P1)

### 📱 UX AKIŞI
```
[Dashboard]
    ↓
[Widget: "Para Koçu Özeti"]
    → Kalan bakiye
    → Bugünkü harcama
    → Risk seviyesi
    ↓
[Tıkla → /para-yonetimi]
```

### 🎨 GÖRSEL YERLEŞİM
```
Dashboard Sayfası:
┌─────────────────────────────────┐
│  👋 Hoş geldin, Yağız           │
├──────────────┬──────────────────┤
│ 📊 Kampanya  │ 💰 Para Durumun  │
│   Özeti      │                  │
│              │  ₺4,250 kaldı   │
│  12 aktif    │  ██████████░░   │
│   kampanya   │  18 gün güvenli  │
│              │                  │
│              │  [Detaylara Git] │
├──────────────┴──────────────────┤
│           [Diğer widgetlar]     │
└─────────────────────────────────┘
```

### 🔧 TEKNİK UYGULAMA

**Widget Bileşeni:**
```tsx
// src/components/widgets/MoneyCoachWidget.tsx

export function MoneyCoachWidget() {
    const { balance, daysRemaining, riskLevel } = useMoneyCoach();
    
    return (
        <Link href="/para-yonetimi" className="widget-card">
            <div className="flex items-center gap-2">
                <Wallet className="text-purple-400" />
                <span>Para Durumun</span>
            </div>
            
            <div className="text-3xl font-black">
                ₺{formatCurrency(balance)}
            </div>
            
            <ProgressBar 
                value={daysRemaining} 
                max={30} 
                color={riskLevel}
            />
            
            <span className="text-sm text-slate-400">
                {daysRemaining} gün güvenli
            </span>
        </Link>
    );
}
```

**Dashboard'a Ekleme:**
```tsx
// src/app/dashboard/page.tsx

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CampaignWidget />
    <MoneyCoachWidget />  {/* YENİ */}
    <AnalyticsWidget />
</div>
```

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| Basit widget | Detaylı widget |
| - | Trend oku |
| - | Quick actions |

### 🧠 PSİKOLOJİK TETİKLEYİCİLER
- **Visibility:** Her giriş yapıldığında görsün
- **Curiosity gap:** "Risk hesaplamak için tıkla"
- **Consistency:** Günlük kontrol alışkanlığı

---

## 3️⃣ HAFTALIK ÖZET RAPOR (P2)

### 📱 UX AKIŞI
```
[Hafta sonu (Pazar)]
    ↓
[In-app bildirim + E-posta]
    ↓
[Rapor sayfası açılır]
    → Bu hafta toplam harcama
    → Kategori breakdown
    → Geçen haftayla karşılaştırma
    → Öneri
```

### 🎨 GÖRSEL YERLEŞİM
```
HAFTALIK RAPOR - 1-7 Ocak 2026
┌─────────────────────────────────┐
│  📊 Bu Hafta Özeti              │
├─────────────────────────────────┤
│  Toplam Harcama: ₺2,450        │
│  Geçen Hafta:    ₺2,180 (+12%) │
├─────────────────────────────────┤
│  🍽️ ████████░░ ₺850 (35%)      │
│  🚗 █████░░░░░ ₺420 (17%)      │
│  🎬 ████░░░░░░ ₺350 (14%)      │
│  📄 ██████░░░░ ₺530 (22%)      │
│  ➕ ███░░░░░░░ ₺300 (12%)      │
├─────────────────────────────────┤
│  💡 "Yemek harcaman %15 arttı. │
│      Evde yemek deneyebilirsin" │
├─────────────────────────────────┤
│       [Detaylı Rapor (Premium)] │
└─────────────────────────────────┘
```

### 🔧 TEKNİK UYGULAMA

**Cron Job (Vercel Cron):**
```typescript
// src/app/api/cron/weekly-report/route.ts

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    // Get all users with expenses this week
    const users = await getActiveUsers();
    
    for (const user of users) {
        const report = await generateWeeklyReport(user.id);
        await sendReportEmail(user.email, report);
        await createInAppNotification(user.id, report);
    }
    
    return Response.json({ success: true });
}
```

**Vercel.json:**
```json
{
    "crons": [{
        "path": "/api/cron/weekly-report",
        "schedule": "0 10 * * 0"  // Her Pazar 10:00
    }]
}
```

**E-posta Template (React Email):**
```tsx
// src/emails/WeeklyReport.tsx
import { Html, Head, Body, Container, Section } from '@react-email/components';

export function WeeklyReportEmail({ data }) {
    return (
        <Html>
            <Body style={{ backgroundColor: '#0F1117' }}>
                <Container>
                    <Section>
                        <h1>Haftalık Para Raporun 📊</h1>
                        <p>Bu hafta ₺{data.totalSpent} harcadın.</p>
                        {/* Grafik görsel olarak */}
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
```

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| In-app rapor | E-posta rapor |
| Son 4 hafta | Tüm geçmiş |
| Basit özet | Detaylı analiz |
| - | PDF indirme |
| - | Trend grafikleri |

### 🧠 PSİKOLOJİK TETİKLEYİCİLER
- **Anticipation:** "Pazar günü raporun hazır"
- **Progress tracking:** Geçen haftayla karşılaştırma
- **Gamification:** "Bu hafta %8 tasarruf ettin! 🎉"

---

## 4️⃣ PUSH BİLDİRİMLER (P2)

### 📱 BİLDİRİM TÜRLERİ

| Tür | Tetikleyici | Mesaj Örneği |
|-----|------------|--------------|
| Daily Reminder | Her gün 20:00 | "Bugün harcama girdin mi? 📝" |
| Budget Warning | Günlük limit %80 | "Bugünkü bütçenin %80'i doldu ⚠️" |
| Critical Alert | Kritik gün yaklaştığında | "3 gün sonra kritik bölge başlıyor 🔴" |
| Savings Win | Bütçe altında kalındığında | "Bugün ₺45 tasarruf ettin! 🎉" |
| Streak | Ardışık gün | "5 gün üst üste bütçende kaldın! 🔥" |

### 🔧 TEKNİK UYGULAMA

**Web Push Setup:**
```typescript
// src/lib/push-notifications.ts

export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) return null;
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });
    
    // Save subscription to database
    await saveSubscription(subscription);
    return subscription;
}
```

**Service Worker:**
```javascript
// public/sw.js

self.addEventListener('push', (event) => {
    const data = event.data.json();
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/notification-icon.png',
            badge: '/icons/badge.png',
            data: { url: data.url }
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
```

**Notification Scheduler API:**
```typescript
// src/app/api/notifications/schedule/route.ts

export async function POST(request: Request) {
    const { userId, type, scheduledFor, data } = await request.json();
    
    await supabase
        .from('scheduled_notifications')
        .insert({
            user_id: userId,
            type,
            scheduled_for: scheduledFor,
            data
        });
    
    return Response.json({ success: true });
}
```

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| Critical alerts only | Tüm bildirimler |
| 1 reminder/gün | Özelleştirilebilir |
| - | Quiet hours |
| - | Kanal seçimi (email/push) |

### 🧠 PSİKOLOJİK TETİKLEYİCİLER
- **Fear of missing out:** "Bugün girmeyi unuttun!"
- **Positive reinforcement:** "Harika! Bugün bütçende kaldın"
- **Urgency:** "3 gün sonra kritik..."

---

## 5️⃣ AI TAVSİYE MODÜLÜ v2 (P3)

### 📱 UX AKIŞI
```
[Hesaplama sonucu]
    ↓
[AI Koç Kartı]
    → Kişiselleştirilmiş öneri
    → "Sana özel" hissi
    → Actionable tavsiye
    ↓
[Opsiyonel: Daha fazla öneri (Premium)]
```

### 🎨 TAVSİYE ÖRNEKLERİ

**Kritik Durumda:**
```
🤖 "Mevcut temponda 8 günün kaldı. 
    Günlük harcamanı ₺50 azaltırsan 12 gün daha kazanırsın.
    Önerim: Bu hafta dışarıda yemek yerine evde ye."
```

**İyi Durumda:**
```
🤖 "Harika gidiyorsun! Bu tempoda 25 gün rahat.
    Ek öneri: Günde ₺30'u tasarruf hesabına ayırabilirsin.
    Ayda ₺900 birikir."
```

**Trend Bazlı:**
```
🤖 "Son 2 haftada kahve harcaman %40 arttı.
    Haftada 2 kahveyi evde yapsan ayda ₺200 tasarruf edersin."
```

### 🔧 TEKNİK UYGULAMA

**OpenAI Integration (Opsiyonel):**
```typescript
// src/lib/ai-coach.ts

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateAdvice(context: UserFinanceContext): Promise<string> {
    const prompt = `
        Kullanıcı durumu:
        - Günlük harcama: ₺${context.dailySpending}
        - Kalan gün: ${context.daysRemaining}
        - Risk seviyesi: ${context.riskLevel}
        - En yüksek kategori: ${context.topCategory}
        
        Kısa, destekleyici, Türkçe bir finansal tavsiye ver.
        Spesifik rakamlar kullan. 1-2 cümle.
    `;
    
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
    });
    
    return response.choices[0].message.content;
}
```

**Rule-based Alternative (OpenAI olmadan):**
```typescript
// src/lib/advice-engine.ts

export function generateAdvice(context: FinanceContext): Advice[] {
    const rules: AdviceRule[] = [
        {
            condition: (c) => c.riskLevel === 'critical',
            message: (c) => `Günlük harcamanı ₺${c.savingsNeeded} azaltırsan risk ortadan kalkar.`,
            priority: 1
        },
        {
            condition: (c) => c.topCategory === 'food' && c.foodRatio > 0.4,
            message: (c) => `Yemek harcaman bütçenin %${Math.round(c.foodRatio * 100)}'i. Evde yemek deneyebilirsin.`,
            priority: 2
        },
        // ... more rules
    ];
    
    return rules
        .filter(r => r.condition(context))
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 3)
        .map(r => ({ text: r.message(context) }));
}
```

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| 1 genel tavsiye | 3+ kişisel tavsiye |
| Rule-based | AI destekli |
| - | Kategori bazlı |
| - | Trend analizi |

---

## 6️⃣ GELİŞMİŞ AİLE MODU (P3)

### 📱 UX AKIŞI
```
[Ayarlar]
    ↓
[Aile Üyeleri Ekle]
    → İsim, emoji seçimi
    → Opsiyonel: Bireysel bütçe
    ↓
[Harcama Eklerken]
    → "Kim harcadı?" seçimi
    ↓
[Rapor]
    → Kişi bazlı breakdown
```

### 🎨 GÖRSEL YERLEŞİM
```
AİLE BÜTÇESİ
┌─────────────────────────────────┐
│  👨 Yağız      │  👩 Ayşe       │
│  ₺1,200       │  ₺980         │
│  █████████░   │  ███████░░░   │
├───────────────┴─────────────────┤
│  👧 Elif (paylaşımlı)           │
│  ₺450                          │
├─────────────────────────────────┤
│  Toplam: ₺2,630 / ₺4,000       │
│  ████████████░░░░░░░░          │
└─────────────────────────────────┘
```

### 🔧 TEKNİK UYGULAMA

**Veritabanı:**
```sql
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) DEFAULT '👤',
    personal_budget DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_expenses ADD COLUMN member_id UUID REFERENCES family_members(id);
```

### 💎 FREEMIUM/PREMIUM

| Ücretsiz | Premium |
|----------|---------|
| 2 kişi | 5 kişi |
| Toplam görünüm | Bireysel raporlar |
| - | Bireysel bütçeler |
| - | Üye karşılaştırma |

---

## 7️⃣ PREMIUM STRATEJİSİ

### 💰 FİYATLANDIRMA

| Paket | Fiyat | İçerik |
|-------|-------|--------|
| **Free** | ₺0 | Temel hesaplama, 3 kullanım/ay |
| **Para Koçu** | ₺49.99/ay | Tüm özellikler, email rapor |
| **Para Koçu Pro** | ₺99.99/ay | AI tavsiyeler, aile modu, API |
| **PopLift Growth + Para Koçu** | ₺299/ay | Full bundle |

### 🎯 DÖNÜŞÜM HUNIS

```
[Ücretsiz Kullanıcı]
    ↓ 3 hesaplama kullandı
[Soft Paywall]
    → "Daha fazla hesaplama ister misin?"
    → Kilitli donut chart göster
    ↓ İlgi gösterdi
[Trial Offer]
    → "7 gün ücretsiz dene"
    ↓ Trial başladı
[Value Delivery]
    → AI tavsiyeleri, raporlar, grafikler
    ↓ Trial bitti
[Conversion]
    → "₺49.99 ile devam et"
```

### 🧠 PSİKOLOJİK TETİKLEYİCİLER

| Teknik | Uygulama |
|--------|----------|
| **Scarcity** | "Bu ay 3 hesaplama hakkın kaldı" |
| **Social Proof** | "1,247 kişi bu hafta premium'a geçti" |
| **Loss Aversion** | "Raporlarını kaybetmemek için..." |
| **Anchoring** | "Günlük ₺1.66 - Bir kahveden az" |
| **Reciprocity** | Ücretsiz değer verdikten sonra sor |
| **FOMO** | "Premium kullanıcılar ortalama ₺847 tasarruf etti" |

### 🚫 YAPILMAMASI GEREKENLER
- ❌ Agresif pop-up'lar
- ❌ Temel özellikleri kısıtlama
- ❌ Gizli ücretler
- ❌ İptal etmeyi zorlaştırma

---

## 📅 UYGULAMA TAKVİMİ

### Hafta 1-2: P1 Özellikleri
- [ ] Dashboard widget entegrasyonu
- [ ] Günlük harcama ekleme modülü
- [ ] localStorage → Supabase migration

### Hafta 3-4: P2 Özellikleri
- [ ] Haftalık rapor sistemi
- [ ] Push notification altyapısı
- [ ] Service worker setup

### Hafta 5-6: P3 Özellikleri
- [ ] AI tavsiye modülü v2
- [ ] Gelişmiş aile modu
- [ ] Trend grafikleri

### Hafta 7-8: Polish & Launch
- [ ] Premium stripe entegrasyonu
- [ ] Onboarding flow
- [ ] A/B testleri

---

## 🔧 TEKNİK STACK ÖNERİSİ

| Alan | Teknoloji |
|------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **State** | Zustand + React Query |
| **Database** | Supabase (PostgreSQL) |
| **Charts** | Recharts veya Chart.js |
| **Push** | Web Push API + Supabase Edge Functions |
| **Email** | Resend + React Email |
| **AI** | OpenAI API (opsiyonel) |
| **Analytics** | Mixpanel veya PostHog |
| **Payment** | Stripe veya iyzico |

---

## ✅ SONUÇ

Bu roadmap ile Para Koçu:
- **Hesaplayıcı** → **Günlük finans asistanı** olacak
- **Tek seferlik kullanım** → **Günlük alışkanlık** olacak
- **Free-only** → **Sağlıklı Premium dönüşüm** olacak

Öncelik sırası:
1. 🔥 Dashboard widget + Günlük harcama (hemen)
2. 📊 Haftalık rapor + Push (2 hafta sonra)
3. 🤖 AI v2 + Aile modu (1 ay sonra)

---

**Hazırlayan:** AI Product Strategist  
**Onay Bekliyor:** Product Owner
