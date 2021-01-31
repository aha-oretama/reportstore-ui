import useSWR from 'swr';
import fetcher from './fetcher';
import { GetTestsResponseType } from '../pages/api/tests';
import { GetTestResponseType } from '../pages/api/tests/[id]';

export const useTests = (repositoryId: number) => {
  const { data, error } = useSWR<GetTestsResponseType>(
    `/api/tests?repositoryId=${repositoryId}`,
    fetcher
  );
  return {
    testsData: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useTest = (id: string) => {
  const { data, error } = useSWR<GetTestResponseType>(
    `/api/tests/${id}`,
    fetcher
  );
  return {
    testData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
