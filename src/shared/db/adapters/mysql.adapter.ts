import mysql, {
  type Pool,
  type PoolConnection,
  type PoolOptions,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

import type {
  DatabaseClient,
  DatabaseConfig,
  DbDialect,
  QueryParams,
  QueryResult,
  QueryRow,
} from "../../../types/db.js";
import { DbError } from "../../errors/db-error.js";

const normalizeRows = <TRow extends QueryRow>(
  rows: RowDataPacket[] | ResultSetHeader,
): QueryResult<TRow> => {
  if (Array.isArray(rows)) {
    return {
      rows: rows as unknown as TRow[],
      rowCount: rows.length,
    };
  }

  return {
    rows: [],
    rowCount: rows.affectedRows,
  };
};

const createTransactionClient = (
  connection: PoolConnection,
  dialect: DbDialect,
): DatabaseClient => {
  const query = async <TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> => {
    try {
      const [rows] = await connection.execute<
        RowDataPacket[] | ResultSetHeader
      >(sql, [...params]);
      return normalizeRows<TRow>(rows);
    } catch (error) {
      throw new DbError(`${dialect} transaction query failed`, {
        dialect,
        cause: error,
      });
    }
  };

  return {
    dialect,
    query,
    transaction: async <T>(
      callback: (tx: DatabaseClient) => Promise<T>,
    ): Promise<T> => callback(createTransactionClient(connection, dialect)),
    close: async (): Promise<void> => Promise.resolve(),
  };
};

class MysqlDatabaseClient implements DatabaseClient {
  public constructor(
    private readonly pool: Pool,
    public readonly dialect: DbDialect,
  ) {}

  public async query<TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> {
    try {
      const [rows] = await this.pool.execute<RowDataPacket[] | ResultSetHeader>(
        sql,
        [...params],
      );
      return normalizeRows<TRow>(rows);
    } catch (error) {
      throw new DbError(`${this.dialect} query failed`, {
        dialect: this.dialect,
        cause: error,
      });
    }
  }

  public async transaction<T>(
    callback: (tx: DatabaseClient) => Promise<T>,
  ): Promise<T> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(
        createTransactionClient(connection, this.dialect),
      );
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();

      if (error instanceof DbError) {
        throw error;
      }

      throw new DbError(`${this.dialect} transaction failed`, {
        dialect: this.dialect,
        cause: error,
      });
    } finally {
      connection.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const createMysqlClient = (
  config: DatabaseConfig,
  dialect: DbDialect,
): DatabaseClient => {
  const poolOptions: PoolOptions = {
    uri: config.connectionString,
    connectionLimit: config.poolMax,
  };

  if (config.ssl) {
    poolOptions.ssl = {};
  }

  return new MysqlDatabaseClient(mysql.createPool(poolOptions), dialect);
};
