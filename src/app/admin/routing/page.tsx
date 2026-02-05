import { Users } from 'lucide-react';

export default function RoutingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Artisan Routing & Dispatch</h1>
                <p className="text-sm text-muted-foreground mt-1">Connect vetted workers to priority infrastructure faults</p>
            </div>
            <div className="bg-white p-12 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                    <Users size={32} />
                </div>
                <h2 className="text-lg font-bold">Routing System Active</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    The dispatch algorithm is currently prioritizing critical road failures in Osogbo.
                </p>
            </div>
        </div>
    );
}
