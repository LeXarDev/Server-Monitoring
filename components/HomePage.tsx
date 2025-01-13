import { ArrowRight, Server, Shield, Zap, Github, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/servers');
  };

  const features = [
    {
      icon: (
        <div className="transform transition-all duration-300 group-hover:scale-110">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full">
              <Server className="w-8 h-8 text-white transform rotate-3 animate-float" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      ),
      title: t('realTimeMonitoring'),
      desc: t('realTimeMonitoringDesc'),
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: (
        <div className="transform transition-all duration-300 group-hover:scale-110">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full">
              <div className="relative">
                <Shield className="w-8 h-8 text-white animate-pulse-slow" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-400/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="absolute -top-2 -left-2 w-full h-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-twinkle"></div>
            </div>
          </div>
        </div>
      ),
      title: t('secureAccess'),
      desc: t('secureAccessDesc'),
      color: 'bg-green-500/10 text-green-500'
    },
    {
      icon: (
        <div className="transform transition-all duration-300 group-hover:scale-110">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-full">
              <Zap className="w-8 h-8 text-white animate-float" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
              </div>
              <div className="absolute bottom-1 left-1">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      ),
      title: t('performance'),
      desc: t('performanceDesc'),
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">{t('title')}</span>
                  <span className="block text-blue-600 dark:text-blue-500 mt-3">
                    {t('welcome')}
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  {t('description')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      {t('getStarted')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {t('featuresTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group bg-white dark:bg-gray-900 p-8 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex justify-center">
                    <span className={`inline-flex rounded-lg transition-all duration-300 group-hover:bg-opacity-20`}>
                      {feature.icon}
                    </span>
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {t('joinCommunity')}
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-xl text-gray-500 dark:text-gray-400 mx-auto">
              {t('serversDescription')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.gg/your-invite-link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                <span className="text-sm sm:text-base">{t('discordCommunity')}</span>
              </a>
              <a
                href="https://github.com/your-username/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#24292e] hover:bg-[#1a1e22] transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Github className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                <span className="text-sm sm:text-base">{t('githubProject')}</span>
              </a>
              <a
                href="https://x.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black hover:bg-gray-900 transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="font-bold text-lg mr-2 rtl:ml-2 rtl:mr-0">X</span>
                <span className="text-sm sm:text-base">{t('followTwitter')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Made by Section */}
      <div className="py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'صُنع بواسطة ' : 'Made by '}
            </span>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 bg-clip-text text-transparent font-medium transition-all duration-300 hover:scale-110">
                {language === 'ar' ? 'خـالد' : 'Khalid'}
              </span>
              <svg 
                className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}