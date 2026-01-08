import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '700', '900'], // Including 900 for that ultra-bold look
});

export const metadata: Metadata = {
  title: "Poplift | Akıllı Pop-up ve Sepet Terk Önleme Yazılımı | %27 Dönüşüm Artışı",
  description: "Poplift ile ziyaretçilerinizi müşteriye dönüştürün. Akıllı çıkış niyeti (exit-intent) teknolojisi, sepet kurtarma pop-up'ları ve e-posta toplama araçları. 3 dakikada kurulum, kodlama gerekmez. 500+ mağaza güveniyor.",
  keywords: [
    "Poplift",
    "Poplift app",
    "pop-up oluşturucu",
    "sepet terk önleme",
    "e-ticaret dönüşüm",
    "exit intent popup",
    "akıllı popup",
    "satış artırma",
    "lead generation",
    "Shopify popup",
    "WordPress popup",
    "e-ticaret popup",
    "conversion optimization",
    "dönüşüm optimizasyonu",
    "çarkıfelek popup",
    "gamification popup"
  ],
  authors: [{ name: "Poplift Team" }],
  creator: "Poplift",
  publisher: "Poplift",
  metadataBase: new URL('https://poplift.vercel.app'),
  openGraph: {
    title: "Poplift - %27 Daha Fazla Satış Yapın | Akıllı Pop-up Platformu",
    description: "Sitenizden alışveriş yapmadan gidenleri durdurun. Exit-intent teknolojisi ile sepet terklerini önleyin. 500+ mağaza güveniyor. 3 dakikada kurulum.",
    url: 'https://poplift.vercel.app',
    siteName: 'Poplift',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Poplift - Akıllı Pop-up Platformu'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poplift - %27 Daha Fazla Satış Yapın',
    description: 'Akıllı pop-up\'larla sepet terklerini önleyin. 3 dakikada kurulum.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "L0bnzqihLybAnnY85VERKwFhL_RAnJpAhGookpGsWLk"
  },
  alternates: {
    canonical: 'https://poplift.vercel.app'
  }
};

import { Toaster } from 'sonner';

import InfoButton from '@/components/InfoButton';
import QuickActionsButton from '@/components/QuickActionsButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-cream-50 text-coffee-900 overflow-x-hidden`}>
        {children}
        <Toaster position="top-center" richColors theme="dark" />
        <InfoButton />
        <QuickActionsButton />
      </body>
    </html>
  );
}

