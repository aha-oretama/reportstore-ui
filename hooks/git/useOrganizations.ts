import useSWR from 'swr';
import fetcher from '../fetcher';

export const useOrganizations = (userId: string) => {
  const { data, error } = useSWR(
    `/api/git/organizations?userId=${userId}`,
    fetcher
  );
  return {
    orgs: data,
    isLoading: !error && !data,
    isError: error,
  };
};
