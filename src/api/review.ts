import { NotionToMarkdown } from "notion-to-md";

export const getReview = async (notion, pageId) => {
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);

  return mdString.parent;
};
