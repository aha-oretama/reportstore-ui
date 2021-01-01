import Layout from '../../components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { getAllTestIds, getTestData } from '../../lib/tests';

export default function Post({
  testData,
}: {
  testData: ReturnType<typeof getTestData>;
}) {
  return (
    <Layout>
      <Head>
        <title>{testData.id}</title>
      </Head>
      <h1 className={utilStyles.headingXl}>{testData.id}</h1>
      <div className={utilStyles.lightText}>{testData.time}</div>
      {testData.testsuites['@_name']}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllTestIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const testData = await getTestData(params.id);
  return {
    props: {
      testData,
    },
  };
};
