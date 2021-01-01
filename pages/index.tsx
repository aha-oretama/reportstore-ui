import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { useIds } from '../hooks/useIds';

export default function Home() {
  const { testsData, isError, isLoading } = useIds();

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {testsData.map(({ id, time }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/tests/${id}`}>
                <a>{id}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>{time}</small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
