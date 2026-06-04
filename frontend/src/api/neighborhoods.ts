// src/api/neighborhoods.ts

import client from './client';

export interface Neighborhood {
  id: number;
  name: string;
}

export const getNeighborhoods = () =>
  client.get<Neighborhood[]>('/neighborhoods');
