import useSWR from 'swr';
import fetcher from './fetcher';
import { getSortedTestsData } from '../lib/tests';

export const useIds = () => {
  const { data, error } = useSWR<ReturnType<typeof getSortedTestsData>>(
    `/api/ids`,
    fetcher
  );
  return {
    testsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
