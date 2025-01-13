import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Auth0Provider } from '@auth0/auth0-react'
import type { AppState } from '@auth0/auth0-react'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <Auth0Provider
          domain="dev-hz605rpb555cmja4.us.auth0.com"
          clientId="izrhFr96jkuyrWoqFcR00E4oDkq9jhuk"
          authorizationParams={{
            redirect_uri: `${window.location.origin}/callback`,
            audience: "https://dev-hz605rpb555cmja4.us.auth0.com/api/v2/",
            scope: 'openid profile email',
            response_type: 'token id_token',
            prompt: 'login'
          }}
          useRefreshTokens={true}
          cacheLocation="localstorage"
          onRedirectCallback={(appState?: AppState) => {
            console.log('Auth0 redirect callback, appState:', appState);
            const targetUrl = appState?.returnTo || window.location.origin;
            window.location.replace(targetUrl);
          }}
        >
          <AuthProvider>
            <BrowserRouter>
              <App />
              <Toaster position="top-right" />
            </BrowserRouter>
          </AuthProvider>
        </Auth0Provider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
)