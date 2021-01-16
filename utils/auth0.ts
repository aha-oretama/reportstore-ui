import { initAuth0 } from '@auth0/nextjs-auth0';
import { AuthenticationClient, ManagementClient } from 'auth0';

const dataAuth0 = {
  domain: 'dev--testserve.us.auth0.com',
  clientId: '5bfuWDcCVQcXnEgP3BmYoKie0iqCTkxn',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
};

export default initAuth0({
  ...dataAuth0,
  audience: 'https://api.github.com',
  scope: 'openid profile read:user',
  redirectUri: 'http://localhost:3000/api/callback',
  postLogoutRedirectUri: 'http://localhost:3000/',
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: '9obqJtSf27Z6h4VRZN539pKGRlP7mux1',
    // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    cookieLifetime: 60 * 60 * 8,
    // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    cookieDomain: '',
    // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    cookieSameSite: 'lax',
    // (Optional) Store the id_token in the session. Defaults to false.
    storeIdToken: true,
    // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: true,
    // (Optional) Store the refresh_token in the session. Defaults to false.
    storeRefreshToken: true,
  },
  oidcClient: {
    // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
    httpTimeout: 2500,
    // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
    clockTolerance: 10000,
  },
});

export const getIdpToken = async (userId: string) => {
  const client = await getManagementClient();
  const { identities } = await client.getUser({ id: userId });
  return identities[0].access_token;
};

let managementClient: ManagementClient | undefined;
const getManagementClient = async () => {
  if (managementClient) {
    return managementClient;
  }

  const authenticationClient = new AuthenticationClient(dataAuth0);
  const tokenResponse = await authenticationClient.clientCredentialsGrant({
    audience: `https://${dataAuth0.domain}/api/v2/`,
    scope: 'read:users read:user_idp_tokens',
  });
  managementClient = new ManagementClient({
    domain: dataAuth0.domain,
    token: tokenResponse.access_token,
  });
  return managementClient;
};
