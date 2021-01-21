import { useRepositories } from '../hooks/git/useRepositories';
import { UserProfile } from '../hooks/useUser';
import React from 'react';

type Props = {
  user: UserProfile;
};

export const RepositoryList: React.FunctionComponent<Props> = ({ user }) => {
  const { repositories, isLoading, isError } = useRepositories(user.sub);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <ul>
      {repositories.map((repository) => (
        <li key={repository.id}>
          <span>{repository.private ? 'private' : 'public'}</span>{' '}
          <a href={repository.html_url}>{repository.name}</a>{' '}
          <button>Integrate</button>
        </li>
      ))}
    </ul>
  );
};
