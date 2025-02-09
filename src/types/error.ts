/**
 * Interface for standardized error responses across the application
 */
export interface ErrorResponse {
  /**
   * Indicates whether the operation was successful
   * Always false for error responses
   */
  success: boolean;

  /**
   * HTTP status code for the error
   * Optional as some errors might not have an associated HTTP status
   */
  status?: number;

  /**
   * Human-readable error message describing what went wrong
   */
  message: string;

  /**
   * Additional error details or validation errors
   * Optional field for providing more specific error information
   */
  errors?: string;
}
