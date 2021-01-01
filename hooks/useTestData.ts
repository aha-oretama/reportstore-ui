import useSWR from 'swr';
import fetcher from './fetcher';
import { getTestData } from '../lib/tests';

export const useTestData = (id: string) => {
  const { data, error } = useSWR<ReturnType<typeof getTestData>>(
    `/api/tests/${id}`,
    fetcher
  );
  return {
    testData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
