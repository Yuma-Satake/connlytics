import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkEmoji, { emoticon: true })
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify);

/**
 * Parse markdown string to HTML
 * @param markdown - The markdown string to parse
 * @returns The parsed HTML string
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  const result = await processor.process(markdown);
  return String(result);
};
