import type { Response } from "express";

import type { ApiResponse } from "../types/api-response.js";

export type ErrorResponseWithStatus = ApiResponse<unknown> & {
  success: false;
  message: string;
  statusCode: number;
};

const success = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const error = (message: string, data?: unknown): ApiResponse<unknown> => ({
  success: false,
  message,
  ...(data === undefined ? {} : { data }),
});

const withStatus = (
  statusCode: number,
  message: string,
  data?: unknown,
): ErrorResponseWithStatus => ({
  statusCode,
  ...error(message, data),
  success: false,
  message,
});

const isErrorWithStatus = (
  value: unknown,
): value is ErrorResponseWithStatus => {
  return (
    typeof value === "object" &&
    value !== null &&
    "statusCode" in value &&
    typeof value.statusCode === "number" &&
    "message" in value &&
    typeof value.message === "string" &&
    "success" in value &&
    value.success === false
  );
};

const sendSuccess = <T>(res: Response, statusCode: number, data: T): void => {
  res.status(statusCode).json(success(data));
};

const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
): void => {
  res.status(statusCode).json(error(message, data));
};

export const appResponse = {
  success,
  error,
  withStatus,
  isErrorWithStatus,
  sendSuccess,
  sendError,
};
