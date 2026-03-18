import type { DbDialect } from "../../types/db.js";

import { AppError } from "./app-error.js";

type DbErrorOptions = {
  dialect?: DbDialect;
  cause?: unknown;
  statusCode?: number;
};

export class DbError extends AppError {
  public readonly dialect: DbDialect | undefined;
  public readonly cause: unknown;

  public constructor(message: string, options?: DbErrorOptions) {
    super(message, options?.statusCode ?? 500);
    this.name = "DbError";
    this.dialect = options?.dialect;
    this.cause = options?.cause;
  }
}
