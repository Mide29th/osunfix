'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Roads', co2: 400 },
    { name: 'Bridges', co2: 300 },
    { name: 'Water', co2: 200 },
    { name: 'Power', co2: 500 },
];

export default function CarbonTracker() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-border h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Carbon Abatement</h3>
                    <p className="text-xs text-muted-foreground">CO₂ emissions prevented by repairs</p>
                </div>
                <div className="bg-osun-green/10 p-2 rounded-full relative w-12 h-12">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-osun-green"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> */}
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
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}kg`}
                        />
                        <Tooltip
                            cursor={{ fill: '#F9F9F5' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="co2" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--osun-green)' : 'var(--osun-gold-dim)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-osun-green">1,400 <span className="text-xl font-normal text-muted-foreground">kg</span></p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Saved This Month</p>
                </div>
                <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+12% vs last month</span>
                </div>
            </div>
        </div>
    );
}
