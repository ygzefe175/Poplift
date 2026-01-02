import React from 'react';
import { ShoppingBag, Laptop, Shirt, Gem, Dumbbell, Sofa } from 'lucide-react';

export default function BrandLogos() {
    const categories = [
        { name: "Giyim & Moda", icon: <Shirt size={24} /> },
        { name: "Teknoloji", icon: <Laptop size={24} /> },
        { name: "Kozmetik", icon: <Gem size={24} /> },
        { name: "Ev & Yaşam", icon: <Sofa size={24} /> },
        { name: "Aksesuar", icon: <ShoppingBag size={24} /> },
        { name: "Spor & Outdoor", icon: <Dumbbell size={24} /> }
    ];

    return (
        <div className="py-12 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-center text-slate-500 text-xs uppercase tracking-widest font-bold mb-8">
                    Türkiye'nin En Hızlı Büyüyen Sektörleri Bize Güveniyor
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center text-slate-400 group-hover:text-brand-orange group-hover:scale-110 transition-all duration-300">
                                {cat.icon}
                            </div>
                            <span className="text-slate-400 text-xs font-bold text-center group-hover:text-white transition-colors">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
