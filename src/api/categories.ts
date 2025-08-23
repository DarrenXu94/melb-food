import { Client } from "@notionhq/client";

export const getCategories = async (notion: Client, databaseId: string) => {
  const db = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const properties = db.properties;
  const categories = Object.keys(properties).reduce((acc, key) => {
    if (properties[key].type === "select") {
      acc.push({
        name: key,
        type: properties[key].type,
        options: properties[key].select.options || [],
      });
    } else if (properties[key].type === "multi_select") {
      acc.push({
        name: key,
        type: properties[key].type,
        options: properties[key].multi_select.options || [],
      });
    }
    return acc;
  }, []);

  return categories;
};
