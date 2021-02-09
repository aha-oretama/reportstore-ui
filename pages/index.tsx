import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import { useFetchUser } from '../hooks/useUser';
import React from 'react';

const Home: React.FunctionComponent = () => {
  const { user, loading } = useFetchUser();

  if (loading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {user ? (
        <section>
          <p>{user.name}</p>
          <p>
            (This is a sample website - you’ll be building a site like this on{' '}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>
      ) : null}
      <section>
        <h2>Top</h2>
      </section>
    </Layout>
  );
};

export default Home;
