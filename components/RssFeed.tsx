import { FunctionComponent } from "react";
import Link from "next/link";

export const RssFeed: FunctionComponent = () => {
  return (
    <Link href="/rss/feed.xml">
      <a className="text-2xl">🌈</a>
    </Link>
  );
};
