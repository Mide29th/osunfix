'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CarbonTrackerProps {
    stats?: {
        total: number;
        resolved: number;
        pending: number;
        critical: number;
    }
}

export default function CarbonTracker({ stats }: CarbonTrackerProps) {
    const data = [
        { name: 'Total', count: stats?.total || 0 },
        { name: 'Pending', count: stats?.pending || 0 },
        { name: 'Critical', count: stats?.critical || 0 },
        { name: 'Resolved', count: stats?.resolved || 0 },
    ];

    const savingsKg = (stats?.resolved || 0) * 150; // Mock calculation: 150kg saved per repair

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-border h-full flex flex-col font-sans">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Infrastructure Stats</h3>
                    <p className="text-xs text-muted-foreground">Fault distribution & Impact</p>
                </div>
                <div className="bg-osun-green/10 p-2 rounded-full relative w-12 h-12">
                    <div className="absolute inset-0 p-1">
                        <img src="/sustainability-badge.png" alt="Sustainability Badge" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#F9F9F5' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={
                                    entry.name === 'Resolved' ? 'var(--osun-green)' :
                                        entry.name === 'Critical' ? '#B91C1C' :
                                            'var(--osun-gold-dim)'
                                } />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-osun-green">{savingsKg.toLocaleString()} <span className="text-xl font-normal text-muted-foreground">kg</span></p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">CO₂ Saved via Repairs</p>
                </div>
                <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Impact Verified</span>
                </div>
            </div>
        </div>
    );
}
