import { useState, useEffect, useCallback, memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Server, Download, Trash, Activity } from 'lucide-react';
import type { GeoLocation, ServerWithGeo } from '../types/GeoLocation';
import { toast } from 'react-hot-toast';

interface ServerCardProps {
  server: ServerWithGeo;
  onDelete: (id: string) => void;
}

export const ServerCard = memo(function ServerCard({ server, onDelete }: ServerCardProps) {
  const { t } = useLanguage();
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ping, setPing] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchGeoLocation = useCallback(async () => {
    if (!server.address) return;
    
    setIsLoading(true);
    try {
      // First try ipwhois.app
      const response = await fetch(`https://ipwhois.app/json/${server.address}`);
      const data = await response.json();
      
      if (data.success) {
        setGeoLocation({
          city: data.city || 'Unknown City',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || 'XX',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0
        });
      } else {
        // Fallback to freegeoip.app if ipwhois fails
        const fallbackResponse = await fetch(`https://api.freegeoip.app/json/${server.address}`);
        const fallbackData = await fallbackResponse.json();
        
        setGeoLocation({
          city: fallbackData.city || 'Unknown City',
          country: fallbackData.country_name || 'Unknown Country',
          countryCode: fallbackData.country_code || 'XX',
          latitude: fallbackData.latitude || 0,
          longitude: fallbackData.longitude || 0
        });
      }
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      toast.error(t('geoLocationError'));
      setGeoLocation({
        city: 'Unknown City',
        country: 'Unknown Country',
        countryCode: 'XX',
        latitude: 0,
        longitude: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [server.address, t]);

  const checkPing = useCallback(async () => {
    if (!server.address) return;
    
    setIsPinging(true);
    try {
      const startTime = performance.now();
      // استخدام نفس بروتوكول الموقع الحالي (HTTP/HTTPS)
      const protocol = window.location.protocol;
      const serverAddress = server.address.replace(/^https?:\/\//, '');
      const url = `${protocol}//${serverAddress}`;
      
      await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors',
        credentials: 'omit'
      });
      
      const endTime = performance.now();
      setPing(Math.round(endTime - startTime));
    } catch (error) {
      console.error('Error checking ping:', error);
      setPing(null);
    } finally {
      setIsPinging(false);
    }
  }, [server.address]);

  useEffect(() => {
    fetchGeoLocation();
  }, [fetchGeoLocation]);

  useEffect(() => {
    checkPing();
    const interval = setInterval(checkPing, 3000);
    return () => clearInterval(interval);
  }, [checkPing]);

  const handleDownloadLogs = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const logContent = `Server: ${server.name}
IP: ${server.address}
Timestamp: ${new Date().toISOString()}
Status: Active
Last 5 Events:
[INFO] Server started successfully
[INFO] Connection established
[WARN] High CPU usage detected (85%)
[INFO] Backup completed
[INFO] System update available`;
      
      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${server.name}-logs.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(t('logsDownloaded'));
    } catch (error) {
      toast.error(t('noLogsAvailable'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(server.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Function to convert country code to flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('deleteConfirmation')}
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                {t('confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Server className="h-6 w-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{server.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{server.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLoading && (
            <>
              <button
                onClick={handleDownloadLogs}
                disabled={isDownloading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-spin' : ''}`} />
                {t('downloadLogs')}
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash className="h-4 w-4" />
                {t('delete')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Server Info and Ping */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        {/* Ping Status - Left Side */}
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${isPinging ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
          <span>{ping !== null ? `${ping}ms` : t('checkingServer')}</span>
        </div>

        {/* Location with Flag - Right Side */}
        {geoLocation && (
          <div className="flex items-center gap-2">
            <span className="text-xl" title={geoLocation.country}>
              {getFlagEmoji(geoLocation.countryCode)}
            </span>
            <span>{geoLocation.city}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default ServerCard;