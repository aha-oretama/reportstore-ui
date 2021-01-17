import useSWR from 'swr';
import fetcher from '../fetcher';

export const useRepositories = (userId: string) => {
  const { data, error } = useSWR(
    `/api/git/repositories?userId=${userId}`,
    fetcher
  );
  return {
    repositories: data,
    isLoading: !error && !data,
    isError: error,
  };
};
