
import { supabase } from './supabaseClient';
import {
    getPendingReports,
    updateReportStatus,
    removeReportFromQueue,
    getPhotoOffline,
    deletePhotoOffline
} from './offlineStorage';

export const syncPendingReports = async (onProgress: (count: number, total: number) => void = (c, t) => { }) => {
    const queue = getPendingReports().filter((r: any) => r.status !== 'syncing');
    if (queue.length === 0) return { success: 0, failed: 0 };

    let successCount = 0;
    let failCount = 0;
    const total = queue.length;

    for (let i = 0; i < total; i++) {
        const report = queue[i];
        updateReportStatus(report.id, 'syncing');
        onProgress(i + 1, total);

        try {
            let photoUrl = '';

            // 1. Upload Photo if exists
            if (report.photoId) {
                const photoBlob = await getPhotoOffline(report.photoId);
                if (photoBlob) {
                    const fileName = `${report.photoId}_${Math.random().toString(36).substring(7)}.jpg`;
                    const filePath = `fault-reports/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('fault-reports')
                        // @ts-ignore - Supabase type mismatch in some versions
                        .upload(filePath, photoBlob);

                    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
                    photoUrl = filePath;
                }
            }

            // 2. Insert Report to DB
            const { error: dbError } = await supabase
                .from('FaultReports')
                .insert([{
                    asset_id: report.asset_id,
                    fault_type: report.fault_type,
                    photo_url: photoUrl,
                    created_at: report.created_at, // Use original creation time
                    synced_at: new Date()
                }]);

            if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);

            // 3. Cleanup
            removeReportFromQueue(report.id);
            if (report.photoId) {
                await deletePhotoOffline(report.photoId);
            }
            successCount++;

        } catch (error: any) {
            console.error(`Sync failed for report ${report.id}:`, error);
            updateReportStatus(report.id, 'failed', error.message || 'Unknown error');
            failCount++;
        }
    }

    return { success: successCount, failed: failCount };
};
