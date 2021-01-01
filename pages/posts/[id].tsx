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
      <h2 className={utilStyles.headingXl}>{testData.testsuites['@_name']}</h2>
      <div className={utilStyles.lightText}>{testData.time}</div>
      <ul>
        {testData.testsuites.testsuite.map((suite) => (
          <li key={suite['@_name']}>
            {suite['@_name']}
            <div className={utilStyles.lightText}>{suite['@_timestamp']}</div>
            <br />
            tests: {suite['@_tests']}
            <br />
            errors: {suite['@_errors']}
            <br />
            failures: {suite['@_failures']}
            <br />
            skipped: {suite['@_skipped']}
            <br />
            time: {suite['@_time']}
            <br />
            <ul>
              {suite.testcase.map((tcase) => (
                <li key={tcase['@_name']}>
                  {tcase['@_classname']} {tcase['@_name']}
                  <div className={utilStyles.lightText}>{tcase['@_time']}</div>
                  <br />
                  {tcase.failure ? `failure ${tcase.failure}` : null}
                  {tcase.skipped ? `skipped ${tcase.skipped}` : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
