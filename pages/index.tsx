import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getSortedTestsData } from '../lib/tests';

export default function Home({
  testsData,
}: {
  testsData: ReturnType<typeof getSortedTestsData>;
}) {
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
              <Link href={`/posts/${id}`}>
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

export const getStaticProps: GetStaticProps = async () => {
  const testsData = getSortedTestsData();
  return {
    props: {
      testsData,
    },
  };
};
