'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FaultMap = dynamic(() => import('@/components/admin/FaultMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-100 animate-pulse rounded-xl" />
});

export default function PublicMapPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="h-16 border-b flex items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-semibold">Back to Home</span>
                </Link>
                <div className="flex-1 text-center font-bold text-lg">Infrastructure Maintenance Map</div>
                <div className="w-24"></div> {/* Spacer for symmetry */}
            </header>

            <main className="flex-1 relative">
                <div className="absolute inset-0">
                    <FaultMap />
                </div>

                {/* Floating Info Overlay */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border max-w-xs animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-sm mb-1 text-primary">Live Status</h3>
                    <p className="text-xs text-muted-foreground">Showing real-time infrastructure faults and active maintenance crews across Osun State.</p>
                </div>
            </main>
        </div>
    );
}
