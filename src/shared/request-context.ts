import { AsyncLocalStorage } from "node:async_hooks";

type RequestContext = {
  requestId: string;
};

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export const runWithRequestContext = (
  requestId: string,
  callback: () => void,
): void => {
  requestContextStorage.run({ requestId }, callback);
};

export const getRequestIdFromContext = (): string | undefined => {
  return requestContextStorage.getStore()?.requestId;
};
