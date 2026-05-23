'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { Loader2, LogOut, Save } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
    const { user, loading } = useAdminData();
    const router = useRouter();
    const [name, setName] = useState('');

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user) return null;

    return (
        <div className="space-y-6 max-w-3xl">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-sm text-muted-foreground">Admin logged in as {user.email}</p>
                </div>
                <button onClick={async () => { await signOut(auth); router.push('/login'); }} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    <LogOut size={18} /> Sign Out
                </button>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-border">
                <h2 className="font-bold text-xl text-foreground mb-6">Profile Settings</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address (Read Only)</label>
                        <input 
                            type="email" 
                            disabled 
                            value={user.email || ''} 
                            className="w-full bg-neutral-100 border border-border rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Display Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Hon. Admin"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors mt-4">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
