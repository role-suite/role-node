# gRPC SDK Readiness Guide

This guide summarizes what SDK teams need from `role-node` to integrate gRPC safely.

## Contract inputs

- Proto source: `proto/*.proto`
- Package namespace: `role.v1`
- Distribution workflow: `docs/guides/grpc-proto-distribution.md`

## Runtime/security expectations

- Enablement: `GRPC_ENABLED=true`
- TLS/mTLS hardening: `docs/guides/grpc-hardening.md`
- Integration contract: `docs/guides/grpc-sdk-integration-contract.md`

## Required SDK capabilities

- gRPC client generation from pinned proto tag.
- Auth metadata injection (`authorization`).
- Request id propagation support (`x-request-id`).
- Error mapping from gRPC statuses and `x-error-code` metadata.

## Validation checklist

- Generated SDK artifacts match pinned proto tag.
- Auth and workspace invitation/join flows validated over gRPC.
- Runs and import-export JSON-string fields correctly parsed/serialized.
- SDK release notes declare compatible `role-node` tag and `role.v1` support.
