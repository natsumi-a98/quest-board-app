export interface ErrorDetail {
  field?: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: ErrorDetail[]
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (message: string, details?: ErrorDetail[]) =>
  new AppError(message, 400, "VALIDATION_ERROR", details);

export const unauthorized = (message = "Unauthorized") =>
  new AppError(message, 401, "UNAUTHORIZED");

export const forbidden = (message = "Forbidden") =>
  new AppError(message, 403, "FORBIDDEN");

export const notFound = (message: string) =>
  new AppError(message, 404, "NOT_FOUND");

export const conflict = (message: string) =>
  new AppError(message, 409, "CONFLICT");
