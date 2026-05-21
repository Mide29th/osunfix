'use client';
import { useState, useEffect, use, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, MapPin, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Props = { params: Promise<{ assetId: string }> };

export default function ReportFaultPage({ params }: Props) {
  const { assetId } = use(params);

  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [faultType, setFaultType] = useState('Broken');
  const [landmark, setLandmark] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAsset() {
      if (!assetId) return;
      const { data, error } = await supabase
        .from('Assets')
        .select('*')
        .eq('id', assetId)
        .single();
      if (!error && data) setAsset(data);
      setLoading(false);
    }
    fetchAsset();
  }, [assetId]);

  const handleFile = (f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clearImage = () => {
    handleFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('fault-reports')
          .upload(`fault-reports/${fileName}`, file);
        if (!uploadError) photoUrl = `fault-reports/${fileName}`;
      }

      const { error: dbError } = await supabase
        .from('FaultReports')
        .insert([{ asset_id: assetId, fault_type: faultType, photo_url: photoUrl, nearest_landmark: landmark.trim() || null }]);

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!asset) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 gap-4">
      <p className="text-lg font-semibold text-foreground">Asset not found</p>
      <Link href="/report"><Button>Go Back</Button></Link>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm w-full border border-emerald-100">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted!</h2>
        <p className="text-muted-foreground text-sm">Thank you for helping maintain Osun's infrastructure.</p>
        <Link href="/report">
          <Button className="mt-6 w-full">Submit Another Report</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <header className="sticky top-0 z-50 h-16 border-b bg-white/80 backdrop-blur-md flex items-center px-6">
        <Link href="/report" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-sm">Back</span>
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Report Infrastructure Fault</h1>
          <p className="mt-1 text-sm text-muted-foreground">OsunFix · Maintenance Portal</p>
        </div>

        {/* Asset Details */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/40">
            <p className="text-sm font-semibold text-foreground">Asset Details</p>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Asset ID</p>
              <p className="font-mono font-semibold text-foreground mt-0.5">{asset.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-semibold text-foreground mt-0.5">{asset.type}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Registered Location</p>
              <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                {asset.location}
              </p>
            </div>
          </div>
        </div>

        {/* Climate Impact */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-white px-6 py-5 flex items-start gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Climate Impact</p>
            <p className="text-sm text-emerald-50 mt-1 leading-relaxed">
              Repairing this asset prevents <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">120kg of CO₂</span> waste vs. full replacement.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border shadow-sm px-6 py-6 space-y-6">

          {/* Fault Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Fault Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['Broken', 'Leaking', 'Outage', 'Damaged', 'Blocked', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFaultType(type)}
                  className={`py-2.5 px-2 rounded-xl border text-sm font-medium transition-all ${faultType === type ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Closest Landmark */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Closest Landmark <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Help our team find the exact spot, especially if the asset has no visible label.
            </p>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Opposite GTBank, near Olaiya Junction..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-neutral-50 focus:bg-white"
                maxLength={150}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Photo Evidence <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              A clear photo speeds up repair prioritisation.
            </p>

            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-border bg-muted/40">
                <div className="relative w-full aspect-video">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={clearImage}
                    className="h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-3 py-2 border-t border-border bg-white/80 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground truncate">{file?.name}</p>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl cursor-pointer bg-neutral-50 hover:bg-primary/5 hover:border-primary/40 transition-all group">
                <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="font-semibold">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · Max 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={e => handleFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Submitting...
              </span>
            ) : 'Submit Report'}
          </Button>
        </form>
      </div>
    </div>
  );
}
