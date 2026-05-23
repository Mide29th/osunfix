'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import ReportList from '@/components/admin/ReportList';
import AdminCharts from '@/components/admin/AdminCharts';

export default function ReportsPage() {
    const { user, loading, faults } = useAdminData();
    const router = useRouter();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
                    <p className="text-sm text-muted-foreground">Admin logged in as {user.email}</p>
                </div>
                <button onClick={async () => { await signOut(auth); router.push('/login'); }} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    <LogOut size={18} /> Sign Out
                </button>
            </header>

            <div className="space-y-6">
                <AdminCharts faults={faults} />
                
                <div>
                    <ReportList faults={faults} />
                </div>
            </div>
        </div>
    );
}
