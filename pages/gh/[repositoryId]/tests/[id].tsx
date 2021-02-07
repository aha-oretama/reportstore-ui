import Layout from '../../../../components/layout';
import Head from 'next/head';
import { useTest } from '../../../../hooks/useTest';
import { useRouter } from 'next/router';
import React from 'react';
import { Title } from '../../../../components/atoms/title';
import { useFetchUser } from '../../../../hooks/useUser';

export default function Post() {
  const router = useRouter();
  const { user, loading } = useFetchUser();
  const { id } = router.query;
  const { testData, isLoading, isError } = useTest(id as string);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>{testData.name}</title>
      </Head>
      <Title title={testData.name} />
      <div>{testData.time}</div>
      <ul>
        {testData.suites.map((suite) => (
          <li key={suite.name}>
            {suite.name}
            <div>{suite.timestamp}</div>
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
                  <div>{testcase.time}</div>
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
