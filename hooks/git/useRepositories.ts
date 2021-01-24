import useSWR from 'swr';
import fetcher from '../fetcher';
import { ListUserReposResponse } from '../../pages/api/git/repositories';

export const useRepositories = (userId: string) => {
  const { data, error } = useSWR<ListUserReposResponse>(
    `/api/git/repositories?userId=${userId}`,
    fetcher
  );
  return {
    repositories: data,
    isLoading: !error && !data,
    isError: error,
  };
};
