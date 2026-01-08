"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteAnaliz from '@/components/SiteAnaliz';

/**
 * Site Analiz Sayfası
 * Viral paylaşım potansiyeli olan ücretsiz SEO ve site analiz aracı
 */
export default function SiteAnalizPage() {
    return (
        <main className="min-h-screen font-sans overflow-x-hidden bg-[#000212]">
            <Navbar />
            <SiteAnaliz />
            <Footer />
        </main>
    );
}
