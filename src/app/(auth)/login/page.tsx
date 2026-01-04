'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { LayoutDashboard, Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />

            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Geri Dön
            </Link>

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex h-16 w-16 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                        <LayoutDashboard className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tekrar Hoş Geldiniz</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">İşletmenizi yönetmeye hemen başlayın.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Kullanıcı Adı</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="admin"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Şifre</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="123456"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in shake duration-300">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Demo hesabı: <span className="font-bold text-slate-900 dark:text-white">admin</span> / <span className="font-bold text-slate-900 dark:text-white">123456</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
