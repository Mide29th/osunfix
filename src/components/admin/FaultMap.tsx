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
                        location
                    )
                `);

            if (data) {
                // Filter out reports where asset might have been deleted or missing coords
                const validFaults = data.filter(f => f.Assets?.latitude && f.Assets?.longitude);
                setFaults(validFaults);
            }
        };
        fetchFaults();
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[400px] bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 animate-pulse">
                Loading Map...
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-border z-0 relative">
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
                            <div className="p-2">
                                <h3 className="font-bold text-sm">{fault.fault_type} - {fault.Assets.location}</h3>
                                <div className="text-xs text-gray-500 mb-1">Asset: {fault.asset_id}</div>
                                <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${fault.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                        fault.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
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
