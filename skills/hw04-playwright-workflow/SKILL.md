---
name: hw04-playwright-workflow
description: Build and maintain reviewed, data-driven Playwright automation for one or more web features, including traceability, three-browser execution, genuine HTML evidence, cleanup, and AI-audit records. Use for HW04-style feature automation; do not use to fabricate reports, videos, human review, or defect evidence.
---

# HW04 Playwright Workflow

Treat requirements and current observable SUT behavior as separate inputs. Derive expected results from the authoritative requirement source; use API documentation only for supported transport details. Mark an unsupported exact status, message, route, or schema as `EVIDENCE MISSING` instead of inventing it.

## Build a reviewed increment

1. Record the feature selection, requirement IDs, logical test IDs, layer, data partitions, assertion patterns, browser applicability, mutation risk, and cleanup in a traceability matrix before implementation.
2. Put case identity, inputs, expected requirement outcomes, route inventories, seeded-fixture credentials, and cleanup markers in a separate JSON or CSV file. Generate collision-safe identities at runtime. Never commit live tokens.
3. Keep locators scoped to the relevant form, row, dialog, or navigation component. Prefer semantic roles and requirement text, but inspect the real DOM before assuming labels, accessible names, or HTML semantics are valid.
4. Keep actions one-shot. Do not retry a target request, click again to compensate, add fixed sleeps, inject application state, mock the SUT, or weaken an assertion to match an implementation defect.
5. Use at least three independent assertion patterns per feature. For denial tests, assert both rejection and no mutation through a separate authoritative read-back.
6. Implement in small increments. Review the generated diff and oracle reach before running. Record the exact prompt, output, correction, and human review decision in the AI audit.

## Mutation safety

Capture the baseline before every mutation. Use dedicated fixtures and exact marker-field equality for discovery. Accept only strict positive-integer controlled IDs for cleanup. Run cleanup in `finally`, report cleanup failures separately, and verify final state equals baseline. Restore a verified database backup only when supported cleanup cannot safely return the SUT to baseline.

Do not call a generic non-success response an authentication or authorization denial when a business handler could produce the same response. Establish a business-valid, existing target first. If no reversible fixture can be created through supported interfaces, preserve the one-shot response and classify the access result as `EVIDENCE MISSING`.

## Execute and package

Read [references/evidence-and-review.md](references/evidence-and-review.md) before generating development or final evidence. Keep development runs separate from final submission runs. A feature-browser run must generate its own report at execution time; never post-edit a report.

Stop local runtimes after execution, verify cleanup or backup restoration, typecheck the final code, and inspect generated report metadata. Leave voice narration, identity proof, human review, external issue publication, commits, pushes, and submission to the authorized person.
