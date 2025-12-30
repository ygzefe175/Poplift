import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32 text-slate-300">
                <h1 className="text-3xl font-bold text-white mb-8">Gizlilik Politikası</h1>
                <div className="space-y-4">
                    <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                    <p>
                        Veri gizliliğiniz bizim için önemlidir. Popwise olarak sadece hizmetin çalışması için gerekli minimum veriyi toplarız.
                    </p>
                    <h2 className="text-xl font-bold text-white mt-6 mb-4">Toplanan Veriler</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Kayıt bilgileri (E-posta, Ad Soyad)</li>
                        <li>Site kullanım istatistikleri (anonim)</li>
                    </ul>
                    <h2 className="text-xl font-bold text-white mt-6 mb-4">Veri Kullanımı</h2>
                    <p>
                        Verilerinizi asla 3. taraflara satmayız. KVKK ve GDPR uyumluluğu için gerekli tüm önlemleri almaktayız.
                    </p>
                    <p className="mt-8 text-sm text-slate-500">
                        Detaylı bilgi için info@popwise.app adresinden bize ulaşabilirsiniz.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
