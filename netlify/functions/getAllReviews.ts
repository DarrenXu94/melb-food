import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "@notionhq/client";
import { getAllReviews } from "../../src/api/reviews";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Set CORS headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: "",
      };
    }

    // Check if it's a GET request
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Get environment variables
    const notionKey = process.env.NETLIFY_NOTION_KEY;
    const databaseId = process.env.NETLIFY_DATABASE_ID;

    if (!notionKey || !databaseId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Missing required environment variables",
        }),
      };
    }

    // Initialize Notion client
    const notion = new Client({ auth: notionKey });

    // Get all reviews
    const reviews = await getAllReviews(notion, databaseId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reviews }),
    };
  } catch (error) {
    console.error("Error in getAllReviews function:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
