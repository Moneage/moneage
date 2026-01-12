"use client";

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'homepage_cta' }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Please check your email to confirm your subscription!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect to server');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === 'loading' || status === 'success'}
                    className="flex-1 px-6 py-3 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-80"
                    required
                />
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-md hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === 'success' ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Joined</span>
                        </div>
                    ) : (
                        "Subscribe Now"
                    )}
                </button>
            </form>
            {message && (
                <div className={`mt-4 text-sm font-medium flex items-center justify-center gap-2 ${status === 'success' ? 'text-green-200' : 'text-red-300'
                    }`}>
                    {status === 'error' && <AlertCircle className="w-4 h-4" />}
                    {message}
                </div>
            )}
        </div>
    );
}
