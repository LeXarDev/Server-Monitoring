import { type FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaGoogle, FaGithub } from 'react-icons/fa';

interface SSOButtonProps {
  provider: 'google' | 'github';
  className?: string;
}

export const SSOButton: FC<SSOButtonProps> = ({ provider, className = '' }) => {
  const { loginWithRedirect } = useAuth0();
  const { t } = useLanguage();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { 
          returnTo: '/profile'
        },
        authorizationParams: {
          connection: provider === 'google' ? 'google-oauth2' : 'github',
          redirect_uri: `${window.location.origin}/callback`,
          response_type: 'code',
          scope: 'openid profile email'
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const Icon = provider === 'google' ? FaGoogle : FaGithub;
  const text = provider === 'google' ? t('continueWithGoogle') : t('continueWithGithub');
  const bgColor = provider === 'google' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-900';

  return (
    <button
      onClick={handleLogin}
      className={`${bgColor} text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full mb-2 transition-colors duration-200 ${className}`}
    >
      <Icon className="text-xl" />
      <span>{text}</span>
    </button>
  );
};
