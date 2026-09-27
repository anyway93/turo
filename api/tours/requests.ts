import axios from "axios";
import { TOURS, tourReviewsUrl, tourUrl } from "../endpoints";
import type { IResponseOk } from "../types";
import type { CreateReviewInput, CreateTourInput, ToursQuery, UpdateTourInput } from "./request.type";
import type { IResponseReview, IResponseReviews, IResponseTour, IResponseTours } from "./response.type";

export const getTours = async (query: ToursQuery = {}) => {
  const res = await axios.get<IResponseTours>(TOURS, {
    params: {
      q: query.q,
      continent: query.continent,
      style: query.style,
      difficulty: query.difficulty,
      destination: query.destination,
      mine: query.mine ? "1" : undefined,
    },
  });
  return res.data;
};

export const getTour = async (slug: string) => {
  const res = await axios.get<IResponseTour>(tourUrl(slug));
  return res.data;
};

export const createTour = async (body: CreateTourInput) => {
  const res = await axios.post<IResponseTour>(TOURS, body);
  return res.data;
};

export const updateTour = async (slug: string, body: UpdateTourInput) => {
  const res = await axios.patch<IResponseTour>(tourUrl(slug), body);
  return res.data;
};

export const deleteTour = async (slug: string) => {
  const res = await axios.delete<IResponseOk>(tourUrl(slug));
  return res.data;
};

export const getTourReviews = async (slug: string) => {
  const res = await axios.get<IResponseReviews>(tourReviewsUrl(slug));
  return res.data;
};

export const createTourReview = async (slug: string, body: CreateReviewInput) => {
  const res = await axios.post<IResponseReview>(tourReviewsUrl(slug), body);
  return res.data;
};
