# gRPC Hardening Guide

This guide documents production hardening for the `role.v1` gRPC transport.

## 1) Versioning and compatibility policy

- Keep package namespace at `role.v1` for all backward-compatible changes.
- Allowed in `v1`: additive fields, additive RPC methods, additive messages.
- Disallowed in `v1`: field renumbering, field type changes, removing fields/RPCs, reusing retired field numbers.
- Deprecate first, remove only in next major namespace (`role.v2`).

Proto PR checklist:

- Regenerate artifacts with `pnpm grpc:generate`.
- Run `pnpm verify:grpc`.
- Confirm changes are additive-only for `role.v1`.

## 2) TLS and mTLS runtime modes

Environment flags:

- `GRPC_TLS_ENABLED`: enables TLS server credentials.
- `GRPC_MTLS_ENABLED`: requires client certificates (mTLS).
- `GRPC_TLS_CERT_PATH`: server certificate chain file path.
- `GRPC_TLS_KEY_PATH`: server private key file path.
- `GRPC_TLS_CA_PATH`: CA certificate file path (required for mTLS, optional for TLS).

Validation behavior:

- Startup fails if required TLS/mTLS files are missing or unreadable.
- Startup logs include `tlsEnabled` and `mtlsEnabled` flags.

## 3) Deployment notes

- gRPC requires HTTP/2 end-to-end.
- Prefer exposing gRPC behind internal/private networking unless public access is required.
- If terminating TLS at a proxy, ensure trusted network boundaries to backend gRPC listener.
- For mTLS deployments, rotate CA/cert/key via rolling restart with overlap window.

## 3.1) Local TLS smoke test

Generate local test certificates:

```bash
mkdir -p .certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout .certs/server.key -out .certs/server.crt -days 7 -subj "/CN=localhost"
cp .certs/server.crt .certs/ca.crt
```

Run server in TLS mode:

```bash
GRPC_ENABLED=true GRPC_TLS_ENABLED=true GRPC_TLS_CERT_PATH="$(pwd)/.certs/server.crt" GRPC_TLS_KEY_PATH="$(pwd)/.certs/server.key" pnpm dev
```

Expected startup logs include:

- `tlsEnabled: true`
- `mtlsEnabled: false`

Smoke check with `grpcurl`:

```bash
grpcurl -cacert .certs/ca.crt -d '{"service":"role-node"}' localhost:50051 role.v1.HealthService/Check
```

Expected response includes `status: "SERVING"`.

## 3.2) Local mTLS smoke test

Generate client certificate signed by the same local CA:

```bash
openssl req -newkey rsa:2048 -nodes -keyout .certs/client.key -out .certs/client.csr -subj "/CN=grpc-client"
openssl x509 -req -in .certs/client.csr -CA .certs/ca.crt -CAkey .certs/server.key -CAcreateserial -out .certs/client.crt -days 7
```

Run server in mTLS mode:

```bash
GRPC_ENABLED=true GRPC_TLS_ENABLED=true GRPC_MTLS_ENABLED=true GRPC_TLS_CERT_PATH="$(pwd)/.certs/server.crt" GRPC_TLS_KEY_PATH="$(pwd)/.certs/server.key" GRPC_TLS_CA_PATH="$(pwd)/.certs/ca.crt" pnpm dev
```

Expected startup logs include:

- `tlsEnabled: true`
- `mtlsEnabled: true`

Smoke check with client certificate:

```bash
grpcurl -cacert .certs/ca.crt -cert .certs/client.crt -key .certs/client.key -d '{"service":"role-node"}' localhost:50051 role.v1.HealthService/Check
```

If client cert is omitted in mTLS mode, the call should fail during handshake.

## 4) Observability baseline

- Every unary call logs `requestId`, `operationName`, `durationMs`.
- Failed calls additionally log mapped `grpcCode` and `grpcMessage`.
- Error metadata includes `x-request-id` and `x-error-code` for troubleshooting.

## 5) JSON payload transport policy

Runs and import-export currently use JSON string transport fields:

- `payload_json`
- `run_json`
- `job_json`
- `jobs_json`

This is intentional for parity with existing DTO shapes during migration.

Graduation criteria to fully typed proto messages:

1. Stable canonical schemas for run/import-export payloads.
2. Backward-compatible typed message introduction plan.
3. Parity tests proving no behavior regression versus current JSON transport.
