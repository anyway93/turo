import { asiaReviews } from "./asia";
import { europeReviews } from "./europe";
import { restReviews } from "./rest";
import type { Review } from "../types";

export const reviews: Review[] = [
  ...europeReviews,
  ...asiaReviews,
  ...restReviews,
];

export function reviewsForTour(slug: string) {
  return reviews.filter((review) => review.tourSlug === slug);
}
