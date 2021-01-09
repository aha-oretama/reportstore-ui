import { AppProps } from 'next/app';
import '../styles/global.css';
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Auth0Provider
      domain="dev--testserve.us.auth0.com"
      clientId="o3cb19lTn5UddDUqd5RgpFaR5RwoCcXX"
      redirectUri="http://localhost:3000" //{window.location.origin}
    >
      <Component {...pageProps} />;
    </Auth0Provider>
  );
};

export default App;
