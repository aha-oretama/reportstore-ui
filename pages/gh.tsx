import { useFetchUser } from '../hooks/useUser';
import Layout from '../components/layout';
import Head from 'next/head';
import { RepositoryList } from '../components/repository-list';
import { Title } from '../components/atoms/title';

const GitHub = () => {
  const { user, loading } = useFetchUser();

  if (loading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>Projects - Testerve</title>
      </Head>
      <Title title="Projects" />
      <RepositoryList user={user} />
    </Layout>
  );
};

export default GitHub;
