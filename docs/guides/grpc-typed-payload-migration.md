# gRPC Typed Payload Migration Plan

This plan tracks migration from JSON-string gRPC fields to typed proto messages.

## Current JSON-string fields

- `runs.Create.payload_json`
- `runs.GetById.run_json`
- `import-export.GetJobById.job_json`
- `import-export.ListJobs.jobs_json`

## Target outcome

- Replace JSON-string fields with canonical typed messages in `role.v2` (or additive shadow fields in `role.v1` during transition).
- Preserve behavioral parity with existing service-layer DTOs.

## Migration phases

1. Schema stabilization
   - Finalize canonical typed schemas for run payloads and import/export job payloads.
2. Dual-field transition
   - Introduce typed fields while keeping existing JSON-string fields available.
3. SDK adoption window
   - SDKs migrate to typed fields and publish compatibility matrix updates.
4. Deprecation and removal
   - Remove JSON-string fields only in a breaking package line (`role.v2`).

## Backward-compatibility rules

- No field tag reuse.
- Reserve retired tags and names.
- Keep JSON-string behavior stable until all first-party SDKs complete migration.

## Exit criteria

- Typed fields validated in gRPC integration tests.
- SDKs consume typed fields by default.
- JSON-string fields fully deprecated with documented sunset timeline.
