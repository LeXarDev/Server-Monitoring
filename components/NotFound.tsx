import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { MoveLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8 select-none">
          {/* Background Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[150px] font-black text-gray-100 dark:text-gray-800 animate-pulse">
              404
            </div>
          </div>
          
          {/* Foreground Number */}
          <div className="relative">
            <div className="text-[150px] font-black bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pageNotFound')}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('pageNotFoundDesc')}
        </p>

        {/* Return Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <MoveLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          {t('returnHome')}
        </button>

        {/* Decorative Dots */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
