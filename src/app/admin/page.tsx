import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/app/auth/actions';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-6">You do not have administrative privileges.</p>
                <form action={logout}>
                    <button type="submit" className="bg-[#2E7D32] text-white px-6 py-2 rounded-lg font-bold">
                        Sign Out
                    </button>
                </form>
            </div>
        );
    }

    // Fetch aggregated stats
    const { data: reports } = await supabase.from('FaultReports').select('status');

    const stats = {
        total: reports?.length || 0,
        resolved: reports?.filter(r => r.status === 'Resolved').length || 0,
        pending: reports?.filter(r => r.status === 'Pending').length || 0,
        critical: reports?.filter(r => r.status === 'Critical').length || 0,
    };

    return <AdminDashboardClient email={user.email || ''} stats={stats} />;
}
