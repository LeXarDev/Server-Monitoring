import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Profile } from '../types';
import { authService } from '../services/auth';
import { User as UserIcon, Lock, Edit2, Mail, MapPin } from 'lucide-react';
import { ChangePasswordForm } from './ChangePasswordForm';
import { toast } from 'react-hot-toast';
import { ProfileSkeleton } from './skeletons/ProfileSkeleton';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const loadProfile = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      toast.error(t('profileLoadError'));
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading profile for user:', user.id);
      const response = await authService.getProfile(user.id);
      console.log('Profile loaded:', response);
      
      // تحديث الصورة في حالة المستخدم إذا كانت موجودة في الملف الشخصي
      if (response.avatar_url && response.avatar_url !== user.avatar_url) {
        updateUser({ avatar_url: response.avatar_url });
      }
      
      setProfile(response);
    } catch (err) {
      console.error('Error loading profile:', err);
      toast.error(t('profileLoadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSaveChanges = async () => {
    if (!editedProfile) return;

    try {
      setIsLoading(true);
      await authService.updateProfile(user!.id, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success(t('updateSuccess'));
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authService.updateProfileImage(user.id, formData);
      if (response.avatar_url) {
        // تحديث الصورة في كل من user وprofile
        const userData = {
          ...user,
          avatar_url: response.avatar_url
        };
        updateUser(userData);
        setProfile(prev => prev ? { ...prev, avatar_url: response.avatar_url } : null);
        toast.success(t('photoUpdateSuccess'));
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error(t('photoUpdateError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <UserIcon className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('pleaseLogin')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 sm:mb-4">{t('profileSettings')}</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('profileDescription')}</p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-8">
                {/* Profile Image */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="relative group">
                    <div 
                      className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden cursor-pointer"
                      onClick={handlePhotoClick}
                    >
                      {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : user && (user.avatar_url || user.picture) ? (
                        <img
                          src={user.avatar_url || user.picture}
                          alt={user.name || user.email}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
                      {t('personalInfo')}
                    </h2>
                  </div>
                  <div>
                    {!isEditing ? (
                      <button
                        onClick={handleEditClick}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full sm:w-auto justify-center"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        {t('editProfile')}
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 w-full sm:w-auto"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full sm:w-auto"
                        >
                          {t('saveChanges')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {profile && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Full Name */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="p-3 bg-blue-100/50 dark:bg-blue-900/50 rounded-xl">
                          <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-center sm:text-left">
                          {t('fullName')}
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={editedProfile?.full_name || ''}
                              onChange={(e) => handleInputChange('full_name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                              placeholder={t('enterFullName')}
                            />
                            <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-lg text-gray-900 dark:text-white text-center sm:text-left">
                              {profile.full_name || t('notSpecified')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="p-3 bg-amber-100/50 dark:bg-amber-900/50 rounded-xl">
                          <Mail className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-center sm:text-left">
                          {t('email')}
                        </label>
                        <div className="relative">
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-lg text-gray-900 dark:text-white text-center sm:text-left">
                              {user?.email || t('notSpecified')}
                            </p>
                          </div>
                          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="p-3 bg-green-100/50 dark:bg-green-900/50 rounded-xl">
                          <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-center sm:text-left">
                          {t('location')}
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={editedProfile?.location || ''}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                              placeholder={t('enterLocation')}
                            />
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-lg text-gray-900 dark:text-white text-center sm:text-left">
                              {profile.location || t('notSpecified')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('changePassword')}
                    </h2>
                  </div>
                </div>
                <ChangePasswordForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
