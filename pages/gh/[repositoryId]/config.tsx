import { useRouter } from 'next/router';
import { useToken } from '../../../hooks/useToken';

const Config: React.FunctionComponent = () => {
  const router = useRouter();
  const { repositoryId } = router.query;
  const { data, isError, isLoading } = useToken(Number(repositoryId));

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return <>{data.token}</>;
};

export default Config;
