// src/api/auth.ts

import client from './client';

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export const signup = (data: AuthPayload) =>
  client.post<AuthResponse>('/auth/signup', data);

export const login = (data: AuthPayload) =>
  client.post<AuthResponse>('/auth/login', data);
