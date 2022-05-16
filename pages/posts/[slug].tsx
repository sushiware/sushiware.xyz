import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPostBySlug, getAllPosts, Post } from "../../lib/post";
import { markdownToHtml } from "../../lib/markdownToHtml";
import { Layout } from "../../components/Layout";
import { NextPage } from "next";

type Props = {
  post: Post;
  morePosts: Post[];
  preview?: boolean;
};

const Post: NextPage<Props> = ({ post, morePosts, preview }) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout title={post.title} date={post.date} description={post.summary}>
      <>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </>
    </Layout>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "content",
    "summary",
  ]);

  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths = async () => {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
