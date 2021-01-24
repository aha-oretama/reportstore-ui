import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Header } from './header';
import { UserProvider } from '../hooks/useUser';

export const siteTitle = 'Practice Next.js';

export default function Layout({
  children,
  home,
  user,
  loading = false,
}: {
  children: React.ReactNode;
  home?: boolean;
  user?: any;
  loading?: boolean;
}) {
  return (
    <UserProvider value={{ user, loading }}>
      <div>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta
            property="og:image"
            content={`https://og-image.now.sh/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Header />
        <main>{children}</main>
        {!home && (
          <div>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
    </UserProvider>
  );
}
