export interface ErrorResponse {
  success: boolean;
  details?: string;
  status?: number;
  message: string;
  errors?: string;
}
