import { initAuth0 } from '@auth0/nextjs-auth0';
import { AuthenticationClient, ManagementClient } from 'auth0';
import IAuth0Settings from '@auth0/nextjs-auth0/dist/settings';

// Vercel's url doesn't include protocol
const getBaseUrl = () => {
  if (process.env.PUBLIC_URL.startsWith('http')) {
    return process.env.PUBLIC_URL;
  }
  return `https://${process.env.PUBLIC_URL}`;
};
const baseUrl = getBaseUrl();

const auth0Config: IAuth0Settings = {
  domain: 'dev--testserve.us.auth0.com',
  clientId: '5bfuWDcCVQcXnEgP3BmYoKie0iqCTkxn',
  clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
  audience: 'https://api.github.com',
  scope: 'openid profile repo',
  redirectUri: `${baseUrl}/api/callback`,
  postLogoutRedirectUri: `${baseUrl}/`,
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: process.env.AUTH_SESSION_COOKIE_SECRET as string,
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
};

const auth0 = initAuth0(auth0Config);
export default auth0;

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

  const authenticationClient = new AuthenticationClient(auth0Config);
  const tokenResponse = await authenticationClient.clientCredentialsGrant({
    audience: `https://${auth0Config.domain}/api/v2/`,
    scope: 'read:users read:user_idp_tokens',
  });
  managementClient = new ManagementClient({
    domain: auth0Config.domain,
    token: tokenResponse.access_token,
  });
  return managementClient;
};

export async function authServerSide(req, res) {
  // Here you can check authentication status directly before rendering the page,
  // however the page would be a serverless function, which is more expensive and
  // slower than a static page with client side authentication
  const session = await auth0.getSession(req);

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: '/api/login',
    });
    res.end();
    return;
  }

  return { props: { user: session.user } };
}
