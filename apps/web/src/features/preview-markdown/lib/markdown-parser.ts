import { shortnameToUnicode } from 'emoji-toolkit';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify);

/**
 * Parse markdown string to HTML
 * Converts emoji shortcodes (e.g., :smile:, :red_paper_lantern:) to Unicode emoji
 * @param markdown - The markdown string to parse
 * @returns The parsed HTML string
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  const markdownWithEmoji = shortnameToUnicode(markdown);
  const result = await processor.process(markdownWithEmoji);
  return String(result);
};
