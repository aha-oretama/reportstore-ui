import React from 'react';
import { useRouter } from 'next/router';
import { useTests } from '../../hooks/useTest';
import { useFetchUser } from '../../hooks/useUser';
import Layout from '../../components/layout';
import Head from 'next/head';
import { useRepository } from '../../hooks/git/useRepositories';
import moment from 'moment';

const GetRepositoryId: React.FunctionComponent = () => {
  const { user, loading } = useFetchUser();
  const router = useRouter();
  const { repositoryId } = router.query;

  const {
    repository,
    isError: isRepoError,
    isLoading: isRepoLoading,
  } = useRepository(user.sub, Number(repositoryId));
  const { testsData, isError, isLoading } = useTests(Number(repositoryId));
  if (isRepoError || isError) return <div>failed to load</div>;
  if (loading || isRepoLoading || isLoading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>{`${repository.full_name} - Testerve`}</title>
      </Head>
      <div className="p-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {repository.full_name}
        </h1>
        <hr />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {testsData.map((testData) => (
            <li key={testData.id}>
              <div className="block hover:bg-blue-50">
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
                            <p className="flex items-center text-sm font-light text-gray-500">
                              <time dateTime="2020-01-07">
                                {moment(testData.createdAt).format()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
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
              </div>
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

export default GetRepositoryId;
