import Layout from '../../components/layout';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useTestData } from '../../hooks/useTestData';
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  const { testData, isLoading, isError } = useTestData(id as string);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

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
