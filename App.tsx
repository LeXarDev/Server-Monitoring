import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { ServerPage } from './components/ServerPage';
import { NotFound } from './components/NotFound';
import { Callback } from './components/Callback';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { language } = useLanguage();
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/servers" element={<ServerPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;