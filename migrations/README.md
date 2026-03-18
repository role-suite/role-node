# Migrations

Migration files live in this directory and are executed by:

```bash
pnpm db:migrate
```

## File naming

- Use lexicographically sortable prefixes.
- Pattern: `<timestamp-or-seq>_<name>.migration.ts`

Example:

```txt
20260318_001_create_users_table.migration.ts
```

## Migration template

```ts
import type { MigrationContext } from "../src/types/db-migration.js";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query("DROP TABLE IF EXISTS users");
};
```

## Notes

- Migrations run inside transactions managed by the runner.
- Applied migrations are tracked in `app_migrations`.
