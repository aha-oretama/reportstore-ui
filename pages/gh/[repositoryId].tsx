import React from 'react';
import { useRouter } from 'next/router';
import { useTests } from '../../hooks/useTest';
import { UserProfile } from '../../hooks/useUser';
import Layout from '../../components/layout';
import Head from 'next/head';
import { useRepository } from '../../hooks/git/useRepositories';
import moment from 'moment';
import Link from 'next/link';
import { Title } from '../../components/atoms/title';
import { authServerSide } from '../../utils/auth0';

interface Props {
  user: UserProfile;
}

const GetRepositoryId: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();
  const { repositoryId } = router.query;

  const {
    repository,
    isError: isRepoError,
    isLoading: isRepoLoading,
  } = useRepository(user.sub, Number(repositoryId));
  const { testsData, isError, isLoading } = useTests(Number(repositoryId));
  if (isRepoError || isError) return <div>failed to load</div>;
  if (isRepoLoading || isLoading) return <div>loading...</div>;

  return (
    <Layout user={user}>
      <Head>
        <title>{`${repository.full_name} - Testerve`}</title>
      </Head>
      <Title title={repository.full_name} />
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {testsData.map((testData) => (
            <li key={testData.id}>
              <Link href={`/gh/${repositoryId}/tests/${testData.id}`}>
                <a className="block hover:bg-blue-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex justify-start">
                        {/* FIXME: commit user should be show */}
                        <img
                          src={repository.owner.avatar_url}
                          alt="My profile icon"
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="px-2 py-0.5 sm:px-6">
                          <p className="text-gray-700 truncate">
                            {testData.name}
                          </p>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm font-light text-gray-500 justify-between">
                                <time className="mr-2" dateTime="2020-01-07">
                                  {moment(testData.createdAt).format()}
                                </time>
                                <div className="flex items-center">
                                  <svg
                                    className="mr-0.5 stroke-current text-gray-500"
                                    fill="none"
                                    height="12"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="12"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  {testData.time}
                                </div>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center">
                        <span className="mr-2">
                          {`${
                            testData.tests - testData.failures + testData.errors
                          }/${testData.tests}`}
                        </span>
                        {testData.errors > 0 || testData.failures > 0 ? (
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failure
                          </p>
                        ) : (
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Success
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inline-flex items-center m-4 px-4 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View All
        </button>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  return await authServerSide(req, res);
}

export default GetRepositoryId;
