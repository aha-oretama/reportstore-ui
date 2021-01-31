import { useRouter } from 'next/router';
import { useIntegration } from '../../../hooks/useIntegration';

const Config: React.FunctionComponent = () => {
  const router = useRouter();
  const { repositoryId } = router.query;
  const { data, isError, isLoading } = useIntegration(Number(repositoryId));

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return <span>{data.token}</span>;
};

export default Config;
