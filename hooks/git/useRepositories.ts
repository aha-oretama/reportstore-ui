import useSWR from 'swr';
import fetcher from '../fetcher';
import {
  ListUserReposResponse,
  RepoResponse,
} from '../../pages/api/git/repositories';

interface UserRepositoryReturnType {
  repository: RepoResponse;
  isLoading: boolean;
  isError: boolean;
}

interface UserRepositoriesReturnType {
  repositories: ListUserReposResponse;
  isLoading: boolean;
  isError: boolean;
}

export const useRepository = (
  userId: string,
  repositoryId: number
): UserRepositoryReturnType => {
  const { data, error } = useSWR<RepoResponse>(
    `/api/git/repositories?userId=${userId}&repositoryId=${repositoryId}`,
    fetcher
  );
  return {
    repository: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useRepositories = (userId: string): UserRepositoriesReturnType => {
  const { data, error } = useSWR<ListUserReposResponse>(
    `/api/git/repositories?userId=${userId}`,
    fetcher
  );
  return {
    repositories: data,
    isLoading: !error && !data,
    isError: error,
  };
};
