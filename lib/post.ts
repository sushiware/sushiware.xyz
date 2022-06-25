import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  content: string;
  summary: string;
};

const postsDirectory = join(process.cwd(), "_posts");

export const getPostSlugs = () => fs.readdirSync(postsDirectory);

export const getPostBySlug = (slug: string, fields: string[] = []) => {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (field == "summary") {
      items[field] = summary(content);
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
};

export const getAllPosts = (fields: string[] = []): Post[] => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts as Post[];
};

export const summary = (content: string) => {
  const first = content.split("\n").find((line) => line.trim() !== "") || "";

  const summary = first.lastIndexOf("。") !== -1 ? first.slice(0, -1) : first;

  return summary + "...";
};
