import { MapPin, Star, Phone, ShieldCheck } from 'lucide-react';

const artisans = [
    { id: 1, name: 'Adebayo Ogunleye', skill: 'Plumber', distance: '0.8km', rating: 4.8, status: 'Available' },
    { id: 2, name: 'Chinedu Okeke', skill: 'Electrician', distance: '1.2km', rating: 4.5, status: 'Busy' },
    { id: 3, name: 'Folake Adebisi', skill: 'Civil Engineer', distance: '2.5km', rating: 4.9, status: 'Available' },
    { id: 4, name: 'Tunde Bakare', skill: 'Carpenter', distance: '3.1km', rating: 4.7, status: 'Offline' },
];

export default function ArtisanRouting() {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-border flex flex-col h-full">
            <div className="p-6 border-b border-border">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <ShieldCheck className="text-osun-green" size={20} />
                    Artisan Routing
                </h3>
                <p className="text-xs text-muted-foreground">Nearest vetted repairmen to priority faults</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {artisans.map((artisan) => (
                    <div key={artisan.id} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border hover:bg-neutral-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600">
                                {artisan.name.charAt(0)}{artisan.name.split(' ')[1]?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-foreground">{artisan.name}</h4>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span>{artisan.skill}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                    <span className="flex items-center text-amber-500"><Star size={10} fill="currentColor" /> {artisan.rating}</span>
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1 text-xs font-medium text-osun-green bg-osun-green/10 px-2 py-1 rounded-full mb-1 w-fit ml-auto">
                                <MapPin size={10} /> {artisan.distance}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button className="text-xs bg-slate-900 text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors">
                                    Assign
                                </button>
                                <button className="text-xs border border-border p-1.5 rounded-md hover:bg-neutral-100 transition-colors text-neutral-500">
                                    <Phone size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-muted/30 border-t border-border rounded-b-xl">
                <button className="w-full text-sm font-medium text-primary hover:underline">View All Artisans</button>
            </div>
        </div>
    );
}
