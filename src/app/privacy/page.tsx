"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Calendar, Mail } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 mt-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6">
                        <Shield size={16} />
                        <span className="text-sm">Gizlilik Politikası</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Gizlilik Politikası
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} />
                            Son Güncelleme: 31 Aralık 2024
                        </span>
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Giriş</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Poplift Teknoloji A.Ş. ("Poplift", "biz" veya "şirket") olarak, kişisel verilerinizin gizliliğini
                            korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, web sitemiz ve hizmetlerimiz aracılığıyla
                            topladığımız kişisel bilgilerin nasıl toplandığını, kullanıldığını, paylaşıldığını ve korunduğunu açıklamaktadır.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Topladığımız Bilgiler</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>İsim ve e-posta adresi</li>
                            <li>Şirket bilgileri</li>
                            <li>Ödeme bilgileri (kredi kartı numaraları şifrelenir ve saklanmaz)</li>
                            <li>Web sitesi kullanım verileri (çerezler aracılığıyla)</li>
                            <li>IP adresi ve cihaz bilgileri</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Bilgilerin Kullanımı</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Topladığımız bilgileri şu amaçlarla kullanırız:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Hizmetlerimizi sunmak ve yönetmek</li>
                            <li>Hesabınızı oluşturmak ve korumak</li>
                            <li>Müşteri desteği sağlamak</li>
                            <li>Hizmetlerimizi geliştirmek</li>
                            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Bilgi Güvenliği</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz.
                            Tüm veriler SSL/TLS şifreleme ile korunmaktadır. Ancak, internet üzerinden hiçbir veri
                            iletimi veya elektronik depolama yöntemi %100 güvenli değildir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Üçüncü Taraflarla Paylaşım</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Kişisel bilgilerinizi, yasal zorunluluklar dışında, onayınız olmadan üçüncü taraflarla
                            paylaşmıyoruz. Hizmet sağlayıcılarımız (ödeme işlemcileri, hosting sağlayıcıları)
                            yalnızca hizmetlerini sunmak için gerekli verilere erişebilir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Haklarınız</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            KVKK kapsamında aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenen verilere erişim talep etme</li>
                            <li>Verilerin düzeltilmesini isteme</li>
                            <li>Verilerin silinmesini veya yok edilmesini isteme</li>
                            <li>İşleme itiraz etme</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">7. İletişim</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Bu Gizlilik Politikası hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
                        </p>
                        <div className="flex items-center gap-3 text-brand-orange">
                            <Mail size={18} />
                            <a href="mailto:hello@Poplift.com" className="hover:underline">hello@Poplift.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
