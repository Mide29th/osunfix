import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
            {/* Sidebar Component */}
            <Sidebar />

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
