# Evidence and Review Protocol

## Development runs

- Use one browser and one reviewed increment when diagnosing reach or fixture behavior.
- Preserve raw console output, screenshots, error context, traces, run label, timestamp, command, exit code, and human triage.
- Mark infrastructure-invalid runs as superseded; do not count them as functional evidence.
- Distinguish assertion failure, fixture failure, cleanup failure, and evidence not reached.

## Final runs

- Run each selected feature independently on Chromium, Firefox, and WebKit: three features produce nine feature-browser runs.
- Use one worker, no retries, and a collision-safe report directory per run.
- Generate one ISO timestamp when Playwright config is evaluated and use the same value in visible report title and metadata.
- Include exact `Run by: <StudentID>` text in every report.
- Store final reports outside the default local report directory so later smoke or `--list` commands cannot erase them.
- Verify embedded report data contains the student ID, timestamp, project, 12-case count, and actual totals.

## Human review questions

- Does each test fail for the intended requirement when expected behavior is absent?
- Can an earlier missing prerequisite mask the target oracle?
- Could business validation be mistaken for access denial?
- Does every mutation have exact-marker cleanup and independent final-state proof?
- Are soft assertions limited to independent observations after hard fixture prerequisites?
- Are browser-native details asserted by state rather than browser-specific wording?
- Are discrepancies reported only after genuine execution, with unreached assertions labeled?

## Submission boundary

Automation may generate scripts, external data, documents, reports, and local evidence. It must not fabricate a student's narration, face-cam, terminal identity proof, human review statement, GitHub Issue publication, screenshot attachment, or Moodle upload.
