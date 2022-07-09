import fs from "fs";
import { AppConfig } from "../app.config";
import { Post } from "./post";
import { js2xml } from "xml-js";

export const generateSitemap = async (posts: Post[]) => {
  const e = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    urlset: {
      _attributes: {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      },
      url: [
        {
          loc: AppConfig.url,
          priority: 1.0,
          changefreq: "weekly",
          lastmod: new Date().toISOString().split("T")[0],
        },
        ...(await Promise.all(
          posts.map(async (post) => {
            return {
              loc: `${AppConfig.url}/posts/${post.slug}`,
              priority: 0.8,
              changefreq: "weekly",
              lastmod: post.date,
            };
          })
        )),
      ],
    },
  };

  const sitemap = js2xml(e, { compact: true });

  fs.writeFileSync("./public/sitemap.xml", sitemap);
};
