import { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';

export const auth0Config: Auth0ClientOptions = {
  domain: 'dev-hz605rpb555cmja4.us.auth0.com',
  clientId: 'izrhFr96jkuyrWoqFcR00E4oDkq9jhuk',
  authorizationParams: {
    redirect_uri: `${window.location.origin}/callback`,
    audience: 'https://dev-hz605rpb555cmja4.us.auth0.com/api/v2/',
    scope: 'openid profile email',
    response_type: 'code',
  },
  cacheLocation: "localstorage",
  useRefreshTokens: true,
  useRefreshTokensFallback: true,
  sessionCheckExpiryDays: 1
};

const auth0Client = new Auth0Client(auth0Config);

export { auth0Client };