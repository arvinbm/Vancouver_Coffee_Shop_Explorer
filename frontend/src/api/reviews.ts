// src/api/reviews.ts

import client from './client';

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  username: string;
  created_at: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export const getReviews = (shopId: number) =>
  client.get<Review[]>(`/shops/${shopId}/reviews`);

export const createReview = (shopId: number, data: CreateReviewPayload) =>
  client.post<Review>(`/shops/${shopId}/reviews`, data);

export const deleteReview = (shopId: number, reviewId: number) =>
  client.delete(`/shops/${shopId}/reviews/${reviewId}`);
