import React, { useState, useCallback, memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Server, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const isValidIPAddress = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

interface AddServerFormProps {
  onAdd: (name: string, address: string) => void;
}

const AddServerForm = memo(function AddServerForm({ onAdd }: AddServerFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      toast.error(t('fillAllFields'));
      return;
    }

    if (!isValidIPAddress(address)) {
      setAddressError(t('invalidIPAddress'));
      toast.error(t('invalidIPAddress'));
      return;
    }

    onAdd(name, address);
    setName('');
    setAddress('');
    setAddressError('');
    toast.success(t('serverAdded'));
  }, [name, address, onAdd, t]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value && !isValidIPAddress(value)) {
      setAddressError(t('invalidIPAddress'));
    } else {
      setAddressError('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6 flex-shrink-0 text-blue-500 dark:text-blue-400" />
          <div className="min-w-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('addNewServer')}
            </h3>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('serverName')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Server className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder={t('enterServerName')}
            />
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="address" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('serverAddress')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              className={`block w-full pl-10 pr-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border ${addressError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors`}
              placeholder="192.168.1.1"
            />
          </div>
          {addressError && (
            <p className="mt-1 text-sm text-red-500">
              {addressError}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Plus className="w-5 h-5" />
          {t('addServer')}
        </button>
      </form>
    </div>
  );
});

export { AddServerForm };