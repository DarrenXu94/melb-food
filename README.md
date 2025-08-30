# Melbourne Food Reviews - Netlify Functions

This project provides Netlify functions for accessing Melbourne food review data from Notion.

## Functions

### 1. getCategories
**Endpoint:** `/.netlify/functions/getCategories` or `/api/getCategories`  
**Method:** GET  
**Description:** Retrieves all categories from the Notion database  
**Response:** Array of category objects with name, type, and options

### 2. getReview
**Endpoint:** `/.netlify/functions/getReview` or `/api/getReview`  
**Method:** GET  
**Query Parameters:** `pageId` (required) - The Notion page ID  
**Description:** Retrieves a single review as markdown from a Notion page  
**Response:** Object containing the review markdown

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

### Get Review
```bash
curl "https://your-site.netlify.app/.netlify/functions/getReview?pageId=your_page_id"
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
