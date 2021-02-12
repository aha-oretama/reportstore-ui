import Layout from '../../../../components/layout';
import Head from 'next/head';
import { useTest } from '../../../../hooks/useTest';
import { useRouter } from 'next/router';
import React from 'react';
import { Title } from '../../../../components/molecule/title';
import { UserProfile } from '../../../../hooks/useUser';
import { authServerSide } from '../../../../utils/auth0';
import { GetServerSideProps } from 'next';
import moment from 'moment';
import { TimeIcon } from '../../../../components/atoms/timeIcon';
import { StatusIcon } from '../../../../components/molecule/statusIcon';
import { Suite } from '../../../../models';

interface Props {
  user: UserProfile;
}

const SuiteList: React.FunctionComponent<{ suites: Suite[] }> = ({
  suites,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {suites.map((suite) => (
          <li key={suite.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="px-2 py-0.5 sm:px-6">
                  <p className="text-gray-700 truncate">{suite.name}</p>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm font-light text-gray-500 justify-between">
                        <time className="mr-2" dateTime="2020-01-07">
                          {moment(suite.timestamp).format()}
                        </time>
                        <div className="flex items-center">
                          <TimeIcon />
                          {suite.time}
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex items-center">
                  <span className="mr-2">
                    {`${suite.tests - (suite.failures + suite.errors)}/${
                      suite.tests
                    }`}
                  </span>
                  <StatusIcon
                    failure={suite.errors > 0 || suite.failures > 0}
                    skipped={suite.skipped > 0}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GetTestId: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  const { testData, isLoading, isError } = useTest(id as string);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <Layout user={user}>
      <Head>
        <title>{testData.name}</title>
      </Head>
      <Title title={`${testData.name} ${testData.time}`} />
      <div className="divide-x divide-black md:flex md:justify-between">
        <div className="flex-shrink-0">
          <SuiteList suites={testData.suites} />
        </div>
        <div className="flex-grow invisible md:visible">
          <SuiteList suites={testData.suites} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await authServerSide(context);
};

export default GetTestId;
