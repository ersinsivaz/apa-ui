'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Simple mock auth
    if (username === 'admin' && password === '123456') {
        const cookieStore = await cookies();
        cookieStore.set('auth_token', 'mock-token-123', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        redirect('/dashboard');
    }

    return { error: 'Geçersiz kullanıcı adı veya şifre.' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/');
}
