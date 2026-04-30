import { ApiResponse } from "./apiResponse";

export interface RegisterPayload {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  avatar?: string;
  birthday?: string | null;
  created_at?: string;
}

export interface RegisterMeta {
  token: string;
}

export type RegisterResponse = ApiResponse<UserData, RegisterMeta>;

export type LoginResponse = ApiResponse<UserData, { token: string }>;
