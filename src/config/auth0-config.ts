export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN as string,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  authorizationParams: {
    redirect_uri: `${window.location.origin}/callback`,
    scope: 'openid profile email offline_access',
    audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`
  },
  cacheLocation: "localstorage" as const,
  useRefreshTokens: true,
  skipRedirectCallback: window.location.pathname === '/callback',
  // Add development mode flag
  development: true
};
