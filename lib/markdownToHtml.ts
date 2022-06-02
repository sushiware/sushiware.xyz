import { remark } from "remark";
import html from "remark-html";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

export const markdownToHtml = async (markdown: string) => {
  const result = await remark()
    .use(html)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
};
