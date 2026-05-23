import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function ArtisanRouting({ faults }: { faults?: any[] }) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Filter to pending and sort by urgency (highest first)
    const pendingFaults = (faults || [])
        .filter(f => f.status === 'Pending')
        .sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));

    const handleAssign = async (id: string) => {
        setUpdatingId(id);
        try {
            const faultRef = doc(db, 'FaultReports', id);
            await updateDoc(faultRef, {
                status: 'Dispatched'
            });
            // Note: The parent component's onAuthStateChanged listener will NOT 
            // automatically re-fetch unless we set up an onSnapshot. For MVP, 
            // we can just let it be or the user can refresh. But setting up onSnapshot
            // in page.tsx would be better. For now, it will update on reload.
        } catch (e) {
            console.error("Error dispatching:", e);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-border flex flex-col h-full">
            <div className="p-6 border-b border-border">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <ShieldCheck className="text-osun-green" size={20} />
                    Artisan Routing
                </h3>
                <p className="text-xs text-muted-foreground">Assign verified faults to repair teams</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {pendingFaults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                        <CheckCircle2 className="w-8 h-8 mb-2 text-green-500 opacity-50" />
                        No pending faults to dispatch.
                    </div>
                ) : (
                    pendingFaults.map((fault) => (
                        <div key={fault.id} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border hover:bg-neutral-50 transition-colors group">
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                    ${(fault.urgencyScore || 0) >= 8 ? 'bg-red-500' : (fault.urgencyScore || 0) >= 4 ? 'bg-orange-500' : 'bg-green-500'}`}>
                                    {fault.urgencyScore || 1}
                                </div>
                                {fault.photo_url && (
                                    <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-neutral-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={fault.photo_url} alt="Fault" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-foreground break-words leading-tight mb-0.5">
                                        {fault.aiTitle || fault.fault_type}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {fault.nearest_landmark}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <button 
                                    onClick={() => handleAssign(fault.id)}
                                    disabled={updatingId === fault.id}
                                    className="text-xs bg-[#2E7D32] text-white px-3 py-1.5 rounded-md hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
                                >
                                    {updatingId === fault.id ? 'Dispatching...' : 'Dispatch Team'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
