export type DbDialect = "postgres" | "mysql" | "mariadb";

export type QueryValue = string | number | boolean | Date | Buffer | null;

export type QueryParams = readonly QueryValue[] | QueryValue[];

export type QueryRow = Record<string, unknown>;

export type QueryResult<TRow extends QueryRow = QueryRow> = {
  rows: TRow[];
  rowCount: number;
};

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  poolMin: number;
  poolMax: number;
  ssl: boolean;
};

export interface DatabaseClient {
  readonly dialect: DbDialect;
  query<TRow extends QueryRow = QueryRow>(
    sql: string,
    params?: QueryParams,
  ): Promise<QueryResult<TRow>>;
  transaction<T>(callback: (tx: DatabaseClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
