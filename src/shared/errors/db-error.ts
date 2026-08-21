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

// Postgres unique-violation errors surface here wrapped as `DbError.cause`. Matching on the
// constraint name (not just the 23505 code) lets callers distinguish which UNIQUE index was hit
// when a table has more than one.
export const isUniqueViolation = (
  error: unknown,
  constraint: string,
): boolean => {
  if (!(error instanceof DbError)) {
    return false;
  }

  const cause = error.cause as
    { code?: string; constraint?: string } | undefined;

  return cause?.code === "23505" && cause?.constraint === constraint;
};
