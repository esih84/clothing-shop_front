// types/api.ts

/** General shape of successful backend responses */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  timestamp: string;
};

/** Shape of lists with a dynamic key */
export type ApiListResponse<T, K extends string> = {
  [P in K]: T[];
} & {
  total: number;
  page: number;
  limit: number;
};

/** Error shape matching HttpExceptionFilter */
export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
};

export class ApiError extends Error {
  statusCode: number;
  data?: ApiErrorResponse;

  constructor(error: ApiErrorResponse) {
    super(
      Array.isArray(error.message) ? error.message.join(", ") : error.message,
    );

    this.name = "ApiError";
    this.statusCode = error.statusCode;
    this.data = error;
  }
}
