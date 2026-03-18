import { Pool, type PoolConfig, type PoolClient } from "pg";

import type {
  DatabaseClient,
  DatabaseConfig,
  QueryParams,
  QueryResult,
  QueryRow,
} from "../../../types/db.js";
import { DbError } from "../../errors/db-error.js";

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
        dialect: "postgres",
        cause: error,
      });
    }
  };

  return {
    dialect: "postgres",
    query,
    transaction: async <T>(
      callback: (tx: DatabaseClient) => Promise<T>,
    ): Promise<T> => callback(createTransactionClient(client)),
    close: async (): Promise<void> => Promise.resolve(),
  };
};

class PostgresDatabaseClient implements DatabaseClient {
  public readonly dialect = "postgres" as const;

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
        dialect: this.dialect,
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

      if (error instanceof DbError) {
        throw error;
      }

      throw new DbError("PostgreSQL transaction failed", {
        dialect: this.dialect,
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
    connectionString: config.connectionString,
    min: config.poolMin,
    max: config.poolMax,
  };

  if (config.ssl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return new PostgresDatabaseClient(new Pool(poolConfig));
};
