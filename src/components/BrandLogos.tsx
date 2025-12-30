import React from 'react';
import { Store } from 'lucide-react';

export default function BrandLogos() {
    const brands = [
        "Butik Moda",
        "TechStore",
        "Giyim Dünyası",
        "E-Market Pro",
        "Ayakkabı Cenneti",
        "Kozmetik Plus"
    ];

    return (
        <div className="py-12 border-y border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-center text-slate-500 text-xs uppercase tracking-widest font-bold mb-8">
                    500+ marka güveniyor
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
                    {brands.map((brand, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Store size={24} className="text-slate-400" />
                            </div>
                            <span className="text-slate-500 text-xs font-semibold text-center">
                                {brand}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
