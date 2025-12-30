import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#000212]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32 text-slate-300">
                <h1 className="text-3xl font-bold text-white mb-8">Kullanım Koşulları</h1>
                <div className="space-y-4">
                    <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                    <p>
                        Popwise hizmetlerini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
                        Hizmetlerimiz "olduğu gibi" sunulmaktadır.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Kötüye kullanım yasaktır.</li>
                        <li>Hesap güvenliğiniz sizin sorumluluğunuzdadır.</li>
                        <li>İstediğimiz zaman hizmeti sonlandırma hakkımız saklıdır.</li>
                    </ul>
                    <p className="mt-8 text-sm text-slate-500">
                        Detaylı bilgi için info@popwise.app adresinden bize ulaşabilirsiniz.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
