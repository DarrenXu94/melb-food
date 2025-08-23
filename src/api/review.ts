import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

/**
 * Gets a review markdown string from a Notion page.
 * @param notion
 * @param pageId
 * @returns
 */
export const getReview = async (notion: Client, pageId: string) => {
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);

  return mdString.parent;
};
