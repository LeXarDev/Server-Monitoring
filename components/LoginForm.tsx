import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { authService } from '../services/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock } from 'lucide-react';
import { SSOButton } from './SSOButton';
import { Confetti } from './ui/Confetti';

interface LoginFormProps {
  onClose: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError(t('allFieldsRequired'));
      setIsLoading(false);
      return;
    }

    try {
      console.log('=== Login Form Submit ===');
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      if (response.token) {
        setShowConfetti(true); // تفعيل المفرقعات
        login({ token: response.token, user: response.user });
        // تأخير إغلاق النموذج لمشاهدة المفرقعات
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.startsWith('RETRY_AFTER_')) {
        const seconds = parseInt(error.message.split('_')[2]);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
          setError(t('pleaseWaitMinutes', { minutes, seconds: remainingSeconds }));
        } else {
          setError(t('pleaseWaitSeconds', { seconds }));
        }
      } else if (error.message === 'TOO_MANY_ATTEMPTS') {
        setError(t('tooManyAttempts'));
      } else if (error.message === 'INVALID_CREDENTIALS') {
        setError(t('invalidCredentials'));
      } else {
        setError(t('loginError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Confetti isActive={showConfetti} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('enterEmail')}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('enterPassword')}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('loggingIn') : t('login')}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t('orContinueWith')}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <SSOButton provider="google" />
          <SSOButton provider="github" />
        </div>
      </div>
    </div>
  );
}
