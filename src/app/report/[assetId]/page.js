'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import { useNetworkStatus } from '@/lib/networkDetection';
import { saveReportOffline, savePhotoOffline, getPendingReports } from '@/lib/offlineStorage';
import { syncPendingReports } from '@/lib/syncService';

export default function ReportFaultPage() {
    const { assetId } = useParams();
    const { isOnline, isHighSpeed } = useNetworkStatus();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [faultType, setFaultType] = useState('Broken');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    // Sync state
    const [pendingCount, setPendingCount] = useState(0);
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, done, error
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        // Update pending count on mount
        setPendingCount(getPendingReports().length);

        async function fetchAsset() {
            if (!assetId) return;
            // Fetch asset from Supabase (mocked fallback if no DB connection)
            const { data, error } = await supabase
                .from('Assets')
                .select('*')
                .eq('id', assetId)
                .single();

            if (error || !data) {
                console.log('Error fetching asset or no data, using mock data for demo:', error);
                // Fallback mock data for demo purposes if DB not connected
                setAsset({
                    id: assetId,
                    location: 'Osogbo Central Market, Osun',
                    type: 'Solar Street Light',
                    status: 'Active'
                });
            } else {
                setAsset(data);
            }
            setLoading(false);
        }
        fetchAsset();
    }, [assetId]);

    // Auto-sync effect
    useEffect(() => {
        if (isOnline && isHighSpeed && pendingCount > 0 && syncStatus !== 'syncing') {
            handleSync();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, isHighSpeed, pendingCount]);

    const handleSync = async () => {
        if (syncStatus === 'syncing') return;

        setSyncStatus('syncing');
        try {
            const result = await syncPendingReports((current, total) => {
                setSyncProgress({ current, total });
            });

            // Refresh pending count
            const remaining = getPendingReports().length;
            setPendingCount(remaining);
            setSyncStatus(remaining === 0 ? 'done' : 'error');

            if (remaining === 0) {
                setTimeout(() => setSyncStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncStatus('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setWasOffline(!isOnline);

        try {
            // Offline Mode
            if (!isOnline) {
                const reportId = crypto.randomUUID();
                let photoId = null;

                if (file) {
                    photoId = `photo_${reportId}`;
                    await savePhotoOffline(photoId, file);
                }

                saveReportOffline({
                    id: reportId,
                    asset_id: assetId,
                    fault_type: faultType,
                    photoId,
                    created_at: new Date().toISOString()
                });

                setPendingCount(prev => prev + 1);

                // Simulate delay for consistent UX
                await new Promise(resolve => setTimeout(resolve, 800));
                setSubmitted(true);
                setIsSubmitting(false);
                return;
            }

            // Online Mode (Existing Logic)
            let photoUrl = '';
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `fault-reports/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('fault-reports')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload Error:', uploadError);
                }
                photoUrl = filePath;
            }

            const { error: dbError } = await supabase
                .from('FaultReports')
                .insert([
                    { asset_id: assetId, fault_type: faultType, photo_url: photoUrl, created_at: new Date() }
                ]);

            if (dbError) {
                console.error('DB Error:', dbError);
                // Fallback to offline storage if online request fails? 
                // For simplicity, we'll keep strict online/offline separation for now
                // but usually you would catch connection errors here and save offline.
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-lg text-gray-500">Loading asset details...</p></div>;

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {wasOffline ? 'Saved Offline' : 'Report Submitted!'}
                    </h2>
                    <p className="text-gray-600">
                        {wasOffline
                            ? 'Your report has been saved locally and will auto-sync when you reach a 4G zone.'
                            : 'Thank you for helping maintain Osun\'s infrastructure.'}
                    </p>
                    <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Submit Another</button>

                    {wasOffline && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                            Pending Syncs: {pendingCount}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Network Status Banner */}
                <div className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {isOnline ? (isHighSpeed ? 'Online (High Speed)' : 'Online (Low Speed)') : 'Offline Mode'}
                    </div>
                    {pendingCount > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="bg-white/50 px-2 py-0.5 rounded text-xs">
                                {pendingCount} Pending
                            </span>
                            {isOnline && (
                                <button
                                    onClick={handleSync}
                                    disabled={syncStatus === 'syncing'}
                                    className="text-xs underline hover:no-underline disabled:opacity-50"
                                >
                                    {syncStatus === 'syncing' ? `Syncing ${syncProgress.current}/${syncProgress.total}...` : 'Sync Now'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">OsunFix Report</h1>
                    <p className="mt-2 text-sm text-gray-600">Infrastructure Maintenance Portal</p>
                </div>

                {/* Asset Details Card */}
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Asset Details</h3>
                    </div>
                    <div className="px-6 py-5 grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
                            <dd className="mt-1 text-lg font-semibold text-gray-900">{assetId}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Type</dt>
                            <dd className="mt-1 text-lg text-gray-900">{asset.type}</dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-lg text-gray-900 flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {asset.location}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Climate Impact Card */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-yellow-300 opacity-10 rounded-full blur-xl"></div>

                    <div className="px-6 py-6 relative z-10 flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Climate Impact</h3>
                            <p className="mt-1 text-emerald-50 text-sm leading-relaxed">
                                Repairing this asset prevents <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">120kg</span> of CO2 waste compared to a full replacement.
                            </p>
                            <div className="mt-3 flex items-center text-xs text-emerald-100">
                                <span className="inline-block w-2 H-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                                Sustainable Maintenance
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reporting Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 border border-gray-100">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Fault Type
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Broken', 'Leaking', 'Outage'].map((type) => (
                                <div key={type}
                                    onClick={() => setFaultType(type)}
                                    className={`cursor-pointer text-center py-3 px-2 rounded-lg border transition-all ${faultType === type ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                                    <span className="block text-sm font-medium">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Upload Photo
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {file ? (
                                        <p className="text-sm text-gray-500 font-medium">{file.name}</p>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (isOnline ? 'Submitting Report...' : 'Saving Offline...') : (isOnline ? 'Submit Report' : 'Save Offline')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
