'use client';

import dynamic from 'next/dynamic';
import CarbonTracker from '@/components/admin/CarbonTracker';
import ArtisanRouting from '@/components/admin/ArtisanRouting';
import { logout } from '@/app/auth/actions';
import { LogOut } from 'lucide-react';

// Dynamically import map to avoid window object issues during SSR
const FaultMap = dynamic(() => import('@/components/admin/FaultMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-100 animate-pulse rounded-xl" />
});

interface AdminDashboardClientProps {
    email: string;
    stats: {
        total: number;
        resolved: number;
        pending: number;
        critical: number;
    };
}

export default function AdminDashboardClient({ email, stats }: AdminDashboardClientProps) {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Government Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Admin logged in as {email}</p>
                </div>
                <form action={logout}>
                    <button type="submit" className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </form>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Map Area - Takes up 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-xl text-foreground">Live Fault Tracker</h2>
                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 uppercase tracking-tighter">Real-time Data Active</span>
                        </div>
                        <div className="h-[400px]">
                            <FaultMap />
                        </div>
                    </div>

                    {/* Artisan Routing below Map */}
                    <div className="h-[400px]">
                        <ArtisanRouting />
                    </div>
                </div>

                {/* Sidebar Widgets - Takes up 1 column */}
                <div className="space-y-6">
                    <div className="h-[400px]">
                        <CarbonTracker stats={stats} />
                    </div>

                    {/* Extra widget for balance/visuals */}
                    <div className="bg-[#2E7D32] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 text-[#FFD700]">Report Priority</h3>
                            <p className="text-sm opacity-90 mb-4">Critical failures detected in Osogbo East.</p>
                            <button className="bg-white text-[#2E7D32] px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-neutral-100 transition-colors">
                                View Full Report
                            </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute top-10 -right-5 w-16 h-16 bg-white/5 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
