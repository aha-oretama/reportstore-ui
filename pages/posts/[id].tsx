import Layout from "../../components/layout";
import {GetStaticPaths, GetStaticProps} from "next";
import {getAllPostIds, getPostData} from "../../lib/posts";

export default function Post({postData}: {
  postData: {
    id: string
    date: string
    title: string
  }
}) {
  return (
    <Layout>
      {postData.title}
      <br/>
      {postData.id}
      <br/>
      {postData.date}
    </Layout>
  )
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const postData = getPostData(params.id);
  return {
    props: {
      postData
    }
  }
}
