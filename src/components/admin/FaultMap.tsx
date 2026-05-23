'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons based on urgency
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const highUrgencyIcon = createCustomIcon('#ef4444'); // Red
const medUrgencyIcon = createCustomIcon('#f59e0b'); // Orange
const lowUrgencyIcon = createCustomIcon('#22c55e'); // Green

export default function FaultMap({ faults }: { faults?: any[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 animate-pulse">
                Loading Map...
            </div>
        );
    }

    const validFaults = (faults || []).filter(f => f.lat && f.lng);

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
                {validFaults.map((fault) => {
                    const urgency = fault.urgencyScore || 1;
                    const markerIcon = urgency >= 8 ? highUrgencyIcon : urgency >= 4 ? medUrgencyIcon : lowUrgencyIcon;

                    return (
                        <Marker
                            key={fault.id}
                            position={[fault.lat, fault.lng]}
                            icon={markerIcon}
                        >
                            <Popup>
                                <div className="p-2 font-sans w-48">
                                    {fault.photo_url && (
                                        <div className="w-full h-24 mb-2 rounded-md overflow-hidden bg-neutral-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={fault.photo_url} alt="Fault location" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <h3 className="font-bold text-sm mb-1 leading-tight break-words">{fault.aiTitle || fault.fault_type}</h3>
                                    <p className="text-xs text-muted-foreground mb-2">{fault.nearest_landmark || 'No landmark'}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold uppercase ${
                                            urgency >= 8 ? 'bg-red-100 text-red-700' :
                                            urgency >= 4 ? 'bg-orange-100 text-orange-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            Urgency: {urgency}/10
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold uppercase ${
                                            fault.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                                            fault.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {fault.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-neutral-600 border-t border-border pt-1">
                                        {fault.aiAnalysis?.substring(0, 80)}...
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
