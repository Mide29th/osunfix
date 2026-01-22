
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [connectionType, setConnectionType] = useState(getConnectionType());

    function getConnectionType() {
        if (typeof navigator === 'undefined') return 'unknown';
        // @ts-ignore - Navigator.connection is experimental
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection ? connection.effectiveType : 'unknown';
    }

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
            setConnectionType(getConnectionType());
        };

        const handleConnectionChange = () => {
            setConnectionType(getConnectionType());
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // @ts-ignore
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', handleConnectionChange);
        }

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
            if (connection) {
                connection.removeEventListener('change', handleConnectionChange);
            }
        };
    }, []);

    // 4G check is best effort
    const isHighSpeed = isOnline && (connectionType === '4g' || connectionType === 'wifi' || connectionType === 'unknown'); // Treat unknown as potentially fast enough to try

    return { isOnline, connectionType, isHighSpeed };
}
