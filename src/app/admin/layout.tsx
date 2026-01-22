import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Map as MapIcon, Users, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2E7D32] text-white flex flex-col shadow-xl z-20">
                <div className="p-6 flex items-center gap-3 border-b border-[#1B5E20]">
                    <div className="relative w-12 h-12 shrink-0">
                        {/* Using the SVG we saved in public folder */}
                        <Image
                            src="/osun-seal.svg"
                            alt="State of Osun Seal"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-[#FFD700]">OsunFix</h1>
                        <p className="text-xs text-white/80">Gov. Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/map" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                        <MapIcon size={20} />
                        <span>Fault Map</span>
                    </Link>
                    <Link href="/admin/routing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                        <Users size={20} />
                        <span>Artisan Routing</span>
                    </Link>
                    <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                        <BarChart3 size={20} />
                        <span>Sustainability</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#1B5E20]">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F9F9F5]">
                <header className="bg-white border-b border-border h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-primary">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-medium">Hon. Admin</p>
                            <p className="text-muted-foreground text-xs">Ministry of Works</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-osun-gold/20 flex items-center justify-center text-osun-brown font-bold border border-osun-gold">
                            HA
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
