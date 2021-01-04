import useSWR from 'swr';
import fetcher from './fetcher';

export const useIds = () => {
  const { data, error } = useSWR(`/api/ids`, fetcher);
  return {
    testsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
