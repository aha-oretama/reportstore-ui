import useSWR from 'swr';
import fetcher from './fetcher';

export const useTestData = (id: string) => {
  const { data, error } = useSWR(`/api/tests/${id}`, fetcher);
  return {
    testData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
