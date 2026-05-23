'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, X, Flame } from 'lucide-react';

export default function ReportList({ faults }: { faults: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFault, setSelectedFault] = useState<any | null>(null);

    const filteredFaults = (faults || []).filter(f => 
        (f.aiTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.fault_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.nearest_landmark || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-NG', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        }).format(date);
    };

    const urgencyColor = (score: number) => {
        if (score >= 8) return 'bg-red-100 text-red-700 border-red-200';
        if (score >= 5) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-green-100 text-green-700 border-green-200';
    };

    const statusColor = (status: string) => {
        if (status === 'Resolved') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'Dispatched') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    return (
        <div className="bg-white rounded-xl border border-border shadow-sm flex flex-col h-[600px] overflow-hidden">
            {/* Header & Search */}
            <div className="p-5 border-b border-border bg-neutral-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Reported Cases</h3>
                    <p className="text-xs text-muted-foreground">Click a case to view full AI analysis & details</p>
                </div>
                <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search cases..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {filteredFaults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
                        <p className="font-medium">No cases found</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredFaults.map(fault => (
                            <div 
                                key={fault.id}
                                onClick={() => setSelectedFault(fault)}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-border cursor-pointer transition-colors"
                            >
                                {fault.photo_url ? (
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-200 shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={fault.photo_url} alt="Fault" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-neutral-400" />
                                    </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-foreground truncate">
                                        {fault.aiTitle || fault.fault_type || 'Unknown Fault'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{fault.nearest_landmark || 'No landmark'}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor(fault.status)} uppercase`}>
                                            {fault.status || 'Pending'}
                                        </span>
                                        {fault.urgencyScore > 0 && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${urgencyColor(fault.urgencyScore)} flex items-center gap-1`}>
                                                <Flame className="h-3 w-3" />
                                                Urgency: {fault.urgencyScore}/10
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(fault.timestamp).split(',')[0]}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(fault.timestamp).split(',')[1]}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-neutral-300 shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedFault && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFault(null)}>
                    <div 
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-border bg-neutral-50">
                            <div>
                                <h2 className="font-bold text-lg leading-tight">{selectedFault.aiTitle || selectedFault.fault_type}</h2>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Reported on {formatDate(selectedFault.timestamp)}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedFault(null)}
                                className="p-2 bg-white border border-border rounded-lg text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Photo */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evidence</h4>
                                    <div className="rounded-xl overflow-hidden border border-border bg-neutral-100 aspect-video relative">
                                        {selectedFault.photo_url ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={selectedFault.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">No photo</div>
                                        )}
                                        {selectedFault.isVerifiedFault && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> AI Verified
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</h4>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(selectedFault.status)} uppercase inline-block`}>
                                            {selectedFault.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Location</h4>
                                        <p className="text-sm font-medium flex items-start gap-1">
                                            <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                            {selectedFault.nearest_landmark || 'No landmark provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Urgency Score</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${selectedFault.urgencyScore >= 8 ? 'bg-red-500' : selectedFault.urgencyScore >= 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(selectedFault.urgencyScore / 10) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold">{selectedFault.urgencyScore}/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Analysis */}
                            {selectedFault.aiAnalysis && (
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                        <AlertTriangle className="h-4 w-4" /> 
                                        Gemini Hazard Analysis
                                    </h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {selectedFault.aiAnalysis}
                                    </p>
                                </div>
                            )}

                            {/* Citizen Description */}
                            {selectedFault.description && (
                                <div className="bg-neutral-50 border border-border rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Citizen Description
                                    </h4>
                                    <p className="text-sm text-foreground leading-relaxed italic">
                                        "{selectedFault.description}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
