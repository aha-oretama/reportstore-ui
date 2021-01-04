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
      <h2 className={utilStyles.headingXl}>{testData.name}</h2>
      <div className={utilStyles.lightText}>{testData.time}</div>
      <ul>
        {testData.suites.map((suite) => (
          <li key={suite.name}>
            {suite.name}
            <div className={utilStyles.lightText}>{suite.timestamp}</div>
            <br />
            tests: {suite.tests}
            <br />
            errors: {suite.errors}
            <br />
            failures: {suite.failures}
            <br />
            skipped: {suite.skipped}
            <br />
            time: {suite.time}
            <br />
            <ul>
              {suite.testcases.map((testcase) => (
                <li key={testcase.name}>
                  {testcase.classname} {testcase.name}
                  <div className={utilStyles.lightText}>{testcase.time}</div>
                  <br />
                  {testcase.failure ? `failure ${testcase.failure}` : null}
                  {testcase.skipped ? `skipped ${testcase.skipped}` : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
