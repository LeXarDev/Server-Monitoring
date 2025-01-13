import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

export function ChangePasswordForm() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error(t('loginRequired'));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('passwordsDoNotMatch'));
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error(t('passwordTooShort'));
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword(
                formData.currentPassword,
                formData.newPassword
            );
            
            toast.success(t('passwordChanged'));
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            console.error('Error changing password:', error);
            
            if (error.message === 'NEW_PASSWORD_REQUIREMENTS_NOT_MET') {
                toast.error(t('newPasswordRequirementsNotMet'));
            } else if (error.name === 'RateLimitError') {
                const seconds = error.retryAfter || 60;
                toast.error(t('retryIn').replace('{0}', seconds.toString()));
            } else if (error.name === 'AuthError') {
                switch (error.message) {
                    case 'SESSION_EXPIRED':
                        toast.error(t('sessionExpired'));
                        break;
                    case 'UNAUTHORIZED':
                        toast.error(t('unauthorized'));
                        break;
                    case 'INVALID_CREDENTIALS':
                        toast.error(t('invalidCredentials'));
                        break;
                    default:
                        toast.error(t('loginRequired'));
                }
            } else if (error.message === 'SERVER_ERROR') {
                toast.error(t('serverBusy'));
            } else {
                toast.error(error.message || t('passwordChangeError'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                {/* Current Password */}
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            {t('currentPassword')}
                        </label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                            placeholder={t('enterCurrentPassword')}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* New Password */}
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            {t('newPassword')}
                        </label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                            placeholder={t('enterNewPassword')}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            {t('confirmNewPassword')}
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                            placeholder={t('retypeNewPassword')}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? t('passwordChanging') : t('changePassword')}
                </button>
            </div>
        </form>
    );
}
