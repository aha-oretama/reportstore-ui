import { UserProfile } from '../hooks/useUser';
import Layout from '../components/layout';
import Head from 'next/head';
import { RepositoryList } from '../components/repository-list';
import { Title } from '../components/atoms/title';
import { authServerSide } from '../utils/auth0';
import { GetServerSideProps } from 'next';

interface Props {
  user: UserProfile;
}

const GitHub: React.FunctionComponent<Props> = ({ user }) => {
  return (
    <Layout user={user}>
      <Head>
        <title>Projects - Testerve</title>
      </Head>
      <Title title="Projects" />
      <RepositoryList user={user} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await authServerSide(context);
};

export default GitHub;
