import useSWR from 'swr';
import fetcher from './fetcher';
import {
  GetSortedTestsDataReturnType,
  GetTestDataReturnType,
} from '../lib/tests';

interface UseTestsReturnType {
  testsData?: GetSortedTestsDataReturnType;
  isLoading: boolean;
  isError: boolean;
}

interface UseTestReturnType {
  testData?: GetTestDataReturnType;
  isLoading: boolean;
  isError: boolean;
}

export const useTests = (repositoryId: number): UseTestsReturnType => {
  const { data, error } = useSWR<GetSortedTestsDataReturnType>(
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
  const { data, error } = useSWR<GetTestDataReturnType>(
    `/api/tests/${id}`,
    fetcher
  );
  return {
    testData: data,
    isLoading: !error && !data,
    isError: error,
  };
};
