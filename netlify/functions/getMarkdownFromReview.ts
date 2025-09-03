import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "@notionhq/client";
import { getReview } from "../../src/api/review";

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

    // Get page ID from query parameters
    const pageId = event.queryStringParameters?.pageId;

    if (!pageId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing pageId query parameter",
        }),
      };
    }

    // Get environment variables
    const notionKey = process.env.NETLIFY_NOTION_KEY;

    if (!notionKey) {
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

    // Get review markdown
    const review = await getReview(notion, pageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ review }),
    };
  } catch (error) {
    console.error("Error in getMarkdownFromReview function:", error);
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
