import { Client, PageObjectResponse } from "@notionhq/client";
import { ReviewDatabaseRow, Property } from "../types/notion";

/**
 * @param fileProperty - An array of file objects from a Notion page
 * @returns An array of URLs extracted from the file objects
 * @description This function extracts URLs from both file and external file types in Notion.
 * It handles both the `file` type (which contains a URL and expiry time) and the `external` type (which contains a URL).
 * If the property is not of these types, it returns an empty string.
 */
const getUrlsFromFiles = (
  fileProperty: Array<
    | {
        file: {
          url: string;
          expiry_time: string;
        };
        name: string;
        type?: "file";
      }
    | {
        external: {
          url: string;
        };
        name: string;
        type?: "external";
      }
  >
): string[] => {
  return fileProperty
    .map((file) => {
      if (file.type === "file" && file.file) {
        return file.file.url;
      } else if (file.type === "external" && file.external) {
        return file.external.url;
      }
      return "";
    })
    .filter((url) => url !== "");
};

/**
 * Extracts the value from a Notion property based on its type
 * @param property - The Notion property object
 * @returns The extracted value as string or string array
 */
const extractProperty = (property: any): string | string[] => {
  if (property.type === "rich_text") {
    return property.rich_text.map((text: any) => text.plain_text).join("");
  } else if (property.type === "select") {
    return property.select ? property.select.name : "";
  } else if (property.type === "multi_select") {
    return property.multi_select
      ? property.multi_select.map((option: any) => option.name)
      : [];
  } else if (property.type === "files") {
    return getUrlsFromFiles(property.files);
  } else if (property.type === "title") {
    return property.title.map((text: any) => text.plain_text).join("");
  }

  return "";
};

/**
 * Converts a Notion page block to a ReviewDatabaseRow object
 * @param block - The Notion page object
 * @returns A ReviewDatabaseRow object with extracted properties
 */
const notionBlockToObject = (block: PageObjectResponse): ReviewDatabaseRow => {
  return {
    id: block.id,
    created_time: block.created_time,
    properties: Object.keys(block.properties).map((propertyKey) => {
      const property = block.properties[propertyKey];
      return {
        name: propertyKey,
        type: property.type as Property["type"],
        value: extractProperty(property),
      };
    }),
  };
};

/**
 * Retrieves all reviews from a Notion database
 * @param notion - The Notion client instance
 * @param databaseId - The ID of the Notion database
 * @returns Promise resolving to an array of ReviewDatabaseRow objects
 * @throws Error if the database query fails
 */
export const getAllReviews = async (
  notion: Client,
  databaseId: string
): Promise<ReviewDatabaseRow[]> => {
  const database = await notion.databases.query({ database_id: databaseId });

  return database.results.map((block: PageObjectResponse) => {
    return notionBlockToObject(block);
  });
};
