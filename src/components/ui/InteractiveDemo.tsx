'use client';

import { useState, useEffect } from 'react';
import {
    X,
    MousePointer2,
    Plus,
    User,
    FileText,
    CheckCircle2,
    LayoutDashboard,
    TrendingUp,
    Zap,
    Search,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    id: number;
    title: string;
    description: string;
}

const steps: Step[] = [
    { id: 1, title: 'Akıllı Özet', description: 'İşletmenizin finansal röntgenini saniyeler içinde çekin.' },
    { id: 2, title: 'Hızlı İşlem', description: 'Karmaşık menülerde kaybolmadan aksiyon alın.' },
    { id: 3, title: 'Otomatik Kayıt', description: 'Yapay zeka verilerinizi anında analiz edip kaydeder.' },
    { id: 4, title: 'Anlık Sonuç', description: 'Yaptığınız her işlem raporlarınıza anında yansır.' },
];

export function InteractiveDemo({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activeStep, setActiveStep] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        let interval: NodeJS.Timeout;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveStep(prev => (prev % 4) + 1);
            }, 4000);
        }

        return () => clearInterval(interval);
    }, [isOpen, isAutoPlaying]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 fade-in duration-500 flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Left Side: Story/Steps */}
                <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950/50 p-8 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="inline-flex p-3 bg-blue-600 rounded-2xl mb-8 shadow-lg shadow-blue-500/20">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-8 dark:text-white leading-tight">Nasıl <br /> Çalışır?</h2>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "relative pl-8 transition-all duration-500",
                                        activeStep === step.id ? "opacity-100 scale-105" : "opacity-40 grayscale"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute left-0 top-1 h-2 w-2 rounded-full",
                                        activeStep === step.id ? "bg-blue-600 ring-4 ring-blue-500/20" : "bg-slate-300 dark:bg-slate-700"
                                    )} />
                                    <h3 className="font-bold text-sm mb-1 dark:text-white">{step.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-blue-500 transition-colors"
                        >
                            {isAutoPlaying ? 'Durdur (Paused)' : 'Oynat (Play)'}
                        </button>
                    </div>
                </div>

                {/* Right Side: Visual Demo */}
                <div className="flex-1 bg-white dark:bg-slate-900 relative p-12 overflow-hidden flex items-center justify-center">
                    <div className="w-full max-w-3xl aspect-[16/10] relative">

                        {/* Fake App Shell */}
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
                            {/* Toolbar */}
                            <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-red-400" />
                                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded ml-4" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Bell className="h-4 w-4 text-slate-400" />
                                    <div className="h-8 w-8 rounded-full bg-blue-600" />
                                </div>
                            </div>

                            {/* App Content */}
                            <div className="p-8 h-full bg-slate-50 dark:bg-slate-950/50">

                                {/* SCENE 1: DASHBOARD */}
                                <div className={cn(
                                    "space-y-6 transition-all duration-700 absolute inset-8",
                                    activeStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                                        <div className="h-8 w-8 bg-blue-600 rounded-lg" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                                                <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                                                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-48 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/10 to-transparent" />
                                        <div className="absolute left-10 bottom-10 h-32 w-[90%] flex items-end gap-2">
                                            {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-blue-600/40 rounded-t-lg transition-all duration-1000 delay-[i*100ms]"
                                                    style={{ height: activeStep === 1 ? `${h}%` : '0%' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* SCENE 2: ACTION (Mouse movement) */}
                                <div className={cn(
                                    "transition-all duration-700 absolute inset-8 flex items-center justify-center",
                                    activeStep === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                )}>
                                    <div className="text-center space-y-8">
                                        <div className="inline-flex p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl relative">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                                    <Plus className="h-6 w-6" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold dark:text-white">Yeni Fatura</div>
                                                    <div className="text-[10px] text-slate-400">Tek tıkla satış kaydı</div>
                                                </div>
                                            </div>
                                            {/* Cursor Animation */}
                                            <div className="absolute -bottom-10 -right-10 animate-demo-cursor">
                                                <MousePointer2 className="h-10 w-10 text-white fill-black drop-shadow-xl" />
                                            </div>
                                        </div>
                                        <p className="text-slate-500 font-medium">Kullanayışlı kısa yollar ile işlemlerinizi hızlandırın.</p>
                                    </div>
                                </div>

                                {/* SCENE 3: AUTO-FILL FORM */}
                                <div className={cn(
                                    "transition-all duration-700 absolute inset-8 flex flex-col justify-center",
                                    activeStep === 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                                )}>
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-w-md mx-auto">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-bold dark:text-white">Satış Faturası #001</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-10 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center px-4 overflow-hidden">
                                                <User className="h-4 w-4 text-slate-400 mr-3" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 animate-typing">Ahmet Yılmaz (Sistemden Seçildi)</span>
                                            </div>
                                            <div className="h-10 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center px-4 overflow-hidden">
                                                <TrendingUp className="h-4 w-4 text-emerald-500 mr-3" />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white animate-typing delay-1000">₺12.500,00</span>
                                            </div>
                                        </div>
                                        <div className="bg-blue-600 h-12 w-full rounded-2xl flex items-center justify-center text-white font-bold opacity-0 animate-fade-in delay-2000">
                                            Onayla ve Kaydet
                                        </div>
                                    </div>
                                </div>

                                {/* SCENE 4: SUCCESS & REFLECT */}
                                <div className={cn(
                                    "transition-all duration-700 absolute inset-8 flex flex-col items-center justify-center",
                                    activeStep === 4 ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
                                )}>
                                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
                                        <CheckCircle2 className="h-12 w-12" />
                                    </div>
                                    <h4 className="text-xl font-bold dark:text-white text-center">İşlem Tamamlandı!</h4>
                                    <p className="text-slate-500 text-center mt-2 max-w-xs">Verileriniz muhasebe kayıtlarına ve raporlarınıza anında işlendi.</p>

                                    <div className="mt-8 flex gap-3">
                                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold dark:text-white">STOK GÜNCELLENDİ</div>
                                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold dark:text-white">BAKİYE ARTIRILDI</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Background blobs for depth */}
                        <div className="absolute -top-20 -left-20 h-64 w-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
                        <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes demo-cursor {
                    0% { transform: translate(100px, 100px); }
                    30% { transform: translate(10px, 10px); }
                    50% { transform: translate(0px, 0px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                @keyframes typing {
                    from { width: 0; }
                    to { width: 100%; }
                }

                .animate-demo-cursor {
                    animation: demo-cursor 3s infinite ease-in-out;
                }

                .animate-typing {
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    animation: typing 2s steps(40, end);
                }

                .animate-fade-in {
                    animation: fade-in 0.5s forwards;
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
