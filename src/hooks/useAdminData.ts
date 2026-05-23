import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export function useAdminData() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, critical: 0 });
    const [faults, setFaults] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
                try {
                    const q = query(collection(db, 'FaultReports'), orderBy('timestamp', 'desc'));
                    const snapshot = await getDocs(q);
                    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                    setFaults(reports);
                    
                    setStats({
                        total: reports.length,
                        resolved: reports.filter(r => r.status === 'Resolved' || r.status === 'Dispatched').length,
                        pending: reports.filter(r => r.status === 'Pending').length,
                        critical: reports.filter(r => r.urgencyScore >= 8).length,
                    });
                } catch (err) {
                    console.error("Error fetching stats:", err);
                }
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    return { user, loading, stats, faults };
}
