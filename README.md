# Melbourne Food Reviews - Netlify Functions

This project provides Netlify functions for accessing Melbourne food review data from Notion.

## Functions

### 1. getCategories
**Endpoint:** `/.netlify/functions/getCategories` or `/api/getCategories`  
**Method:** GET  
**Description:** Retrieves all categories from the Notion database  
**Response:** Array of category objects with name, type, and options

### 2. getMarkdownFromReview
**Endpoint:** `/.netlify/functions/getMarkdownFromReview` or `/api/getMarkdownFromReview`  
**Method:** GET  
**Query Parameters:** `pageId` (required) - The Notion page ID  
**Description:** Retrieves a review as markdown from a Notion page ID  
**Response:** String of review markdown

### 3. getAllReviews
**Endpoint:** `/.netlify/functions/getAllReviews` or `/api/getAllReviews`  
**Method:** GET  
**Description:** Retrieves all reviews from the Notion database  
**Response:** Object containing an array of review objects

## Environment Variables

Make sure to set these environment variables in your Netlify dashboard:

- `NETLIFY_NOTION_KEY` - Your Notion API integration key
- `NETLIFY_DATABASE_ID` - The ID of your Notion database

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your environment variables:
   ```
   NETLIFY_NOTION_KEY=your_notion_key_here
   NETLIFY_DATABASE_ID=your_database_id_here
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Test locally with Netlify CLI:
   ```bash
   npx netlify dev
   ```

## API Usage Examples

### Get Categories
```bash
curl https://your-site.netlify.app/.netlify/functions/getCategories
```

### Get Review Markdown
```bash
curl "https://your-site.netlify.app/.netlify/functions/getMarkdownFromReview?pageId=your_page_id"
```

### Get All Reviews
```bash
curl https://your-site.netlify.app/.netlify/functions/getAllReviews
```

## CORS

All functions include CORS headers and support preflight OPTIONS requests for cross-origin access.

## Error Handling

Functions return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing parameters)
- `405` - Method Not Allowed
- `500` - Internal Server Error

Error responses include an `error` field and optional `message` field for debugging.

## 📚 API Documentation

For comprehensive API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Available Documentation:
- **OpenAPI Specification**: `openapi.yaml` - Complete API schema with examples
- **TypeDoc Documentation**: Generated from TypeScript source code
- **Interactive Documentation**: View with `npm run openapi:serve`

## 🛠️ Creating New Endpoints

To add a new API endpoint, follow these steps:

### Step 1: Create API Logic
Create a new file in `src/api/` (e.g., `src/api/newEndpoint.ts`):

```typescript
import { Client } from "@notionhq/client";
import { YourResponseType } from "../types/notion";

/**
 * Description of what this function does
 * @param notion - The Notion client instance
 * @param param1 - Description of parameter
 * @returns Promise resolving to response type
 */
export const yourNewFunction = async (
  notion: Client,
  param1: string
): Promise<YourResponseType> => {
  // Your API logic here
  const result = await notion.someMethod({ /* params */ });
  
  return {
    // Transform and return data
  };
};
```

### Step 2: Create Netlify Function
Create a new file in `netlify/functions/` (e.g., `netlify/functions/newEndpoint.ts`):

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "@notionhq/client";
import { yourNewFunction } from "../../src/api/newEndpoint";

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
      return { statusCode: 200, headers, body: "" };
    }

    // Check HTTP method
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Get parameters (query params, path params, etc.)
    const param1 = event.queryStringParameters?.param1;
    // const param2 = event.pathParameters?.param2; // For path parameters

    if (!param1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required parameter" }),
      };
    }

    // Get environment variables
    const notionKey = process.env.NETLIFY_NOTION_KEY;
    if (!notionKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Missing environment variables" }),
      };
    }

    // Initialize Notion client and call your function
    const notion = new Client({ auth: notionKey });
    const result = await yourNewFunction(notion, param1);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error in newEndpoint function:", error);
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
```

### Step 3: Update TypeScript Types (if needed)
Add new response types to `src/types/notion.ts`:

```typescript
/**
 * API response for newEndpoint
 */
export interface NewEndpointResponse {
  /** Description of the response */
  data: SomeDataType[];
}
```

### Step 4: Update OpenAPI Specification
Add the new endpoint to `openapi.yaml`:

```yaml
  /newEndpoint:
    get:
      summary: Description of the endpoint
      description: Detailed description of what this endpoint does
      operationId: newEndpoint
      parameters:
        - name: param1
          in: query
          required: true
          description: Description of the parameter
          schema:
            type: string
            example: "example_value"
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/NewEndpointResponse"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "500":
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
```

### Step 5: Update Netlify Configuration (if needed)
For path parameters, add redirects to `netlify.toml`:

```toml
[[redirects]]
  from = "/api/newEndpoint/*"
  to = "/.netlify/functions/newEndpoint"
  status = 200
```

### Step 6: Test and Validate
```bash
# Validate OpenAPI spec
npm run openapi:validate

# Generate updated documentation
npm run docs:generate

# Test locally
npx netlify dev
```

## 📖 Documentation Commands

```bash
# Generate TypeDoc documentation
npm run docs:generate

# Serve TypeDoc documentation locally
npm run docs:serve

# Validate OpenAPI specification
npm run openapi:validate

# Preview OpenAPI documentation
npm run openapi:serve
```
