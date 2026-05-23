'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hammer, MapPin, Search, Camera, X, ChevronDown, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FAULT_TYPES = ['Broken', 'Leaking', 'Outage', 'Damaged', 'Blocked', 'Other'];

export default function ReportLandingPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetSearch, setAssetSearch] = useState('');

  // Custom location form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [faultType, setFaultType] = useState('Broken');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Assets'));
        const assetsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssets(assetsData);
      } catch (e) {
        console.error("Error fetching assets:", e);
      } finally {
        setAssetsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  let lat = position.coords.latitude;
                  let lng = position.coords.longitude;
                  
                  // For hackathon/demo: If the user is testing from outside Osun State
                  // (roughly lat 7.0-8.2, lng 4.0-5.2), map their location into Osogbo
                  // so the pins actually show up on the map.
                  if (lat < 7.0 || lat > 8.2 || lng < 4.0 || lng > 5.2) {
                      lat = 7.76 + (Math.random() - 0.5) * 0.05; // Randomize around Osogbo
                      lng = 4.56 + (Math.random() - 0.5) * 0.05;
                  }

                  setLocation({ lat, lng });
                  setLocationError('');
              },
              (err) => {
                  console.warn(err);
                  // Fallback to a random Osogbo location if location is blocked
                  setLocation({
                      lat: 7.76 + (Math.random() - 0.5) * 0.05,
                      lng: 4.56 + (Math.random() - 0.5) * 0.05
                  });
                  setLocationError('');
              }
          );
      } else {
          setLocationError('Geolocation is not supported by your browser.');
      }
  };

  useEffect(() => {
      if (showCustomForm && !location) {
          getLocation();
      }
  }, [showCustomForm]);

  const filteredAssets = assets.filter(a =>
    assetSearch === '' ||
    a.id?.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.type?.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.location?.toLowerCase().includes(assetSearch.toLowerCase())
  );

  const handleFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const clearImage = () => {
    handleFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmark.trim() && !description.trim()) return;
    setSubmitting(true);
    try {
      let photoUrl = '';
      
      // 1. Upload to Firebase Storage
      if (file) {
        const ext = file.name.split('.').pop();
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const storageRef = ref(storage, `fault-reports/${name}`);
        const snapshot = await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. AI Analysis (if photo exists)
      let aiData = { isVerifiedFault: false, urgencyScore: 1, aiTitle: '', aiAnalysis: '' };
      if (photoUrl) {
          const aiResponse = await fetch('/api/analyze-fault', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: photoUrl, description })
          });
          if (aiResponse.ok) {
              aiData = await aiResponse.json();
          } else {
              console.warn("AI Analysis failed, saving report anyway.");
          }
      }

      // 3. Save to Firestore
      await addDoc(collection(db, 'FaultReports'), {
        asset_id: null,
        fault_type: faultType,
        photo_url: photoUrl,
        nearest_landmark: landmark.trim() || null,
        description: description.trim() || null,
        lat: location?.lat || null,
        lng: location?.lng || null,
        status: 'Pending',
        timestamp: serverTimestamp(),
        // AI fields
        isVerifiedFault: aiData.isVerifiedFault,
        urgencyScore: aiData.urgencyScore,
        aiTitle: aiData.aiTitle,
        aiAnalysis: aiData.aiAnalysis
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetCustomForm = () => {
    setFaultType('Broken');
    setLandmark('');
    setDescription('');
    handleFile(null);
    setSubmitted(false);
    setShowCustomForm(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="h-16 border-b flex items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-sm">Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">Report an Infrastructure Issue</h1>
          <p className="text-muted-foreground text-sm">Search for a known asset ID, or report by location if the infrastructure has no label.</p>
        </div>

        {/* Asset search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
            placeholder="Search by Asset ID, type, or location…"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          />
        </div>

        {/* Asset list */}
        <div className="space-y-3 mb-10">
          <h2 className="font-semibold text-sm flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {assetSearch ? 'Search Results' : 'Nearby Assets'}
          </h2>

          {assetsLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading assets…
            </div>
          ) : filteredAssets.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No assets found — try a different search or report by custom location below.</p>
          ) : filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-semibold">{asset.type}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{asset.location}
                  </CardDescription>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                  {asset.id}
                </span>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <Link href={`/report/${asset.id}`}>
                  <Button size="sm" className="w-full">
                    Report Fault <Hammer className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom location panel */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCustomForm(v => !v)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div>
              <p className="text-sm font-semibold text-primary">No asset label? Report by location</p>
              <p className="text-xs text-muted-foreground mt-0.5">Add a photo and nearest landmark so we can locate the issue</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-200 ${showCustomForm ? 'rotate-180' : ''}`} />
          </button>

          {showCustomForm && (
            <div className="border-t border-primary/15 bg-white px-6 py-6">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-foreground">Report Submitted!</p>
                  <p className="text-sm text-muted-foreground">Our team will investigate based on the landmark you provided. Our AI will prioritize it accordingly.</p>
                  <Button variant="outline" size="sm" onClick={resetCustomForm}>Submit Another</Button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-5">
                  {/* Location Status */}
                  <div className="flex items-center gap-2 text-xs">
                      {location ? (
                          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"><Navigation className="w-3 h-3" /> Location Acquired</span>
                      ) : locationError ? (
                          <span className="text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">{locationError}</span>
                      ) : (
                          <span className="flex items-center gap-1 text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Acquiring Location...</span>
                      )}
                  </div>

                  {/* Fault Type */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Fault Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FAULT_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFaultType(t)}
                          className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all ${faultType === t ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Closest Landmark — required for custom reports */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Closest Landmark <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Helps our team find the exact spot.
                    </p>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        placeholder="e.g. Opposite GTBank Olaiya, near Ede roundabout…"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-neutral-50 focus:bg-white transition-all"
                        maxLength={150}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Describe the Issue <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Briefly describe what you see, e.g. large pothole on the left lane causing traffic…"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-neutral-50 focus:bg-white transition-all"
                      maxLength={500}
                    />
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Photo Evidence <span className="text-red-500">*</span> <span className="text-muted-foreground font-normal">(Required for AI verification)</span>
                    </label>

                    {preview ? (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <div className="relative w-full aspect-video">
                          <Image src={preview} alt="Preview" fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="px-3 py-1.5 border-t border-border bg-white/90">
                          <p className="text-xs text-muted-foreground truncate">{file?.name}</p>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer bg-neutral-50 hover:bg-primary/5 hover:border-primary/40 transition-all group">
                        <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                        <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          <span className="font-semibold">Click to upload</span> · JPG, PNG, WEBP
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          required
                          onChange={e => handleFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                  </div>

                  <Button type="submit" disabled={submitting || !landmark.trim() || !file} className="w-full h-11 font-semibold">
                    {submitting
                      ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Verifying & Submitting…</span>
                      : 'Submit Report'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

