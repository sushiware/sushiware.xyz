import fs from "fs";
import { Feed } from "feed";
import { AppConfig } from "../app.config";
import { getAllPosts, Post } from "./post";
import { markdownToHtml } from "./markdownToHtml";

export const generatedRssFeed = async (posts: Post[]) => {
  const baseUrl = AppConfig.url;
  const date = new Date();
  const author = {
    name: AppConfig.site_name,
    link: baseUrl,
  };

  const feed = new Feed({
    title: AppConfig.site_name,
    description: AppConfig.description,
    id: baseUrl,
    link: baseUrl,
    language: "ja",
    image: `${baseUrl}/ogp.png`,
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    updated: date,
    author: author,
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`,
    },
  });

  const postFeeds = await Promise.all(
    posts.map(async (post) => {
      const url = `${baseUrl}/${post.slug}`;
      return {
        title: post.title,
        description: post.summary,
        id: url,
        link: url,
        content: await markdownToHtml(post.content),
        date: new Date(post.date),
      };
    })
  );

  postFeeds.forEach((postFeed) => feed.addItem(postFeed));

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
};
