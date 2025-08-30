import { Client } from "@notionhq/client";
import { Category } from "../types/notion";

/**
 * Retrieves all categories and their options from a Notion database
 * @param notion - The Notion client instance
 * @param databaseId - The ID of the Notion database
 * @returns Promise resolving to an array of Category objects
 * @throws Error if the database retrieval fails
 */
export const getCategories = async (
  notion: Client,
  databaseId: string
): Promise<Category[]> => {
  const db = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const properties = db.properties;
  const categories: Category[] = Object.keys(properties).reduce((acc, key) => {
    const property = properties[key];

    if (property.type === "select") {
      acc.push({
        name: key,
        type: "select",
        options: property.select?.options || [],
      });
    } else if (property.type === "multi_select") {
      acc.push({
        name: key,
        type: "multi_select",
        options: property.multi_select?.options || [],
      });
    }
    return acc;
  }, [] as Category[]);

  return categories;
};
