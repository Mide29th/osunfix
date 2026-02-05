import { createClient } from '@/utils/supabase/server';
import { Badge } from 'lucide-react';
import Image from 'next/image';

export default async function ReportsPage() {
    const supabase = await createClient();

    // Fetch reports with asset details
    const { data: reports, error } = await supabase
        .from('FaultReports')
        .select(`
      *,
      Assets (
        location,
        type,
        latitude,
        longitude
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports:', error);
    }

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Infrastructure Reports</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage and track all citizen infrastructure complaints</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Export CSV</button>
                    <button className="px-4 py-2 bg-[#2E7D32] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1B5E20] transition-colors">All Statuses</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F9F9F5] border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Asset / ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Fault Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Reported Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reports?.map((report) => (
                                <tr key={report.id} className="hover:bg-neutral-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-sm text-primary">#{report.asset_id}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{report.Assets?.type}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">{report.fault_type}</span>
                                        {report.photo_url && (
                                            <span className="ml-2 inline-flex items-center text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase">IMG</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{report.Assets?.location}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                report.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">{new Date(report.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs font-bold text-[#7F2B0A] hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {reports?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">No reports found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
