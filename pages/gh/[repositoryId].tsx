import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTests } from '../../hooks/useTest';

const GetRepositoryId: React.FunctionComponent = () => {
  const router = useRouter();
  const { repositoryId } = router.query;

  const { testsData, isError, isLoading } = useTests(Number(repositoryId));
  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <ul>
        {testsData.map(
          ({
            id,
            time,
            build: { repository_url, branch, commit_hash, build_url },
          }) => (
            <li key={id}>
              <Link href={`/gh/${repositoryId}/tests/${id}`}>
                <a>{id}</a>
              </Link>
              <br />
              <small>{time}</small>
              <br />
              <a href={repository_url}>{repository_url}</a>
              <br />
              {branch}
              <br />
              {commit_hash}
              <br />
              {build_url}
              <br />
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default GetRepositoryId;
