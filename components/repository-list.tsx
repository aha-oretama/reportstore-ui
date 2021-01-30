import { useRepositories } from '../hooks/git/useRepositories';
import { UserProfile } from '../hooks/useUser';
import React from 'react';
import { ListUserReposResponse } from '../pages/api/git/repositories';
import { useRouter } from 'next/router';

type Props = {
  user: UserProfile;
};

export const RepositoryList: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();
  const { repositories, isLoading, isError } = useRepositories(user.sub);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleIntegrateClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    repository: ListUserReposResponse[number]
  ) => {
    e.preventDefault();
    fetch('/api/integrations', {
      method: 'post',
      body: JSON.stringify({ repositoryId: repository.id }),
    });
    router.push(`/gh/${repository.id}/config`);
  };

  return (
    <>
      <div className="bg-white pb-4 px-4 rounded-md w-full mt-8">
        <div className="w-full flex px-2 mt-2">
          <div className="w-full sm:w-96 inline-block relative ">
            <input
              type="button"
              name="search"
              className="leading-snug border border-gray-100 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg"
              placeholder="Search"
            />

            <div className="pointer-events-none absolute pl-3 inset-y-0 left-0 flex items-center px-2 text-gray-300">
              <svg
                className="fill-current h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 511.999 511.999"
              >
                <path d="M508.874 478.708L360.142 329.976c28.21-34.827 45.191-79.103 45.191-127.309C405.333 90.917 314.416 0 202.666 0S0 90.917 0 202.667s90.917 202.667 202.667 202.667c48.206 0 92.482-16.982 127.309-45.191l148.732 148.732c4.167 4.165 10.919 4.165 15.086 0l15.081-15.082c4.165-4.166 4.165-10.92-.001-15.085zM202.667 362.667c-88.229 0-160-71.771-160-160s71.771-160 160-160 160 71.771 160 160-71.771 160-160 160z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="rounded-lg text-sm font-medium text-gray-700 text-left bg-gray-100">
            <th className="px-4 py-2">Repository</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm font-normal text-gray-700">
          {repositories.map((repository) => (
            <tr
              key={repository.id}
              className="hover:bg-blue-50 border-b border-gray-200 py-10"
            >
              <td className="px-4 py-4">{repository.name}</td>
              <td className="px-4 py-4">
                <button
                  onClick={(e) => handleIntegrateClick(e, repository)}
                  className="bg-blue-600 text-gray-200  p-2 rounded  hover:bg-blue-500 hover:text-gray-100"
                >
                  Integrate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
