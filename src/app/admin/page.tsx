'use client';

import dynamic from 'next/dynamic';
import CarbonTracker from '@/components/admin/CarbonTracker';
import ArtisanRouting from '@/components/admin/ArtisanRouting';

// Dynamically import map to avoid window object issues during SSR
const FaultMap = dynamic(() => import('@/components/admin/FaultMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-100 animate-pulse rounded-xl" />
});

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Map Area - Takes up 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-border">
                        <h2 className="font-bold text-xl mb-4 text-foreground">Live Fault Tracker</h2>
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
                        <CarbonTracker />
                    </div>

                    {/* Extra widget for balance/visuals */}
                    <div className="bg-[#2E7D32] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 text-[#FFD700]">Report Priority</h3>
                            <p className="text-sm opacity-90 mb-4">3 critical road failures reported in Osogbo East.</p>
                            <button className="bg-white text-[#2E7D32] px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-neutral-100 transition-colors">
                                View Reports
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
