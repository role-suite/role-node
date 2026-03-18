# Module Template

Use the module generator to scaffold a new feature with consistent structure.

## Command

```bash
pnpm create:module <module-name>
```

Example:

```bash
pnpm create:module audit-logs
```

## Naming rules

- Module name must match `^[a-z][a-z0-9-]*$`
- Use kebab-case (for example: `audit-logs`, `project-members`)

## Generated files

The command creates:

- `src/modules/<module>/<module>.schema.ts`
- `src/modules/<module>/<module>.repo.ts`
- `src/modules/<module>/<module>.service.ts`
- `src/modules/<module>/<module>.controller.ts`
- `src/modules/<module>/<module>.route.ts`
- `tests/unit/<module>.schema.test.ts`
- `tests/unit/<module>.repo.test.ts`
- `tests/unit/<module>.service.test.ts`
- `tests/integration/<module>.test.ts` (created as `describe.skip` placeholder)

## After generation checklist

1. Register `<module>Router` in `src/app.ts`.
2. Replace placeholder fields and messages in schema/repo/service.
3. Unskip and complete `tests/integration/<module>.test.ts`.
4. Run checks:

```bash
pnpm test:run
pnpm build
```

## Notes

- The generator writes files with `wx` mode and fails if any target file already exists.
- The service template throws centralized domain errors with `appResponse.withStatus(...)`.
