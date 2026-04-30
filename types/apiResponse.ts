export interface ApiResponse<T = unknown, M = Record<string, unknown>> {
  success?: boolean; 
  message?: string;
  data?: T;
  meta?: M;
  status?: string;
  errors?: Record<string, string[]>;
}