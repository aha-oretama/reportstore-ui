import useSWR from 'swr';
import fetcher from './fetcher';
import { FindByRepositoryIdReturnType } from '../lib/tokens';

interface UseIntegrationReturnType {
  data?: FindByRepositoryIdReturnType;
  isLoading: boolean;
  isError: boolean;
}

export const useIntegration = (
  repositoryId: number
): UseIntegrationReturnType => {
  const { data, error } = useSWR<FindByRepositoryIdReturnType>(
    `/api/tokens?repositoryId=${repositoryId}`,
    fetcher
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
