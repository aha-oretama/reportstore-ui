import useSWR from 'swr';
import fetcher from './fetcher';

export const useIds = (repositoryId: number) => {
  const { data, error } = useSWR(
    `/api/ids?repositoryId=${repositoryId}`,
    fetcher
  );
  return {
    testsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
