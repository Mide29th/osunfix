'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hammer, MapPin, Search } from 'lucide-react';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ReportLandingPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('Assets').select('*');
            if (data) setAssets(data);
            setLoading(false);
        };
        fetchAssets();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <header className="h-16 border-b flex items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-semibold">Back to Home</span>
                </Link>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-foreground mb-4">Report an Infrastructure Issue</h1>
                    <p className="text-muted-foreground">Search for an asset ID or select one from the nearby list below to begin your report.</p>
                </div>

                <div className="relative mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Enter Asset ID (e.g. OS-STR-001)"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Assets Nearby
                    </h2>

                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading assets...</div>
                    ) : assets.map((asset) => (
                        <Card key={asset.id} className="hover:border-primary/50 transition-colors group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{asset.type}</CardTitle>
                                    <CardDescription>{asset.location}</CardDescription>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {asset.id}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/report/${asset.id}`}>
                                    <Button className="w-full bg-primary hover:bg-primary/90" variant="default">
                                        Report Fault <Hammer className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                    <p className="text-sm text-primary font-medium mb-4">Can't find the asset?</p>
                    <Button variant="outline" className="border-primary/20 text-primary">
                        Report by Custom Location
                    </Button>
                </div>
            </main>
        </div>
    );
}
