'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, User, Wallet } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; email: string; fullName: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const isActive = (path: string) => pathname === path ? 'text-primary' : 'text-foreground';

    useEffect(() => {
        checkAuth();
    }, [pathname]); // Re-check on route change

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container h-[var(--header-height)] flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
                    NFT Market
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={`font-medium hover:text-[hsl(var(--primary))] transition-colors ${isActive('/')}`}>
                        Explore
                    </Link>
                    <Link href="/create" className={`font-medium hover:text-[hsl(var(--primary))] transition-colors ${isActive('/create')}`}>
                        Create
                    </Link>
                    <Link href="/dashboard" className={`font-medium hover:text-[hsl(var(--primary))] transition-colors ${isActive('/dashboard')}`}>
                        Dashboard
                    </Link>
                    <Link href="/crm" className={`font-medium hover:text-[hsl(var(--primary))] transition-colors ${isActive('/crm')}`}>
                        CRM
                    </Link>
                    <Link href="/admin" className={`font-medium hover:text-[hsl(var(--primary))] transition-colors ${isActive('/admin')}`}>
                        Admin
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Auth Buttons */}
                    {!loading && (
                        <>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="hidden sm:inline">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-red-400 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    {/* Divider */}
                    {user && (
                        <>
                            <div className="h-6 w-px bg-white/10" />
                            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                                <Wallet className="w-4 h-4" />
                                <span className="text-sm font-medium">Wallet</span>
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}
