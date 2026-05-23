'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map as MapIcon, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/map', label: 'Fault Map', icon: MapIcon },
    { href: '/admin/routing', label: 'Artisan Routing', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <aside className="w-64 bg-[#2E7D32] text-white flex flex-col shadow-xl z-20 h-full overflow-hidden">
            <div className="p-6 flex items-center gap-3 border-b border-[#1B5E20]">
                <div className="relative w-12 h-12 shrink-0">
                    <Image
                        src="/state-logo.svg"
                        alt="State of Osun Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight text-[#FFD700]">OsunFix</h1>
                    <p className="text-xs text-white/80">Gov. Dashboard</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto font-sans">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-white/20 text-white font-bold shadow-sm'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#1B5E20] space-y-2">
                <Link
                    href="/admin/settings"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/settings' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-white transition-colors text-left"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
