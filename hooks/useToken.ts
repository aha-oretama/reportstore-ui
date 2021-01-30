import useSWR from 'swr';
import fetcher from './fetcher';
import { TokenResponseType } from '../pages/api/tokens';

export const useToken = (repositoryId: number) => {
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
