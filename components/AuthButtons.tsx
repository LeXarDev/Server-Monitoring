import { LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthButtonsProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function AuthButtons({ onLogin, onRegister }: AuthButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <button
        onClick={onLogin}
        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <LogIn className="w-4 h-4" />
        <span>{t('login')}</span>
      </button>
      <button
        onClick={onRegister}
        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        <span>{t('register')}</span>
      </button>
    </div>
  );
}
