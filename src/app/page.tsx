import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotificationStack from '@/components/NotificationStack';
import Testimonials from '@/components/Testimonials';
import ProblemSolution from '@/components/ProblemSolution';
import ROICalculator from '@/components/ROICalculator';
import ComparisonTable from '@/components/ComparisonTable';
import FAQ from '@/components/FAQ';
import FAQSection from '@/components/FAQSection';
import TrustBadges from '@/components/TrustBadges';
import BrandLogos from '@/components/BrandLogos';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import TemplateShowcase from '@/components/TemplateShowcase';
import LiveSocialProof from '@/components/LiveSocialProof';
import InteractiveDemo from '@/components/InteractiveDemo';
import { ArrowRight, Check, Zap, MousePointer2, Sparkles, Building2, ShieldCheck, Mail, Target, Rocket, Clock, Lock } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden selection:bg-brand-orange/30">
      <Navbar />
      <NotificationStack />
      <LiveSocialProof />

      {/* 1️⃣ HERO SECTION (EN KRİTİK) */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6 drop-shadow-xl">
            Terk Eden Ziyaretçileri Son Anda Yakala,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-200">
              %27 Daha Fazla Satış Yap
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Sitenizi terk etmek üzere olan ziyaretçilere akıllı pop-up'larla ulaşın. <span className="text-white font-bold">Tek satır kodla 3 dakikada kurulum, ilk sonuçlar bugün.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link href="/register" className="btn-primary py-4 px-12 text-xl shadow-[0_6px_0_0_#D97706] hover:translate-y-[1px] hover:shadow-[0_4px_0_0_#D97706] group flex items-center gap-3 justify-center">
              Ücretsiz Dene
              <span className="text-xs opacity-70 font-medium ml-2">Kredi kartı gerekmez</span>
            </Link>
            <Link href="/demo" className="btn-secondary py-4 px-12 text-xl flex items-center gap-2 justify-center border-white/20 hover:bg-white/10">
              Canlı Demo İzle <ArrowRight size={20} className="opacity-50" />
            </Link>
          </div>

          {/* 2️⃣ ANINDA GÜVEN VEREN SOSYAL KANIT */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-y border-white/5 py-8 w-full max-w-4xl opacity-80">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">500+</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aktif Mağaza</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-brand-orange">%27+</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dönüşüm Artışı</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">3 Dakika</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kurulum</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-400">₺150K+</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kurtarılan Gelir/Ay</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🏢 TRUSTED BY - MARKA GÜVENİ */}
      <BrandLogos />

      {/* 📍 NASIL ÇALIŞIR */}
      <HowItWorks />

      {/* 3️⃣ PROBLEM BÖLÜMÜ - %93 İSTATİSTİĞİ */}
      <ProblemSolution />

      {/* ⚡ ÖZELLİKLER */}
      <Features />

      {/* 4️⃣ NEDEN POPWISEE? (FARK BÖLÜMÜ) */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Neden Poplift?</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Karmaşık Rakiplerin Aksine <br /> Hafif, Akıllı ve Sonuç Odaklı</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="text-yellow-400" />,
                title: "Sıfır Yavaşlama",
                desc: "Sadece 8kb boyutuyla sitenizin PageSpeed skorunu etkilemez, anında yüklenir."
              },
              {
                icon: <Target className="text-brand-orange" />,
                title: "Exit-Intent 2.0",
                desc: "Sadece mouse hareketini değil, ziyaretçinin davranışsal psikolojisini analiz eder."
              },
              {
                icon: <ShieldCheck className="text-emerald-400" />,
                title: "Türkçe Destek",
                desc: "Global araçların aksine Türkiye pazarını ve yerel e-ticaret dinamiklerini bilir."
              },
              {
                icon: <Rocket className="text-blue-400" />,
                title: "Fiyat Avantajı",
                desc: "Aylık yüksek abonelikler yerine, büyüyen işletmelere uygun şeffaf fiyatlandırma."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/20 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 shadow-lg">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ CANLI DEMO'YU SATIŞA BAĞLA (Customized Section) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-brand-orange to-amber-600 p-1 md:p-1.5 shadow-2xl">
          <div className="bg-[#000212] rounded-[22px] p-8 md:p-12 flex flex-col items-center text-center">
            <Sparkles className="text-brand-orange mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Bu Teknolojiyi Kendi Sitenizde <br /> Görmek İster misiniz?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl">
              Demo sayfamızda gördüğünüz tüm akıllı özellikleri tek bir satır kodla kendi sitenizde aktifleştirebilirsiniz.
            </p>
            <Link href="/register" className="btn-primary py-4 px-12 text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
              Aynısını Kur
            </Link>
          </div>
        </div>
      </section>

      {/* 5️⃣ KULLANIM SENARYOLARI */}
      <section className="py-24 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-16">
            <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Kullanım Senaryoları</p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Tek Platform<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">Sınırsız Senaryo</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              E-ticaretten eğitime, mail listesinden kampanyaya - her ihtiyaca özel çözüm
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sol: Senaryo Kartları */}
            <div className="space-y-4">
              {[
                {
                  icon: <Zap size={24} className="text-yellow-400" />,
                  title: "E-Ticaret Dönüşümü",
                  desc: "Sepeti terk edenlere özel kuponlar sunarak %15 ek ciro yaratın.",
                  badge: "En Popüler",
                  badgeColor: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                },
                {
                  icon: <Mail size={24} className="text-blue-400" />,
                  title: "E-Posta Listesi Büyütme",
                  desc: "Ziyaretçileri rahatsız etmeden en doğru anda mail listenize katın.",
                  badge: "Lead Gen",
                  badgeColor: "bg-blue-400/10 text-blue-400 border-blue-400/20"
                },
                {
                  icon: <MousePointer2 size={24} className="text-purple-400" />,
                  title: "Exit-Intent (Çıkış Anı)",
                  desc: "Siteden tam çıkacakken son şans teklifi yaparak satışı kurtarın.",
                  badge: "Yüksek ROI",
                  badgeColor: "bg-purple-400/10 text-purple-400 border-purple-400/20"
                },
                {
                  icon: <Sparkles size={24} className="text-pink-400" />,
                  title: "Kampanya Duyuru",
                  desc: "Yeni ürün veya indirimleri en yüksek görünürlükle tüm siteye duyurun.",
                  badge: "Announcement",
                  badgeColor: "bg-pink-400/10 text-pink-400 border-pink-400/20"
                }
              ].map((scenario, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-all hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Badge */}
                  <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold border ${scenario.badgeColor}`}>
                    {scenario.badge}
                  </div>

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {scenario.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2 group-hover:text-brand-orange transition-colors">
                        {scenario.title}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {scenario.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ: Pop-up Preview */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-amber-400/20 blur-3xl opacity-50" />

              {/* Container */}
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-3xl border border-white/10 p-4 shadow-2xl backdrop-blur-sm">
                {/* Browser mockup header */}
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 h-6 bg-white/5 rounded-lg flex items-center px-3">
                    <span className="text-[10px] text-slate-500">yoursite.com</span>
                  </div>
                </div>

                {/* Pop-up preview */}
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0B14] to-[#1a1b2e] flex items-center justify-center p-8">
                  {/* Pop-up card */}
                  <div className="relative w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Badge */}
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-brand-orange to-amber-500 text-white text-xs font-black rounded-full mb-4 uppercase">
                      Poplift Özel
                    </div>

                    {/* Title */}
                    <h4 className="text-2xl font-black text-slate-900 mb-3 leading-tight">
                      Gitmeden Önce Bak! 🎁
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Şu an sepete eklersen <span className="font-bold text-slate-900">%15 anlık indirim</span> senin olur.
                    </p>

                    {/* Promo code */}
                    <div className="bg-slate-100 rounded-xl p-4 mb-6 border-2 border-dashed border-slate-300">
                      <div className="text-xs text-slate-500 mb-1">Kupon Kodu:</div>
                      <div className="text-2xl font-black text-brand-orange tracking-wider">SAVE15</div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-brand-orange hover:to-amber-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                      İndirimi Kullan →
                    </button>

                    {/* Close button */}
                    <button className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
                      <span className="text-slate-600 text-lg">×</span>
                    </button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-brand-orange/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 right-4 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">%27</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Dönüşüm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-brand-orange">0.3s</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Tepki Süresi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400">%0</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Rahatsızlık</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ ROI HESAPLAYICI */}
      <ROICalculator />

      {/* 7️⃣ RAKIPLERDEN FARKIMIZ */}
      <ComparisonTable />

      {/* 8️⃣ GÜÇLÜ SOSYAL KANIT (DETAY) */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Poplift Gerçekten İşliyor mu?</h2>
            <p className="text-slate-400">Rakamlarla konuşan bazı mutlu kullanıcılarımız:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "Elif K.", r: "E-Ticaret Sahibi", q: "İlk hafta sepet terkleri %18 düştü. Reklam harcamam aynı ama gelir arttı. Poplift kurulumu 5 dakika sürdü, sonuçlar ilk gün başladı.", s: "₺12.000/ay ek gelir" },
              { n: "Burak Y.", r: "Dijital Ajans Kurucusu", q: "Müşterilerimize kuruyoruz. Özellikle e-ticarette çok işe yarıyor. Exit-intent sadece exit değil, doğru zamanlama yapıyor.", s: "%31 dönüşüm artışı" },
              { n: "Zeynep A.", r: "Online Eğitim Platformu", q: "Mail listesi büyütmek için kullanıyoruz. Hazır şablonlar kullanışlı, özelleştirme de kolay. İlk ayda 2.100 yeni abone.", s: "+2.100 abone" }
            ].map((t, i) => (
              <div key={i} className="bg-[#0A0B14] p-8 rounded-2xl border border-white/5 relative">
                <div className="text-brand-orange font-black text-4xl absolute top-4 right-8 opacity-20">"</div>
                <div className="text-sm font-bold text-emerald-400 mb-4 bg-emerald-400/10 inline-block px-3 py-1 rounded-full">{t.s}</div>
                <p className="text-slate-300 text-sm leading-relaxed italic mb-8">"{t.q}"</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
                  <div>
                    <p className="font-bold text-white text-sm">{t.n}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9️⃣ ŞABLON GALERİSİ (YENİ) */}
      <TemplateShowcase />

      {/* 💰 FİYATLANDIRMA (Ekstra Güç Katın dahil) */}
      <Pricing />

      {/* 🔟 SSS - KULLANICI İTİRAZLARI */}
      <FAQSection />

      {/* 1️⃣1️⃣ 3 ADIMDA BAŞLA REHBERİ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-4">Hızlı Kurulum</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Sadece 3 Dakika: Kopyala, Yapıştır, Kazanmaya Başla</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Kodlama bilmenize gerek yok. Tek bir satır kodu sitenize ekleyin; hazır şablonlarımızdan birini seçin ve ilk satışınızı bugün yakalayın.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <MousePointer2 size={24} className="text-brand-orange" />,
                title: "Şablonu Seç",
                desc: "50+ hazır kampanya şablonundan birini seç. E-ticaret, mail listesi, indirim kodu - hepsi hazır."
              },
              {
                step: "2",
                icon: <Sparkles size={24} className="text-yellow-400" />,
                title: "Tek Satır Kod",
                desc: "Kopyala-yapıştır. Wordpress, Shopify, custom site - her şeyde çalışır. Yavaşlatmaz."
              },
              {
                step: "3",
                icon: <Rocket size={24} className="text-emerald-400" />,
                title: "İlk Satışı Yap",
                desc: "İlk gün aktif. Dashboard'dan canlı satışları izle ve optimize et."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-brand-orange/30 transition-all group">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary py-4 px-10 inline-flex items-center gap-2 text-lg shadow-xl hover:scale-105 transition-all">
              İlk Satışı Hemen Yakala <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 🔟 RİSKİ SIFIRLAYAN KAPANIŞ */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-brand-orange text-xs font-bold mb-8 uppercase tracking-widest leading-none">
          Son Şans
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
          Satış Kaybını Bugün Durdurun.
        </h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
          Şu an okuduğunuz her dakika, sitenizden satın almadan çıkan %93'ü kaybetmeye devam ediyorsunuz. <span className="text-white font-bold">Kredi kartı istemiyoruz. Kurulum 3 dakika. İstediğiniz zaman iptal edebilirsiniz.</span>
        </p>
        <div className="flex flex-col items-center">
          <Link href="/register" className="btn-primary inline-flex text-2xl px-16 py-5 shadow-2xl shadow-brand-orange/30 hover:scale-105 active:scale-95 transition-all">
            Kaybettiğin Satışları Geri Al 👉
          </Link>
          <div className="mt-8 flex gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Kredi Kartı Yok</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> 3 Dakika Kurulum</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> İlk Satış Bugün</span>
          </div>

          {/* TRUST BADGES */}
          <div className="mt-8">
            <TrustBadges />
          </div>
        </div>
      </section>

      {/* 🎮 ETKİLEŞİMLİ DEMO */}
      <InteractiveDemo />

      {/* 🔐 GİZLİLİK VE GÜVEN */}
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock size={24} className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Gizlilik ve Güven Taahhüdü</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-emerald-400">✓</span>
              <p className="text-slate-400 mt-2">Kullanıcı verileri şifrelenerek saklanır, üçüncü kişilerle paylaşılmaz.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-emerald-400">✓</span>
              <p className="text-slate-400 mt-2">KVKK ve GDPR uyumlu altyapı. Verileriniz Türkiye'de güvende.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-emerald-400">✓</span>
              <p className="text-slate-400 mt-2">İstediğiniz zaman hesabınızı ve tüm verilerinizi silebilirsiniz.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
