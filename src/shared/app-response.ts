import type { Response } from "express";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
};

type ActionConfirmation = "deleted" | "left" | "revoked" | "cancelled";

type CursorPage = {
  next: number;
  hasMore: boolean;
};

const object = <T extends Record<string, unknown>>(
  result: T,
): ApiResponse<T> => ({
  success: true,
  data: result,
});

const list = <T>(items: T[]): ApiResponse<{ items: T[] }> => ({
  success: true,
  data: { items },
});

const cursorPage = <T>(
  items: T[],
  cursor: CursorPage,
): ApiResponse<{ items: T[]; cursor: CursorPage }> => ({
  success: true,
  data: { items, cursor },
});

const action = (
  confirmation: ActionConfirmation,
): ApiResponse<{ action: ActionConfirmation }> => ({
  success: true,
  data: { action: confirmation },
});

const success = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const sendObject = <T extends Record<string, unknown>>(
  res: Response,
  statusCode: number,
  result: T,
): void => {
  res.status(statusCode).json(object(result));
};

const sendList = <T>(res: Response, statusCode: number, items: T[]): void => {
  res.status(statusCode).json(list(items));
};

const sendCursorPage = <T>(
  res: Response,
  statusCode: number,
  items: T[],
  cursor: CursorPage,
): void => {
  res.status(statusCode).json(cursorPage(items, cursor));
};

const sendAction = (
  res: Response,
  statusCode: number,
  confirmation: ActionConfirmation,
): void => {
  res.status(statusCode).json(action(confirmation));
};

const sendSuccess = <T>(res: Response, statusCode: number, data: T): void => {
  res.status(statusCode).json(success(data));
};

export const appResponse = {
  object,
  list,
  cursorPage,
  action,
  sendObject,
  sendList,
  sendCursorPage,
  sendAction,
  success,
  sendSuccess,
};
