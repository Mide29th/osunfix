'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import CarbonTracker from '@/components/admin/CarbonTracker';

export default function AdminDashboard() {
    const { user, loading, stats } = useAdminData();
    const router = useRouter();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Government Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Admin logged in as {user.email}</p>
                </div>
                <button onClick={async () => { await signOut(auth); router.push('/login'); }} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    <LogOut size={18} /> Sign Out
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <CarbonTracker stats={stats} />
                </div>
                <div>
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
