import { Client, PageObjectResponse } from "@notionhq/client";
import { ReviewDatabaseRow } from "../types/notion";

const extractProperty = (property) => {
  if (property.type === "rich_text") {
    return property.rich_text.map((text) => text.plain_text).join("");
  } else if (property.type === "select") {
    return property.select ? property.select.name : "";
  } else if (property.type === "multi_select") {
    return property.multi_select
      ? property.multi_select.map((option) => option.name)
      : "";
  }
  return "";
};

const notionBlockToObject = (block: PageObjectResponse): ReviewDatabaseRow => {
  return {
    id: block.id,
    created_time: block.created_time,
    properties: Object.keys(block.properties).map((property) => {
      return {
        name: property,
        type: block.properties[property].type,
        value: extractProperty(block.properties[property]),
      };
    }),
  };
};

export const getAllReviews = async (
  notion: Client,
  databaseId: string
): Promise<ReviewDatabaseRow[]> => {
  const database = await notion.databases.query({ database_id: databaseId });

  return database.results.map((block: PageObjectResponse) => {
    return notionBlockToObject(block);
  });
};
