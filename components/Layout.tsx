import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Globe, Moon, Sun, LogOut, Key, X, UserIcon } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthButtonProps {
  isMobile?: boolean;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isMobile, onShowLogin, onShowRegister }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    setShowMenu(false);
    onShowLogin();
  };

  const handleRegisterClick = () => {
    setShowMenu(false);
    onShowRegister();
  };

  const handleLogoutClick = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <div className={`relative ${isMobile ? 'sm:hidden' : 'hidden sm:block'}`} ref={menuRef}>
      {!isAuthenticated ? (
        <>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="relative p-2.5 rounded-xl transition-all duration-500 hover:shadow-lg"
            aria-label={t('auth')}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-400 rounded-xl opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-400 rounded-xl opacity-75 hover:animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <Key className={`w-5 h-5 text-amber-700 transition-transform duration-700 ease-in-out ${showMenu ? 'rotate-12' : 'hover:rotate-12'}`} />
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t('login')}</span>
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t('register')}</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'} rtl:space-x-reverse`}>
          <Link to="/profile" className="relative group">
            <div className="relative">
              {user && (user.avatar_url || user.picture) ? (
                <img
                  src={user.avatar_url || user.picture}
                  alt={user.name || user.email}
                  className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800`}
                />
              ) : (
                <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center`}>
                  <UserIcon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-amber-700 dark:text-amber-400`} />
                </div>
              )}
            </div>
          </Link>
          <button
            onClick={handleLogoutClick}
            className={`flex items-center space-x-2 rtl:space-x-reverse ${
              isMobile 
                ? 'p-2 text-red-600 dark:text-red-400' 
                : 'px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors'
            }`}
          >
            <LogOut className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            {!isMobile && <span>{t('logout')}</span>}
          </button>
        </div>
      )}
    </div>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('serverMonitor')}
                </span>
              </Link>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
                aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="relative overflow-hidden p-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                aria-label={t('switchLanguage')}
              >
                <div className="relative flex items-center gap-2 transition-transform duration-500 group-hover:scale-105">
                  {language === 'en' ? (
                    <>
                      <img src="/flags/sa.svg" alt="Saudi Flag" className="w-5 h-5 rounded-sm shadow-sm" />
                      <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm tracking-wide">
                        العربية
                      </span>
                    </>
                  ) : (
                    <>
                      <img src="/flags/gb.svg" alt="UK Flag" className="w-5 h-5 rounded-sm shadow-sm" />
                      <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm tracking-wide">
                        English
                      </span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </button>

              {/* Auth Buttons */}
              <AuthButton
                onShowLogin={() => setShowLoginModal(true)}
                onShowRegister={() => setShowRegisterModal(true)}
              />
              <AuthButton
                isMobile
                onShowLogin={() => setShowLoginModal(true)}
                onShowRegister={() => setShowRegisterModal(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title={t('login')}
      >
        <LoginForm onClose={() => setShowLoginModal(false)} />
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title={t('register')}
      >
        <RegisterForm onClose={() => setShowRegisterModal(false)} />
      </Modal>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}