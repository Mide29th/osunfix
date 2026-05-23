'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminCharts({ faults }: { faults: any[] }) {
    // Process data for Status Chart (Pie)
    const statusCounts = faults.reduce((acc, f) => {
        const status = f.status || 'Pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusData = Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
    }));

    const COLORS = {
        'Resolved': '#22c55e', // Green
        'Pending': '#f59e0b', // Amber/Yellow
        'Dispatched': '#3b82f6', // Blue
        'Critical': '#ef4444', // Red
    };

    // Process data for Category Chart (Bar)
    const categoryCounts = faults.reduce((acc, f) => {
        const cat = f.fault_type || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.keys(categoryCounts)
        .map(key => ({ name: key, count: categoryCounts[key] }))
        .sort((a, b) => b.count - a.count); // Sort descending

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Status Donut Chart */}
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col items-center min-w-0 overflow-hidden">
                <h3 className="text-sm font-bold text-foreground w-full text-left mb-4 truncate">Report Status Overview</h3>
                <div className="w-full h-[250px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: any) => [`${value} Reports`, 'Count']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col items-center min-w-0 overflow-hidden">
                <h3 className="text-sm font-bold text-foreground w-full text-left mb-4 truncate">Fault Categories</h3>
                <div className="w-full h-[250px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 15, right: 15, left: -10, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#64748b' }} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
