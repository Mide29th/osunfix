'use client'

import { login, signup } from '@/app/auth/actions'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { AlertCircle, Lock, Mail } from 'lucide-react'

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F5] p-4 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-border">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <Image
                            src="/state-logo.svg"
                            alt="Osun Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-[#2E7D32]">OsunFix Admin</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isSignUp ? 'Create your official account' : 'Sign in to access the government dashboard'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form action={async (formData) => {
                    setLoading(true)
                    if (isSignUp) {
                        await signup(formData)
                    } else {
                        await login(formData)
                    }
                    setLoading(false)
                }} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                                placeholder="official@osun.gov.ng"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] transition-all disabled:opacity-50"
                        >
                            {loading ? (isSignUp ? 'Creating Account...' : 'Authenticating...') : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </div>
                </form>

                <div className="text-center space-y-4">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-[#2E7D32] hover:underline font-medium"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : 'Need an official account? Sign Up'}
                    </button>
                    <p className="text-[10px] text-muted-foreground">
                        Authorized Personnel Only. Unauthorized access is strictly prohibited.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F9F5]">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
