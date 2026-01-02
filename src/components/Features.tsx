import React from 'react';
import { Zap, Brain, BarChart3, Shield, Palette, Code, Disc3, Calculator, Mail } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Brain size={28} className="text-purple-400" />,
            title: "Akıllı Tetikleyici",
            desc: "Fare hareketi, scroll derinliği ve sayfa süresini analiz ederek en uygun anı yakalar.",
            benefit: "→ Gereksiz pop-up rahatsızlığı yok, sadece çıkacak olanları hedefler"
        },
        {
            icon: <Zap size={28} className="text-yellow-400" />,
            title: "Anında Kurulum",
            desc: "Tek satır JavaScript kodu ile tüm sitelerde çalışır. WordPress, Shopify, custom - hepsi.",
            benefit: "→ Teknik bilgi gerekmez, 3 dakikada aktif"
        },
        {
            icon: <BarChart3 size={28} className="text-emerald-400" />,
            title: "Canlı Dashboard",
            desc: "Hangi pop-up kaç kez gösterildi, kaç kişi tıkladı, kaç satış oluştu - gerçek zamanlı izle.",
            benefit: "→ Veriye dayalı karar ver, tahmine değil"
        },
        {
            icon: <Disc3 size={28} className="text-rose-400" />,
            title: "Gamification (Çarkıfelek)",
            desc: "Ziyaretçilere şans çarkı çevirterek e-posta toplama oranını %15'ten %35'e çıkarın. Sıkıcı pop-up'lar yerine oyunlaştırılmış deneyim.",
            benefit: "→ 2 kat fazla e-posta, eğlenceli kullanıcı deneyimi",
            badge: "PRO"
        },
        {
            icon: <Calculator size={28} className="text-cyan-400" />,
            title: "Net Kâr & ROI Hesaplayıcı",
            desc: "Sadece ciroyu değil, net kârınızı görün. Ürün maliyeti ve reklam harcamasını girin, Poplift size gerçek kazancınızı hesaplasın.",
            benefit: "→ Gerçek karlılık analizi, şeffaf finansal görünüm",
            badge: "GROWTH"
        },
        {
            icon: <Mail size={28} className="text-indigo-400" />,
            title: "Otomatik E-Posta",
            desc: "Yakaladığınız müşteriye anında 'Hoş geldin' veya 'İndirim Kuponu' mailini otomatik gönderin. Ekstra mail servisine gerek yok.",
            benefit: "→ Anında müşteri bağlılığı, manuel iş yükü sıfır",
            badge: "PRO"
        },
        {
            icon: <Palette size={28} className="text-pink-400" />,
            title: "Sınırsız Özelleştirme",
            desc: "Marka renklerin, kendi metinlerin, istediğin butonlar. Hazır şablonlar veya sıfırdan tasarla.",
            benefit: "→ Sitenin kimliğine uyar, yabancı durmaz"
        },
        {
            icon: <Shield size={28} className="text-blue-400" />,
            title: "GDPR & KVKK Uyumlu",
            desc: "Kullanıcı verisi toplamıyoruz, sadece davranış analizi. Çerez yok, gizlilik garantili.",
            benefit: "→ Yasal risk sıfır, müşteri güveni tam"
        },
        {
            icon: <Code size={28} className="text-brand-orange" />,
            title: "Performans Dostu",
            desc: "8kb hafif kod, CDN üzerinden yüklenir. Google PageSpeed skorunuzu etkilemez.",
            benefit: "→ Hızlı site = daha fazla dönüşüm"
        }
    ];

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Özellikler</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Neden Rakiplerden Farklıyız?
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Sadece pop-up göstermiyoruz. Müşteri davranışını anlayıp doğru anda doğru teklifi sunuyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-8 hover:border-brand-orange/30 transition-all hover:-translate-y-1 group relative ${feature.badge === 'GROWTH' ? 'border-cyan-500/30' : feature.badge === 'PRO' ? 'border-rose-500/30' : 'border-white/10'
                                }`}
                        >
                            {feature.badge && (
                                <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-black ${feature.badge === 'GROWTH'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    }`}>
                                    {feature.badge}
                                </div>
                            )}
                            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-4">{feature.desc}</p>
                            <p className="text-xs text-brand-orange/80 leading-relaxed italic">{feature.benefit}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
