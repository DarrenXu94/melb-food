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

/**
 * A property from a Notion page
 */
export interface Property {
  /** The property name */
  name: string;
  /** The property type */
  type: "rich_text" | "select" | "multi_select";
  /** The property value - can be a single string or array of strings for multi-select */
  value: string | string[];
}

/**
 * A category definition from the Notion database
 */
export interface Category {
  /** The category name */
  name: string;
  /** The category type */
  type: "select" | "multi_select";
  /** Available options for this category */
  options: CategoryOption[];
}

/**
 * An option within a category
 */
export interface CategoryOption {
  /** The option name */
  name: string;
  /** The color associated with this option */
  color: string;
}

/**
 * API response for getAllReviews endpoint
 */
export interface GetAllReviewsResponse {
  /** Array of review entries */
  reviews: ReviewDatabaseRow[];
}

/**
 * API response for getReview endpoint
 */
export interface GetReviewResponse {
  /** The review content in markdown format */
  review: string;
}

/**
 * API response for getCategories endpoint
 */
export type GetCategoriesResponse = Category[];

/**
 * Error response structure
 */
export interface ErrorResponse {
  /** Error message */
  error: string;
  /** Detailed error message */
  message?: string;
}
