import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

/**
 * Gets a review markdown string from a Notion page
 * @param notion - The Notion client instance
 * @param pageId - The ID of the Notion page to convert to markdown
 * @returns Promise resolving to the markdown content as a string
 * @throws Error if the page conversion fails
 */
export const getReview = async (
  notion: Client,
  pageId: string
): Promise<string> => {
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);

  return mdString.parent;
};
