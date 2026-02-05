'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createClient } from '@/utils/supabase/client';

// Fix for default Leaflet markers in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function FaultMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [faults, setFaults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        const fetchFaults = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('FaultReports')
                .select(`
                    *,
                    Assets (
                        latitude,
                        longitude,
                        location,
                        type
                    )
                `);

            if (data) {
                // Filter out reports without coordinates
                const validFaults = data.filter(f => f.Assets?.latitude && f.Assets?.longitude);
                setFaults(validFaults);
            }
            setLoading(false);
        };

        fetchFaults();
    }, []);

    if (!isMounted || loading) {
        return (
            <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 animate-pulse">
                Loading Map Data...
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-border z-0 relative">
            <MapContainer
                center={[7.6, 4.5]}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {faults.map((fault) => (
                    <Marker
                        key={fault.id}
                        position={[fault.Assets.latitude, fault.Assets.longitude]}
                    >
                        <Popup>
                            <div className="p-2 font-sans">
                                <h3 className="font-bold text-sm">{fault.fault_type}</h3>
                                <p className="text-xs text-muted-foreground">{fault.Assets.location}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block font-bold uppercase ${fault.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                        fault.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {fault.status}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
