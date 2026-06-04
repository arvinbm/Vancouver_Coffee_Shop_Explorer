// src/api/shops.ts

import client from './client';

export interface CoffeeShop {
  id: number;
  name: string;
  address: string | null;
  latitude: string;
  longitude: string;
  google_place_id: string | null;
  neighborhood_id: number;
  neighborhood_name: string;
}

export interface CreateShopPayload {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  google_place_id?: string;
  neighborhood_id: number;
}

export const getShops = (neighborhood_id?: number) =>
  client.get<CoffeeShop[]>('/shops', {
    params: neighborhood_id ? { neighborhood_id } : undefined,
  });

export const getShop = (id: number) =>
  client.get<CoffeeShop>(`/shops/${id}`);

export const createShop = (data: CreateShopPayload) =>
  client.post<CoffeeShop>('/shops', data);
