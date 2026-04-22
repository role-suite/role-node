import type { Response } from "express";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
};

const success = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const sendSuccess = <T>(res: Response, statusCode: number, data: T): void => {
  res.status(statusCode).json(success(data));
};

export const appResponse = {
  success,
  sendSuccess,
};
