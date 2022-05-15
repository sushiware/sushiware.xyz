import type { NextPage } from "next";
import Link from "next/link";
import type Post from "../types/post";
import { getAllPosts } from "../lib/post";
import { Layout } from "../components/Layout";

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
                <div className="mb-2">
                  <Link href={`/posts/${post.slug}`}>
                    <a className="text-2xl">📝 {post.title}</a>
                  </Link>
                </div>
                <p className="text-2xl">{post.summary}</p>
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

  return {
    props: { allPosts },
  };
};
