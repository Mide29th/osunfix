export default function MapPage() {
    return (
        <div className="h-[calc(100vh-140px)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Interactive Fault Map</h1>
                    <p className="text-sm text-muted-foreground mt-1">Spatial distribution of infrastructure issues across Osun State</p>
                </div>
            </div>
            <div className="h-full w-full bg-white p-2 rounded-2xl border border-border overflow-hidden shadow-sm">
                <iframe src="/admin" className="w-full h-full border-none pointer-events-none opacity-0 absolute" />
                {/* Reusing the map widget logic */}
                <div className="h-full w-full">
                    <iframe src="/admin" className="hidden" />
                    <p className="p-4 text-sm italic text-muted-foreground">Redirecting to full screen map view...</p>
                </div>
            </div>
        </div>
    );
}
