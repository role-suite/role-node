import type { DbDialect } from "../../types/db.js";

type DbErrorOptions = {
  dialect?: DbDialect;
  cause?: unknown;
  statusCode?: number;
};

export class DbError extends Error {
  public readonly statusCode: number;
  public readonly dialect: DbDialect | undefined;
  public readonly cause: unknown;

  public constructor(message: string, options?: DbErrorOptions) {
    super(message);
    this.name = "DbError";
    this.statusCode = options?.statusCode ?? 500;
    this.dialect = options?.dialect;
    this.cause = options?.cause;
  }
}
