
const DB_NAME = 'OsunFixDB';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const REPORT_QUEUE_KEY = 'osunfix_report_queue';

// IndexedDB Helper for Photos
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => reject('IndexedDB error');
        request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(PHOTO_STORE)) {
                db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
            }
        };
    });
};

export const savePhotoOffline = async (id: string, file: File | Blob): Promise<boolean> => {
    try {
        const db = await openDB();
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE);

        await new Promise((resolve, reject) => {
            const request = store.put({ id, file, timestamp: Date.now() });
            request.onsuccess = () => resolve(undefined);
            request.onerror = reject;
        });
        return true;
    } catch (error) {
        console.error('Error saving photo offline:', error);
        return false;
    }
};

export const getPhotoOffline = async (id: string): Promise<Blob | null> => {
    try {
        const db = await openDB();
        const tx = db.transaction(PHOTO_STORE, 'readonly');
        const store = tx.objectStore(PHOTO_STORE);

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result ? request.result.file : null);
            request.onerror = reject;
        });
    } catch (error) {
        // console.error('Error retrieving photo offline:', error);
        return null;
    }
};

export const deletePhotoOffline = async (id: string): Promise<boolean> => {
    try {
        const db = await openDB();
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE);

        await new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(undefined);
            request.onerror = reject;
        });
        return true;
    } catch (error) {
        console.error('Error deleting photo offline:', error);
        return false;
    }
};

// LocalStorage Helper for Reports
export const getPendingReports = (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
        const queue = localStorage.getItem(REPORT_QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    } catch (error) {
        console.error('Error reading report queue:', error);
        return [];
    }
};

export const saveReportOffline = (report: any) => {
    if (typeof window === 'undefined') return;
    try {
        const queue = getPendingReports();
        queue.push({
            ...report,
            queuedAt: Date.now(),
            status: 'pending', // pending, syncing, failed
            retryCount: 0
        });
        localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
        console.error('Error saving report offline:', error);
    }
};

export const updateReportStatus = (id: string, status: string, error: string | null = null) => {
    if (typeof window === 'undefined') return;
    try {
        const queue = getPendingReports();
        const index = queue.findIndex((r: any) => r.id === id);
        if (index !== -1) {
            queue[index].status = status;
            if (error) queue[index].lastError = error;
            if (status === 'failed') queue[index].retryCount = (queue[index].retryCount || 0) + 1;
            localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(queue));
        }
    } catch (error) {
        console.error('Error updating report status:', error);
    }
};

export const removeReportFromQueue = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
        const queue = getPendingReports();
        const newQueue = queue.filter((r: any) => r.id !== id);
        localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(newQueue));
    } catch (error) {
        console.error('Error removing report from queue:', error);
    }
};

export const clearSyncQueue = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REPORT_QUEUE_KEY);
};
