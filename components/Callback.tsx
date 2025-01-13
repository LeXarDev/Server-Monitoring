import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Callback = () => {
  const { handleRedirectCallback, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthentication = async () => {
      if (isLoading) {
        return;
      }

      try {
        // Get the current URL parameters
        const params = new URLSearchParams(window.location.search);
        const hasAuthParams = params.has('code') && params.has('state');

        if (!hasAuthParams) {
          setError('Missing authentication parameters');
          navigate('/');
          return;
        }

        // Process the callback
        await handleRedirectCallback();
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, '/callback');
        
        // Navigate to profile page
        navigate('/profile');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        navigate('/');
      }
    };

    processAuthentication();
  }, [handleRedirectCallback, isLoading, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">خطأ في المصادقة: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">جاري تسجيل الدخول...</h2>
      </div>
    </div>
  );
};
