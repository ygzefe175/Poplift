"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface SpinWheelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Segment {
    label: string;
    color: string;
    code: string;
    isWin: boolean;
}

// İstenilen 6 Dilim
const segments: Segment[] = [
    { label: "%10 İndirim", color: "#FF6B35", code: "SAVE10", isWin: true },
    { label: "Kargo Bedava", color: "#4ECDC4", code: "FREESHIP", isWin: true },
    { label: "Pas", color: "#2C3E50", code: "", isWin: false },
    { label: "%20 İndirim", color: "#9B59B6", code: "SAVE20", isWin: true }, // Hedef 1
    { label: "Tekrar Dene", color: "#E74C3C", code: "", isWin: false },
    { label: "BÜYÜK SÜRPRİZ", color: "#F39C12", code: "MEGA50", isWin: true }, // Hedef 2
];

export default function SpinWheel({ isOpen, onClose }: SpinWheelProps) {
    const [email, setEmail] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<Segment | null>(null);
    const [rotation, setRotation] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw wheel on canvas
    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const segmentAngle = (2 * Math.PI) / segments.length;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw segments
        segments.forEach((segment, index) => {
            const startAngle = index * segmentAngle - Math.PI / 2;
            const endAngle = startAngle + segmentAngle;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';

            // Dinamik font boyutu
            if (segment.label.length > 10) {
                ctx.font = 'bold 10px "Inter", sans-serif';
            } else {
                ctx.font = 'bold 12px "Inter", sans-serif';
            }

            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.fillText(segment.label, radius - 15, 5);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw star in center
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', centerX, centerY);

        // Render pointer separately in HTML to avoid rotation logic complexity on canvas
    }, []);

    // Draw wheel when component mounts or opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(drawWheel, 100);
        }
    }, [isOpen, drawWheel]);

    const spinWheel = useCallback(() => {
        if (!email || isSpinning) return;

        setIsSpinning(true);
        setResult(null);
        setShowConfetti(false);

        // Hileli Seçim Mantığı (Rigging)
        // Sadece index 3 (%20 İndirim) veya index 5 (BÜYÜK SÜRPRİZ) gelsin
        const winningIndices = [3, 5];
        const selectedIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];

        // Calculate rotation
        // The segment at selectedIndex needs to end up at the top (270 degrees or -90 degrees visually)
        // But our canvas 0 is at 3 o'clock. 
        // 0 index is at -90deg (12 o'clock)

        const segmentAngle = 360 / segments.length;
        // Target angle to bring the selected segment to top center
        // target = 360 - (index * angle) - offset
        // Random slight offset within the segment for realism
        const randomOffset = Math.random() * (segmentAngle - 10) + 5;

        const targetAngle = 360 - (selectedIndex * segmentAngle) - (segmentAngle / 2);

        // Add 5-8 full spins
        const spins = 5 + Math.random() * 3;
        const finalRotation = rotation + (spins * 360) + targetAngle;

        setRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setResult(segments[selectedIndex]);

            // Always show confetti since we rigged it to win
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);

            // Show Toast Notification
            setTimeout(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 6000);
            }, 500);
        }, 5000); // 5 seconds spin time
    }, [email, isSpinning, rotation]);

    const resetWheel = () => {
        setResult(null);
        setEmail('');
        setShowConfetti(false);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-20"
                    >
                        <X size={18} className="text-white" />
                    </button>

                    {/* Confetti */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-30">
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-3 h-3"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: '-10px',
                                        backgroundColor: ['#FF6B35', '#4ECDC4', '#F39C12', '#9B59B6', '#E74C3C'][Math.floor(Math.random() * 5)],
                                        animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
                                        animationDelay: `${Math.random() * 0.5}s`,
                                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {!result ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold mb-2">
                                    <Gift size={14} />
                                    ÖZEL FIRSAT
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white mb-1">
                                    🎡 Şansını Dene!
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    E-postanı gir, çarkı çevir ve sürpriz indirim kazan!
                                </p>
                            </div>

                            {/* Wheel Container */}
                            <div className="relative w-56 h-56 mx-auto mb-4">
                                {/* Pointer */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 filter drop-shadow-md">
                                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400" />
                                </div>

                                {/* Wheel Canvas */}
                                <div
                                    className="w-full h-full"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                                    }}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        width={224}
                                        height={224}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Email Input & Spin Button */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="E-posta adresinizi girin"
                                        className="w-full pl-16 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        disabled={isSpinning}
                                    />
                                </div>
                                <button
                                    onClick={spinWheel}
                                    disabled={!email || isSpinning}
                                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-base rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                                >
                                    {isSpinning ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Çark Dönüyor...
                                        </>
                                    ) : (
                                        <>🎰 ÇEVİR VE KAZAN!</>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-slate-500 text-[10px] mt-3">
                                Gizlilik politikamızı kabul etmiş olursunuz.
                            </p>
                        </>
                    ) : (
                        /* Result Screen */
                        <div className="text-center py-6 animate-fade-in">
                            {result.isWin ? (
                                <>
                                    <div className="text-5xl mb-3 animate-bounce">🎉</div>
                                    <h3 className="text-xl font-black text-white mb-2">TEBRİKLER!</h3>
                                    <p className="text-slate-400 mb-4">
                                        Kazandınız: <span className="text-yellow-400 font-bold text-lg">{result.label}</span>
                                    </p>
                                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-dashed border-yellow-400 rounded-xl p-4 mb-4 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">Kupon Kodunuz</p>
                                        <p className="text-3xl font-black text-yellow-400 tracking-wider font-mono">{result.code}</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 py-2 rounded-lg mb-4 border border-emerald-500/20">
                                        <Mail size={14} /> KOD E-POSTANA GÖNDERİLDİ
                                    </div>
                                </>
                            ) : (
                                // Bu kısım hileli mantıkta asla çalışmayacak ama yedek
                                <>
                                    <div className="text-5xl mb-3">😔</div>
                                    <h3 className="text-xl font-black text-white mb-2">Bu Sefer Olmadı!</h3>
                                    <p className="text-slate-400 mb-4">Bir dahaki sefere şansınızı deneyin!</p>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10"
                            >
                                Harika, Teşekkürler!
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification - Top Right */}
            {showToast && (
                <div className="fixed top-24 right-6 z-[1000] animate-slide-left pointer-events-none">
                    <div className="bg-[#1C1C1E] border border-emerald-500/30 text-white pl-4 pr-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-500 mt-0.5">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-emerald-400 mb-1">Otomatik E-posta Gönderildi</p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                ✅ <span className="text-white font-medium">{email}</span> adresine indirim kuponunuz otomatik olarak iletildi!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(350px) rotate(720deg); opacity: 0; }
                }
                @keyframes slideLeft {
                    0% { transform: translateX(100px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-left {
                    animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
}
