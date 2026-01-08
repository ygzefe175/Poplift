"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIContentGenerator from '@/components/AIContentGenerator';

/**
 * AI Content Generator Sayfası
 * Landing page içerikleri üretmek için kullanıcı arayüzü
 */
export default function AIContentGeneratorPage() {
    return (
        <main className="min-h-screen font-sans overflow-x-hidden bg-[#000212]">
            <Navbar />
            <AIContentGenerator />
            <Footer />
        </main>
    );
}

