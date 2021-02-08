import useSWR from 'swr';
import fetcher from './fetcher';
import { TokenResponseType } from '../pages/api/tokens';

interface UseIntegrationReturnType {
  data: TokenResponseType,
  isLoading: boolean,
  isError: boolean
}

export const useIntegration = (repositoryId: number): UseIntegrationReturnType => {
  const { data, error } = useSWR<TokenResponseType>(
    `/api/tokens?repositoryId=${repositoryId}`,
    fetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
