# gRPC Governance Ownership

This document defines ownership and operating workflow for gRPC contract governance.

## Owners

- Backend contract owners (`role-node` maintainers): proto schema evolution, compatibility policy, release notes.
- SDK integration owners (`role-sdk` maintainers): proto consumption, client generation, transport adapter updates.

## Review expectations

- Proto-impacting PRs require review from at least one backend contract owner.
- Breaking proto proposals require explicit migration plan and cross-team sign-off.

## Operational SLA

- Target first review for SDK-blocking proto issues: within 2 business days.
- Target decision on compatibility classification (`additive` vs `breaking`): within 3 business days.

## Escalation path

- Open issue with label `sdk-blocker` and link affected SDK release timeline.
- Escalate in release planning if blocker risks release date.

## Release communication

- Release notes must include gRPC compatibility statement (`role.v1` preserved or migration required).
- If migration is required, include action items for SDK maintainers.
