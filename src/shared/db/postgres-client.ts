import { Pool, type PoolConfig, type PoolClient } from "pg";

import type {
  DatabaseClient,
  DatabaseConfig,
  QueryParams,
  QueryResult,
  QueryRow,
} from "../../types/db.js";
import { AppError } from "../errors/app-error.js";
import { DbError } from "../errors/db-error.js";

const normalizeResult = <TRow extends QueryRow>(result: {
  rows: TRow[];
  rowCount: number | null;
}): QueryResult<TRow> => {
  return {
    rows: result.rows,
    rowCount: result.rowCount ?? result.rows.length,
  };
};

const createTransactionClient = (client: PoolClient): DatabaseClient => {
  const query = async <TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> => {
    try {
      const result = await client.query<TRow>(sql, [...params]);
      return normalizeResult(result);
    } catch (error) {
      throw new DbError("PostgreSQL transaction query failed", {
        cause: error,
      });
    }
  };

  return {
    query,
    transaction: async <T>(
      callback: (tx: DatabaseClient) => Promise<T>,
    ): Promise<T> => callback(createTransactionClient(client)),
    close: async (): Promise<void> => Promise.resolve(),
  };
};

class PostgresDatabaseClient implements DatabaseClient {
  public constructor(private readonly pool: Pool) {}

  public async query<TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> {
    try {
      const result = await this.pool.query<TRow>(sql, [...params]);
      return normalizeResult(result);
    } catch (error) {
      throw new DbError("PostgreSQL query failed", {
        cause: error,
      });
    }
  }

  public async transaction<T>(
    callback: (tx: DatabaseClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(createTransactionClient(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");

      // AppError is a deliberate, already-translated domain error (e.g. a transaction callback
      // catching a unique-violation and re-throwing a friendly 409) - it must pass through
      // unchanged. Only truly unexpected errors get wrapped as a generic DbError.
      if (error instanceof DbError || error instanceof AppError) {
        throw error;
      }

      throw new DbError("PostgreSQL transaction failed", {
        cause: error,
      });
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const createPostgresClient = (
  config: DatabaseConfig,
): DatabaseClient => {
  const poolConfig: PoolConfig = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    min: config.poolMin,
    max: config.poolMax,
  };

  if (config.ssl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return new PostgresDatabaseClient(new Pool(poolConfig));
};
