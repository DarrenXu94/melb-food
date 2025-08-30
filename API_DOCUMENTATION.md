# API Documentation

This project provides multiple ways to document and explore the API endpoints:

## 📋 Available Endpoints

### 1. `GET /.netlify/functions/getAllReviews`
Retrieves all reviews from the Notion database.

**Response:** `GetAllReviewsResponse`
```typescript
{
  reviews: ReviewDatabaseRow[]
}
```

### 2. `GET /.netlify/functions/getCategories`
Retrieves all categories and their options from the Notion database.

**Response:** `GetCategoriesResponse` (Category[])

### 3. `GET /.netlify/functions/getReview?pageId={id}`
Retrieves a specific review as markdown content from a Notion page.

**Parameters:**
- `pageId` (required): The Notion page ID

**Response:** `GetReviewResponse`
```typescript
{
  review: string // markdown content
}
```

## 📚 Documentation Options

### Option 1: OpenAPI Documentation (Recommended)

The project includes a complete OpenAPI specification in `openapi.yaml` that documents all endpoints with:
- Request/response schemas
- Example responses
- Error handling
- Type definitions

**To view the API documentation:**
```bash
npm run openapi:serve
```

**To validate the OpenAPI spec:**
```bash
npm run openapi:validate
```

### Option 2: TypeDoc Generated Documentation

Generate comprehensive TypeScript documentation from your source code:

**Generate docs:**
```bash
npm run docs:generate
```

**Serve the docs locally:**
```bash
npm run docs:serve
```

### Option 3: TypeScript Types

All API types are defined in `src/types/notion.ts` with JSDoc comments:

```typescript
/**
 * A review entry from the Notion database
 */
export interface ReviewDatabaseRow {
  /** The Notion page ID */
  id: string;
  /** When the review was created */
  created_time: string;
  /** Array of properties from the Notion page */
  properties: Property[];
}
```

## 🔧 Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate TypeDoc documentation:**
   ```bash
   npm run docs:generate
   ```

3. **View Swagger UI:**
   ```bash
   npm run openapi:serve
   ```

4. **View TypeDoc documentation:**
   ```bash
   npm run docs:serve
   ```

## 📖 Type Definitions

### Core Types

- `ReviewDatabaseRow`: A review entry from the Notion database
- `Property`: A property from a Notion page
- `Category`: A category definition from the Notion database
- `CategoryOption`: An option within a category

### API Response Types

- `GetAllReviewsResponse`: Response for getAllReviews endpoint
- `GetReviewResponse`: Response for getReview endpoint
- `GetCategoriesResponse`: Response for getCategories endpoint
- `ErrorResponse`: Error response structure

## 🌐 API Base URLs

- **Production:** `https://your-netlify-site.netlify.app/.netlify/functions`
- **Local Development:** `http://localhost:8888/.netlify/functions`

## 🔍 Example Usage

### Get All Reviews
```bash
curl "https://your-netlify-site.netlify.app/.netlify/functions/getAllReviews"
```

### Get Categories
```bash
curl "https://your-netlify-site.netlify.app/.netlify/functions/getCategories"
```

### Get Specific Review
```bash
curl "https://your-netlify-site.netlify.app/.netlify/functions/getReview?pageId=12345678-1234-1234-1234-123456789012"
```

## 🛠️ Development

The API functions are located in:
- `src/api/`: Core API logic
- `netlify/functions/`: Netlify serverless functions
- `src/types/`: TypeScript type definitions

All functions include comprehensive JSDoc comments for better IDE support and documentation generation.
