# gRPC SDK Integration Contract

This guide defines the integration contract SDK teams should implement for `role.v1`.

## Endpoint and package

- Package: `role.v1`
- Default local endpoint: `localhost:50051`
- Runtime enablement: `GRPC_ENABLED=true`

## Required metadata

- `authorization`: `Bearer <accessToken>` for protected RPC methods.
- `x-request-id`: optional client-provided request id; if omitted, server generates one.

## Server response metadata and diagnostics

- `x-request-id` is returned for traceability.
- `x-error-code` is included for mapped application errors when available.

## Error mapping contract

SDKs should map gRPC status codes into stable SDK error categories:

- `UNAUTHENTICATED` -> auth/session error
- `PERMISSION_DENIED` -> authorization error
- `INVALID_ARGUMENT` -> validation/input error
- `NOT_FOUND` -> missing resource error
- `ALREADY_EXISTS` -> conflict error
- `FAILED_PRECONDITION` -> domain precondition error
- `RESOURCE_EXHAUSTED` -> limits/rate/quotas error
- `UNAVAILABLE` -> transient transport/backend availability error
- `INTERNAL` -> server/internal error

When `x-error-code` is present, SDK errors should carry that value as a machine-readable code.

## Retry guidance

- Safe default retries: `UNAVAILABLE` and idempotent reads.
- Avoid automatic retries for state-changing methods unless idempotency is guaranteed by caller design.
- Always include exponential backoff and jitter for retries.

## Auth/token lifecycle guidance

- Access token is sent through `authorization` metadata.
- Refresh is explicit through `AuthService.Refresh`.
- On `UNAUTHENTICATED`, SDK should attempt refresh if refresh token exists; otherwise clear auth state.

## Current payload caveat

Runs and import-export currently use JSON-string fields:

- `payload_json`
- `run_json`
- `job_json`
- `jobs_json`

SDKs should parse/serialize these fields in transport adapters and expose typed SDK models upstream.
