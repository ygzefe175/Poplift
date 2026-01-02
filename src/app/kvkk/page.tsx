"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Calendar, Mail, Building } from 'lucide-react';

export default function KVKKPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 mt-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold mb-6">
                        <Lock size={16} />
                        <span className="text-sm">KVKK Aydınlatma Metni</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        KVKK Aydınlatma Metni
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} />
                            Son Güncelleme: 31 Aralık 2024
                        </span>
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-8 mb-8">
                        <div className="flex items-start gap-4">
                            <Building className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Veri Sorumlusu</h3>
                                <p className="text-slate-400">
                                    <strong className="text-white">Poplift Teknoloji A.Ş.</strong><br />
                                    Maslak, Sarıyer / İstanbul<br />
                                    hello@Poplift.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Amaç</h2>
                        <p className="text-slate-400 leading-relaxed">
                            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, Poplift Teknoloji A.Ş.
                            olarak kişisel verilerinizin işlenmesine ilişkin sizleri bilgilendirmek amacıyla bu
                            aydınlatma metnini hazırladık.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">2. İşlenen Kişisel Veriler</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Şirketimiz tarafından aşağıdaki kişisel veri kategorileri işlenmektedir:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-white font-bold mb-2">Kimlik Bilgileri</h4>
                                <p className="text-slate-500 text-sm">Ad, soyad</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-white font-bold mb-2">İletişim Bilgileri</h4>
                                <p className="text-slate-500 text-sm">E-posta adresi, telefon</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-white font-bold mb-2">Finansal Bilgiler</h4>
                                <p className="text-slate-500 text-sm">Ödeme bilgileri, fatura adresi</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-white font-bold mb-2">Dijital Kayıtlar</h4>
                                <p className="text-slate-500 text-sm">IP adresi, çerez verileri</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">3. İşleme Amaçları</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Hizmetlerimizin sunulması ve yürütülmesi</li>
                            <li>Sözleşme süreçlerinin yönetimi</li>
                            <li>Müşteri ilişkileri yönetimi</li>
                            <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                            <li>Güvenlik ve dolandırıcılığı önleme</li>
                            <li>Hizmet kalitesinin iyileştirilmesi</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Hukuki Sebepler</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            KVKK'nın 5. ve 6. maddelerinde yer alan hukuki sebeplere dayanarak işlenmektedir:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Açık rızanızın bulunması</li>
                            <li>Sözleşmenin ifası için gerekli olması</li>
                            <li>Hukuki yükümlülüğümüzün yerine getirilmesi</li>
                            <li>Meşru menfaatlerimiz için zorunlu olması</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Veri Aktarımı</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Kişisel verileriniz, hizmet sağlayıcılarımız (hosting, ödeme işlemcileri), yasal otoriteler
                            ve iş ortaklarımız ile KVKK'nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak
                            paylaşılabilir. Yurt dışına veri aktarımı, açık rızanız alınarak gerçekleştirilir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Haklarınız (KVKK Madde 11)</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                            <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                            <li>Eksik veya yanlış işlenmesi halinde düzeltilmesini isteme</li>
                            <li>KVKK'da öngörülen şartlarda silinmesini veya yok edilmesini isteme</li>
                            <li>Düzeltme, silme veya yok edilmesinin üçüncü kişilere bildirilmesini isteme</li>
                            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi
                                suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                            <li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız halinde tazminat talep etme</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">7. Başvuru</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Haklarınızı kullanmak için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:
                        </p>
                        <div className="flex items-center gap-3 text-brand-orange">
                            <Mail size={18} />
                            <a href="mailto:kvkk@Poplift.com" className="hover:underline">kvkk@Poplift.com</a>
                        </div>
                        <p className="text-slate-500 text-sm mt-4">
                            Başvurularınız en geç 30 gün içinde ücretsiz olarak yanıtlanacaktır.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
