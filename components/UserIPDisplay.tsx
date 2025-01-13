import { useState, useEffect } from 'react';
import { Monitor, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GeoData {
  ip: string;
  country_code: string;
  country: string;
  city: string;
  flag: string;
}

export function UserIPDisplay() {
  const { t } = useLanguage();
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIP, setShowIP] = useState(false);

  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        // First get IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Try ipwhois.app first
        const response = await fetch(`https://ipwhois.app/json/${userIP}`);
        const data = await response.json();
        
        if (data.success) {
          // Get the flag emoji
          const flag = getFlagEmoji(data.country_code || 'XX');
          
          setGeoData({
            ip: userIP,
            country_code: data.country_code || 'XX',
            country: data.country || 'Unknown Country',
            city: data.city || 'Unknown City',
            flag: flag
          });
        } else {
          // Fallback to freegeoip.app
          const fallbackResponse = await fetch(`https://api.freegeoip.app/json/${userIP}`);
          const fallbackData = await fallbackResponse.json();
          
          const flag = getFlagEmoji(fallbackData.country_code || 'XX');
          
          setGeoData({
            ip: userIP,
            country_code: fallbackData.country_code || 'XX',
            country: fallbackData.country_name || 'Unknown Country',
            city: fallbackData.city || 'Unknown City',
            flag: flag
          });
        }
      } catch (error) {
        console.error('Error fetching IP info:', error);
        setGeoData({
          ip: 'Unknown',
          country_code: 'XX',
          country: 'Unknown Country',
          city: 'Unknown City',
          flag: '🌍'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIPInfo();
  }, []);

  // Function to convert country code to flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Function to mask part of the IP
  const maskIP = (ip: string) => {
    if (!showIP) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.***.***`;
      }
    }
    return ip;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Monitor className="h-6 w-6 text-green-500" />
          <span className="text-lg font-medium text-green-500">
            {t('yourInformation')}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : geoData ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="text-3xl">{geoData.flag}</div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {geoData.country}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({geoData.city})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  IP: {maskIP(geoData.ip)}
                </p>
                <button
                  onClick={() => setShowIP(!showIP)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                  title={showIP ? t('hideIP') : t('showIP')}
                >
                  {showIP ? (
                    <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          {t('errorLoadingIP')}
        </p>
      )}
    </div>
  );
}