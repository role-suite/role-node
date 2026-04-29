## Summary

What does this change do and why?

## Testing

- [ ] `pnpm verify`
- [ ] `pnpm verify:grpc`
- [ ] Other (describe):

## Checklist

- [ ] Updated docs if needed
- [ ] Added/updated tests
- [ ] If `proto/*.proto` changed: compatibility classification is declared in PR (`additive` or `breaking`)
- [ ] If `proto/*.proto` changed and classification is `additive`: `role.v1` compatibility is preserved
- [ ] If `proto/*.proto` changed and classification is `breaking`: migration plan is documented and `role.v2` impact is called out
- [ ] If `proto/*.proto` changed: removed fields/tags are reserved (no tag reuse)
- [ ] If `proto/*.proto` changed: regenerated `src/grpc/generated/*`
- [ ] If `proto/*.proto` changed: SDK impact and regeneration expectation are documented
- [ ] No breaking changes (or documented)
- [ ] If release-impacting: updated `CHANGELOG.md` and `docs/compatibility.md`
