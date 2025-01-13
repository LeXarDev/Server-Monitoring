import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/useAuth';
import { AddServerForm } from './AddServerForm';
import { ServerCard } from './ServerCard';
import { Server, LogIn, Github, Twitter, MessageSquare } from 'lucide-react';
import type { ServerWithGeo } from '../types/GeoLocation';
import { serversService } from '../services/servers';
import { toast } from 'react-hot-toast';
import { UserIPDisplay } from './UserIPDisplay';
import { LoginForm } from './LoginForm';
import { ServerCardSkeleton } from './skeletons/ServerCardSkeleton';

export function ServerPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isInitialized } = useAuth();
  const [servers, setServers] = useState<ServerWithGeo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        setShowAuthModal(true);
      } else {
        loadServers();
      }
    }
  }, [isAuthenticated, isInitialized]);

  const loadServers = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await serversService.getServers();
      setServers(data);
    } catch (error) {
      console.error('Error loading servers:', error);
      toast.error(t('loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddServer = async (name: string, address: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);
      const newServer = await serversService.addServer(name, address);
      if (newServer) {
        setServers(prev => [...prev, newServer]);
        toast.success(t('serverAdded'));
      }
    } catch (error) {
      console.error('Error adding server:', error);
      toast.error(t('addError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveServer = async (id: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      await serversService.deleteServer(id);
      setServers(prev => prev.filter(server => server.id !== id));
      toast.success(t('serverDeleted'));
    } catch (error) {
      console.error('Error removing server:', error);
      toast.error(t('deleteError'));
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setShowLoginForm(true);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (showLoginForm) {
    return <LoginForm onClose={() => setShowLoginForm(false)} />;
  }

  if (showAuthModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
              <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              {t('authRequired')}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t('pleaseLogin')}
            </p>
            <div className="mt-4">
              <button
                onClick={handleAuthModalClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Server className="w-12 h-12 text-blue-500 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('serversManagement')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          {t('serversDescription')}
        </p>
      </div>

      {/* Add Server Form */}
      <AddServerForm onAdd={handleAddServer} />

      {/* User IP Display */}
      <UserIPDisplay />

      {/* Server List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show skeleton loading while data is being fetched
          Array.from({ length: 6 }).map((_, index) => (
            <ServerCardSkeleton key={index} />
          ))
        ) : servers.length === 0 ? (
          <div className="col-span-full">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              {t('noServers')}
            </p>
          </div>
        ) : (
          servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onDelete={() => handleRemoveServer(server.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
