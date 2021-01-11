import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { useIds } from '../hooks/useIds';
import { useFetchUser } from '../hooks/useUser';

export default function Home() {
  const { testsData, isError, isLoading } = useIds();
  const { user, loading } = useFetchUser();

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {user ? (
        <section className={utilStyles.headingMd}>
          <p>{user.name}</p>
          <p>
            (This is a sample website - you’ll be building a site like this on{' '}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>
      ) : null}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {testsData.map(
            ({
              id,
              time,
              build: { repository_url, branch, commit_hash, build_url },
            }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/tests/${id}`}>
                  <a>{id}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>{time}</small>
                <br />
                <a href={repository_url}>{repository_url}</a>
                <br />
                {branch}
                <br />
                {commit_hash}
                <br />
                {build_url}
                <br />
              </li>
            )
          )}
        </ul>
      </section>
    </Layout>
  );
}
