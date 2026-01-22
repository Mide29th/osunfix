'use client';
import { useState, useEffect, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper to unwrap params
type Props = {
    params: Promise<{ assetId: string }>
}

export default function ReportFaultPage({ params }: Props) {
    // Unwrap params using React.use()
    const { assetId } = use(params);

    const [asset, setAsset] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [faultType, setFaultType] = useState('Broken');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchAsset() {
            if (!assetId) return;
            const { data, error } = await supabase
                .from('Assets')
                .select('*')
                .eq('id', assetId)
                .single();

            if (error || !data) {
                console.log('Error fetching asset:', error);
            } else {
                setAsset(data);
            }
            setLoading(false);
        }
        fetchAsset();
    }, [assetId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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
                } else {
                    photoUrl = filePath;
                }
            }

            const { error: dbError } = await supabase
                .from('FaultReports')
                .insert([
                    { asset_id: assetId, fault_type: faultType, photo_url: photoUrl }
                ]);

            if (dbError) {
                console.error('DB Error:', dbError);
                throw dbError;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-lg text-gray-500">Loading asset details...</p></div>;

    if (!asset && !loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Asset Not Found</h2>
            <Link href="/report">
                <Button>Go Back</Button>
            </Link>
        </div>
    );

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h2>
                    <p className="text-gray-600">Thank you for helping maintain Osun's infrastructure.</p>
                    <Link href="/report">
                        <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Submit Another</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <header className="absolute top-0 left-0 h-16 flex items-center px-6 w-full">
                <Link href="/report" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-semibold">Back</span>
                </Link>
            </header>

            <div className="max-w-2xl mx-auto space-y-8 mt-8">
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
                            <dd className="mt-1 text-lg font-semibold text-gray-900">{asset.id}</dd>
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

                {/* Climate Impact Card - The requested feature */}
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
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
