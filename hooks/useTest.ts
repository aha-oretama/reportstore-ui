import useSWR from 'swr';
import fetcher from './fetcher';
import { GetTestsResponseType } from '../pages/api/tests';
import { GetTestResponseType } from '../pages/api/tests/[id]';

interface UseTestsReturnType {
  testsData: GetTestsResponseType;
  isLoading: boolean;
  isError: boolean;
}

interface UseTestReturnType {
  testData: GetTestResponseType;
  isLoading: boolean;
  isError: boolean;
}

export const useTests = (repositoryId: number): UseTestsReturnType => {
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

export const useTest = (id: string): UseTestReturnType => {
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
