"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Calendar, Mail } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 mt-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-6">
                        <FileText size={16} />
                        <span className="text-sm">Kullanım Şartları</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Kullanım Şartları
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
                        <h2 className="text-2xl font-bold text-white mb-4">1. Hizmet Şartları</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Poplift Teknoloji A.Ş. ("Poplift") tarafından sunulan hizmetleri kullanarak, bu Kullanım
                            Şartları'nı kabul etmiş olursunuz. Hizmetlerimizi kullanmaya devam etmeniz, bu şartlara
                            bağlı kalmayı kabul ettiğiniz anlamına gelir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Hesap Oluşturma</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Hizmetlerimizi kullanabilmek için bir hesap oluşturmanız gerekmektedir:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>18 yaşından büyük olmalısınız</li>
                            <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                            <li>Hesap güvenliğinizden siz sorumlusunuz</li>
                            <li>Hesabınızı başkalarıyla paylaşamazsınız</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Kabul Edilebilir Kullanım</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Hizmetlerimizi kullanırken aşağıdaki kurallara uymalısınız:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Yasalara ve düzenlemelere uygun hareket etmek</li>
                            <li>Spam veya yanıltıcı içerik göndermemek</li>
                            <li>Sistemlerimize zarar vermemek</li>
                            <li>Diğer kullanıcıların haklarına saygı göstermek</li>
                            <li>Fikri mülkiyet haklarını ihlal etmemek</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Ödeme ve Faturalama</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Ücretli planlar için geçerli bir ödeme yöntemi sağlamalısınız. Tüm ücretler fatura
                            döneminin başında tahsil edilir. İptal işlemleri, bir sonraki fatura döneminden önce
                            yapılmalıdır. 14 günlük para iade garantisi sunuyoruz.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Fikri Mülkiyet</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Poplift platformu, logoları, tasarımları ve içerikleri Poplift Teknoloji A.Ş.'nin
                            fikri mülkiyetidir. Yazılı izin olmadan kopyalanamaz, dağıtılamaz veya değiştirilemez.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Sorumluluk Sınırlaması</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Poplift, hizmetlerin kullanımından kaynaklanan doğrudan veya dolaylı zararlardan
                            sorumlu tutulamaz. Hizmetler "olduğu gibi" sunulmaktadır ve belirli bir amaca
                            uygunluk garantisi verilmemektedir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">7. Hesap Sonlandırma</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Bu şartların ihlali durumunda hesabınızı askıya alabilir veya sonlandırabiliriz.
                            Hesabınızı istediğiniz zaman Dashboard üzerinden kapatabilirsiniz. Hesap
                            sonlandırıldığında verileriniz silinecektir.
                        </p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Bu Kullanım Şartları hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
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
