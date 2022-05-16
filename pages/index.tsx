import type { NextPage } from "next";
import Link from "next/link";
import { getAllPosts, Post } from "../lib/post";
import { Layout } from "../components/Layout";
import { generatedRssFeed } from "../lib/rssFeed";

type Props = {
  allPosts: Post[];
};

const Home: NextPage<Props> = ({ allPosts }) => {
  return (
    <Layout>
      <>
        <ul>
          {allPosts.map((post) => {
            return (
              <li key={post.slug}>
                <div>
                  <Link href={`/posts/${post.slug}`}>
                    <a>📝 {post.title}</a>
                  </Link>
                </div>
                <p>{post.summary}</p>
              </li>
            );
          })}
        </ul>
      </>
    </Layout>
  );
};

export default Home;

export const getStaticProps = async () => {
  const allPosts = getAllPosts(["title", "date", "slug", "content", "summary"]);

  await generatedRssFeed(allPosts);

  return {
    props: { allPosts },
  };
};
