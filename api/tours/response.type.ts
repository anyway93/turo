import type { Review, Tour } from "@/models";

export interface IResponseTours {
  ok: true;
  tours: Tour[];
}

export interface IResponseTour {
  ok: true;
  tour: Tour;
}

export interface IResponseReviews {
  ok: true;
  reviews: Review[];
}

export interface IResponseReview {
  ok: true;
  review: Review;
}
