Implemented the corrected FR12-TC05–TC08 proposal.

Changed files:

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts)

An API-only reversible order fixture was not possible. `/api/checkout` creates a persistent pending order, but no supported HTTP endpoint deletes orders or reverses a status transition to its baseline state.

The false-pass oracle was eliminated by:

- Binding the three non-existing order-status probes to external JSON `EVIDENCE MISSING` definitions.
- Proving their safe IDs are strict positive integers and absent from the authenticated baseline.
- Retaining one-shot response diagnostics and post-target order snapshots.
- Never treating generic non-success, status, or wording as access-denial proof.
- Deliberately raising a guarded `EVIDENCE MISSING` assertion.
- Limiting verified-denial counters to six routes per token class, never seven.

Structure:

- TC05: 2 invalid-token classes × 7 routes = 14 one-shot probes; 12 potentially verified denials and 2 guarded order-status observations.
- TC06: 7 one-shot ordinary-user probes; 6 potentially verified denials and 1 guarded order-status observation.
- TC07: exactly 2 GET-only Admin reads.
- TC08: exactly 9 rows—POST/PUT/DELETE × missing/user/admin.

Original response/state evidence is recorded before exact-marker authenticated cleanup. Cleanup remains nested with strict positive-integer IDs and final collection-to-baseline verification.

Validation passed:

- JSON parsing and sequential unique FR12-TC01–TC08 IDs.
- Exactly eight test declarations.
- TC01–TC04 byte-identical to HEAD.
- Chromium `--list`: exactly four TC05–TC08 tests.
- `npm run typecheck`.
- Action-count, evidence-ordering, guarded-oracle, forbidden-pattern, logging, trailing-whitespace, and `git diff --check` checks.

No browser or API test ran. No prohibited file was changed; pre-existing `ai-audit` worktree entries were left untouched.