'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F9F9F5] w-full relative">
                <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-neutral-100"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-primary">Overview</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-medium">Hon. Admin</p>
                            <p className="text-muted-foreground text-xs">Ministry of Works</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-osun-gold/20 flex items-center justify-center text-osun-brown font-bold border border-osun-gold shrink-0">
                            HA
                        </div>
                    </div>
                </header>
                <div className="p-4 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
