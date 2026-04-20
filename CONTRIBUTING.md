# Contributing

Thanks for contributing to Röle Node. This guide explains how to propose changes and run the project locally.

## Development setup

1. Install dependencies

```bash
pnpm install
```

2. Create your environment file

```bash
cp .env.example .env
```

3. Start the dev server

```bash
pnpm dev
```

4. Run tests

```bash
pnpm test:run
```

## Branching

- Create feature branches from `main`.
- Keep commits focused and descriptive.

Example:

```bash
git checkout -b feature/workspace-invitations
```

## Pull requests

- Describe the problem and solution clearly.
- Include test coverage for behavior changes.
- Link related issues when applicable.

## Releases

- Production releases are versioned with semantic tags: `vMAJOR.MINOR.PATCH`.
- Use the GitHub Actions workflow `Release Tag` and choose bump type (`patch`, `minor`, `major`).
- The tag triggers the CD workflow to build and release the tagged version.

## Code style

- Use existing patterns in modules (schema -> service -> controller -> route).
- Validate external input with Zod.
- Keep IO and persistence in repo layer.
