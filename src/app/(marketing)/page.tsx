'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Zap,
    Shield,
    BarChart3,
    CheckCircle2,
    Users,
    ArrowRight,
    Star,
    FileText,
    Package,
    Landmark
} from 'lucide-react';
import { InteractiveDemo } from '@/components/ui/InteractiveDemo';

export default function LandingPage() {
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
                <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="text-white h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                            Ön Muhasebe
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Özellikler</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Fiyatlandırma</a>
                        <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Referanslar</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                            Giriş Yap
                        </Link>
                        <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                            Hemen Başlayın
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="pt-40 pb-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/30 mb-8 animate-in fade-in slide-in-from-bottom-4">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-600">Yapay Zeka Destekli Muhasebe</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                        İşletmenizin Finansını <br />
                        <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Zekice Yönetin</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Fatura takibi, stok yönetimi ve banka entegrasyonlarını tek bir platformda toplayın. Karmaşık tablolarla değil, akıllı dashboard ile büyümeye odaklanın.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group transition-all">
                            Ücretsiz Başla
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            onClick={() => setIsDemoOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            Demoyu İzle
                        </button>
                    </div>

                    {/* Mock Dashboard Preview */}
                    <div className="mt-20 relative px-4">
                        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
                            <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-amber-400" />
                                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="p-4 bg-slate-100/30 dark:bg-slate-950/30">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="h-32 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800" />
                                    <div className="h-32 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800" />
                                    <div className="h-32 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800" />
                                </div>
                                <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800" />
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] -z-10" />
                        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-[120px] -z-10" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">İhtiyacınız Olan Her Şey</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Modern işletmeler için tasarlanmış en kapsamlı muhasebe araçları.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Akıllı Faturalandırma', desc: 'Saniyeler içinde profesyonel faturalar oluşturun ve ödeme durumlarını takip edin.', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                            { title: 'Stok ve Depo', desc: 'Gerçek zamanlı stok takibi ve otomatik kritik seviye uyarıları ile kontrolü elden bırakmayın.', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            { title: 'Detaylı Raporlama', desc: 'Kar-zarar analizi, satış trendleri ve finansal tahminler ile geleceği planlayın.', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                            { title: 'Banka Entegrasyonu', desc: 'Tüm banka hesaplarınızı tek bir yerden izleyin ve hareketleri otomatik eşleştirin.', icon: Landmark, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                            { title: 'Güvenli Altyapı', desc: 'Verileriniz en yüksek güvenlik standartlarında şifrelenir ve düzenli olarak yedeklenir.', icon: Shield, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                            { title: 'Çoklu Kullanıcı', desc: 'Ekibinizi davet edin ve her birine özel yetki tanımlamaları ile beraber çalışın.', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                                <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Şeffaf Fiyatlandırma</h2>
                        <p className="text-slate-500 dark:text-slate-400">İşletmenizin büyüklüğüne göre en uygun planı seçin.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Basic Plan */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Başlangıç</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">₺299</span>
                                <span className="text-slate-500">/ay</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['100 Fatura / Ay', 'Temel Raporlama', 'Tek Kullanıcı', '7/24 Destek'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="block w-full py-3 text-center font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition-colors">
                                Hemen Başla
                            </Link>
                        </div>
                        {/* Pro Plan */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-blue-600 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">Popüler</div>
                            <h3 className="text-xl font-bold mb-2">Profesyonel</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">₺599</span>
                                <span className="text-slate-500">/ay</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Sınırsız Fatura', 'Gelişmiş Analizler', '5 Kullanıcı', 'Banka Entegrasyonu', 'Öncelikli Destek'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="block w-full py-3 text-center font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                                Hemen Başla
                            </Link>
                        </div>
                        {/* Enterprise Plan */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Kurumsal</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">₺1.200</span>
                                <span className="text-slate-500">/ay</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Sınırsız Her Şey', 'AI Finansal Tahmin', 'Sınırsız Kullanıcı', 'Özel Müşteri Temsilcisi', 'API Erişimi'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="block w-full py-3 text-center font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition-colors">
                                İletişime Geç
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="text-white h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold dark:text-white">Ön Muhasebe</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        © 2026 Antigravity Software. Tüm hakları saklıdır.
                    </div>
                </div>
            </footer>

            <InteractiveDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        </div>
    );
}
