import { useFetchUser } from '../hooks/useUser';
import Layout from '../components/layout';
import Head from 'next/head';
import { RepositoryList } from '../components/repository-list';

const GitHub = () => {
  const { user, loading } = useFetchUser();

  if (loading) return <div>loading...</div>;

  return (
    <Layout user={user} loading={loading}>
      <Head>
        <title>Projects - Testerve</title>
      </Head>
      <div className="p-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Projects
        </h1>
        <hr />
        <RepositoryList user={user} />
      </div>
    </Layout>
  );
};

export default GitHub;
