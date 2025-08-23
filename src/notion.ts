import { Client } from "@notionhq/client";
import dotenv from "dotenv";

import { getCategories } from "./api/categories";
import { getReview } from "./api/review";
import { getAllReviews } from "./api/reviews";

dotenv.config();

const notion = new Client({ auth: process.env.NETLIFY_NOTION_KEY });

// getCategories(notion, process.env.NETLIFY_DATABASE_ID);

getAllReviews(notion, process.env.NETLIFY_DATABASE_ID).then((reviews) => {
  console.log(JSON.stringify(reviews, null, 2));
});

// getReview(notion, process.env.TESTING_PAGE_ID).then((review) => {
//   console.log(review);
// });
