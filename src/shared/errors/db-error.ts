type DbErrorOptions = {
  cause?: unknown;
  statusCode?: number;
};

export class DbError extends Error {
  public readonly statusCode: number;
  public readonly cause: unknown;

  public constructor(message: string, options?: DbErrorOptions) {
    super(message);
    this.name = "DbError";
    this.statusCode = options?.statusCode ?? 500;
    this.cause = options?.cause;
  }
}
