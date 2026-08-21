import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { AdminAccessPage } from '../pages/admin-access.page.js';
import {
  countMutationMarkerMatches,
  countControlledRecordMatches,
  createAdminSnapshotSession,
  normalizedSnapshotsEqual,
  payloadContainsMarker,
  probeMissingTokenRoute,
  responseDiagnostics,
  responseReturnsProtectedData,
} from '../support/fr12-api.js';
import { loadJsonFile } from '../support/data-loader.js';
import type {
  Fr12AccessControlData,
  Fr12AdminRouteRecord,
  Fr12SnapshotResource,
  Fr12SnapshotResourceName,
} from '../support/data-loader.js';
import type {
  AdminSnapshotSession,
  ControlledCleanupResult,
  SnapshotAttempt,
} from '../support/fr12-api.js';

const data = loadJsonFile<Fr12AccessControlData>(
  'tests/data/fr12-access-control.json',
);
const adminUiNoTokenCase = data.admin_ui_no_token;
const adminUiOrdinaryUserCase = data.admin_ui_ordinary_user;
const adminUiAdminCase = data.admin_ui_admin;
const adminRouteInventoryMissingTokenCase =
  data.admin_route_inventory_missing_token;

const adminOrigin = process.env.PW_ADMIN_URL ?? 'http://localhost:5174';
const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';

function snapshotByResource(
  attempts: readonly SnapshotAttempt[],
  resource: Fr12SnapshotResourceName,
): SnapshotAttempt | undefined {
  return attempts.find((attempt) => attempt.resource === resource);
}

function recordSnapshotAcquisition(
  attempts: readonly SnapshotAttempt[],
  expectedSuccessful: boolean,
  phase: string,
): void {
  for (const attempt of attempts) {
    expect.soft(
      attempt.successful,
      `${phase} ${attempt.resource} snapshot must be available; ` +
        `status: ${String(attempt.status)}; error: ${String(attempt.error)}`,
    ).toBe(expectedSuccessful);
  }
}

async function recordGuardedVisibility(
  locator: Locator,
  expectedCount: number,
  identity: string,
): Promise<void> {
  await expect.soft(locator, `${identity} count`).toHaveCount(expectedCount);
  const observedCount = await locator.count();

  if (observedCount === expectedCount && observedCount > 0) {
    expect.soft(
      await locator.first().isVisible(),
      `${identity} must be visible when its expected count is present`,
    ).toBe(true);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function captureSnapshotsSafely(
  session: AdminSnapshotSession,
  resources: readonly Fr12SnapshotResource[],
  routes: readonly Fr12AdminRouteRecord[],
  phase: string,
): Promise<SnapshotAttempt[]> {
  try {
    return await session.capture(resources, routes);
  } catch (error) {
    const diagnostic = `${phase} snapshot helper failed: ${errorMessage(error)}`;
    return resources.map((resource) => ({
      resource: resource.name,
      successful: false,
      error: diagnostic,
    }));
  }
}

test.describe('FR-12 access control — reviewed increment 1', () => {
  test(`${adminUiNoTokenCase.id} ${adminUiNoTokenCase.title}`, async ({
    page,
  }) => {
    test.slow();
    const testCase = adminUiNoTokenCase;
    const admin = new AdminAccessPage(page, testCase.labels);
    const mutationRequests = admin.observeMutationRequests(
      testCase.requestObservation.mutations,
    );
    const loginResponses = admin.observeLoginResponses(
      testCase.requestObservation.login.method,
      testCase.requestObservation.login.path,
    );
    const dialogs = admin.observeAndDismissDialogs();
    const loginSubmitActivations = 0;

    try {
      await admin.goto(adminOrigin, testCase.adminEntryPath);

      await recordGuardedVisibility(
        admin.loginForm,
        testCase.expected.counts.loginForms,
        'Admin login form',
      );
      await recordGuardedVisibility(
        admin.loginHeading,
        testCase.expected.counts.loginHeadings,
        'Admin login heading',
      );
      await recordGuardedVisibility(
        admin.emailControl,
        testCase.expected.counts.emailControls,
        'Admin email control',
      );
      await recordGuardedVisibility(
        admin.passwordControl,
        testCase.expected.counts.passwordControls,
        'Admin password control',
      );
      await recordGuardedVisibility(
        admin.submitButton,
        testCase.expected.counts.submitButtons,
        'Admin login submit control',
      );
      await expect.soft(admin.protectedAdminIdentity).toHaveCount(
        testCase.expected.counts.protectedAdminIdentities,
      );
      await expect.soft(admin.dashboardIdentity).toHaveCount(
        testCase.expected.counts.dashboardIdentities,
      );

      expect.soft(loginResponses.count()).toBe(
        testCase.expected.counts.loginResponses,
      );
      expect.soft(loginResponses.successfulCount()).toBe(
        testCase.expected.counts.successfulLoginResponses,
      );
      expect.soft(loginSubmitActivations).toBe(
        testCase.expected.counts.loginSubmitActivations,
      );
      expect.soft(dialogs.count()).toBe(testCase.expected.counts.dialogs);
      expect.soft(mutationRequests.count()).toBe(
        testCase.expected.counts.adminMutationRequests,
      );
    } finally {
      await dialogs.settle();
      dialogs.stop();
      loginResponses.stop();
      mutationRequests.stop();
    }
  });

  test(`${adminUiOrdinaryUserCase.id} ${adminUiOrdinaryUserCase.title}`, async ({
    page,
  }) => {
    test.slow();
    const testCase = adminUiOrdinaryUserCase;
    const admin = new AdminAccessPage(page, testCase.labels);
    const mutationRequests = admin.observeMutationRequests(
      testCase.requestObservation.mutations,
    );
    const loginResponses = admin.observeLoginResponses(
      testCase.requestObservation.login.method,
      testCase.requestObservation.login.path,
    );
    const dialogs = admin.observeAndDismissDialogs();
    let loginSubmitActivations = 0;

    try {
      await admin.goto(adminOrigin, testCase.adminEntryPath);
      await expect(admin.loginForm).toHaveCount(
        testCase.loginPrerequisites.counts.loginForms,
      );
      await expect(admin.loginForm).toBeVisible();
      await expect(admin.emailControl).toHaveCount(
        testCase.loginPrerequisites.counts.emailControls,
      );
      await expect(admin.emailControl).toBeVisible();
      await expect(admin.passwordControl).toHaveCount(
        testCase.loginPrerequisites.counts.passwordControls,
      );
      await expect(admin.passwordControl).toBeVisible();
      await expect(admin.submitButton).toHaveCount(
        testCase.loginPrerequisites.counts.submitButtons,
      );
      await expect(admin.submitButton).toBeVisible();

      await admin.loginOnce(testCase.credentials);
      loginSubmitActivations += 1;

      await recordGuardedVisibility(
        admin.loginForm,
        testCase.expected.counts.loginForms,
        'Post-login Admin login form',
      );
      await expect.soft(admin.emailControl).toHaveCount(
        testCase.expected.counts.emailControls,
      );
      await expect.soft(admin.passwordControl).toHaveCount(
        testCase.expected.counts.passwordControls,
      );
      await expect.soft(admin.submitButton).toHaveCount(
        testCase.expected.counts.submitButtons,
      );
      await expect.soft(admin.protectedAdminIdentity).toHaveCount(
        testCase.expected.counts.protectedAdminIdentities,
      );
      await expect.soft(admin.dashboardIdentity).toHaveCount(
        testCase.expected.counts.dashboardIdentities,
      );

      await dialogs.settle();
      expect.soft(dialogs.count()).toBe(testCase.expected.counts.dialogs);
      for (const dialogType of dialogs.types()) {
        expect.soft(testCase.dialog.allowedTypes).toContain(dialogType);
      }
      if (testCase.dialog.requireNonEmptyMessage) {
        for (const message of dialogs.messages()) {
          expect.soft(message.trim().length).toBeGreaterThan(0);
        }
      }

      expect.soft(loginResponses.count()).toBe(
        testCase.expected.counts.loginResponses,
      );
      expect.soft(loginResponses.successfulCount()).toBe(
        testCase.expected.counts.successfulLoginResponses,
      );
      expect.soft(loginSubmitActivations).toBe(
        testCase.expected.counts.loginSubmitActivations,
      );
      expect.soft(mutationRequests.count()).toBe(
        testCase.expected.counts.adminMutationRequests,
      );
    } finally {
      await dialogs.settle();
      dialogs.stop();
      loginResponses.stop();
      mutationRequests.stop();
    }
  });

  test(`${adminUiAdminCase.id} ${adminUiAdminCase.title}`, async ({ page }) => {
    test.slow();
    const testCase = adminUiAdminCase;
    const admin = new AdminAccessPage(page, testCase.labels);
    const mutationRequests = admin.observeMutationRequests(
      testCase.requestObservation.mutations,
    );
    const loginResponses = admin.observeLoginResponses(
      testCase.requestObservation.login.method,
      testCase.requestObservation.login.path,
    );
    const dialogs = admin.observeAndDismissDialogs();
    let loginSubmitActivations = 0;

    try {
      await admin.goto(adminOrigin, testCase.adminEntryPath);
      await expect(admin.loginForm).toHaveCount(
        testCase.loginPrerequisites.counts.loginForms,
      );
      await expect(admin.loginForm).toBeVisible();
      await expect(admin.emailControl).toHaveCount(
        testCase.loginPrerequisites.counts.emailControls,
      );
      await expect(admin.emailControl).toBeVisible();
      await expect(admin.passwordControl).toHaveCount(
        testCase.loginPrerequisites.counts.passwordControls,
      );
      await expect(admin.passwordControl).toBeVisible();
      await expect(admin.submitButton).toHaveCount(
        testCase.loginPrerequisites.counts.submitButtons,
      );
      await expect(admin.submitButton).toBeVisible();

      await admin.loginOnce(testCase.credentials);
      loginSubmitActivations += 1;

      await recordGuardedVisibility(
        admin.protectedAdminIdentity,
        testCase.expected.counts.protectedAdminIdentities,
        'Protected Admin identity',
      );
      await recordGuardedVisibility(
        admin.dashboardIdentity,
        testCase.expected.counts.dashboardIdentities,
        'Dashboard identity',
      );
      await expect.soft(admin.loginForm).toHaveCount(
        testCase.expected.counts.loginForms,
      );
      await expect.soft(admin.emailControl).toHaveCount(
        testCase.expected.counts.emailControls,
      );
      await expect.soft(admin.passwordControl).toHaveCount(
        testCase.expected.counts.passwordControls,
      );
      await expect.soft(admin.submitButton).toHaveCount(
        testCase.expected.counts.submitButtons,
      );

      expect.soft(loginResponses.count()).toBe(
        testCase.expected.counts.loginResponses,
      );
      expect.soft(loginResponses.successfulCount()).toBe(
        testCase.expected.counts.successfulLoginResponses,
      );
      expect.soft(loginSubmitActivations).toBe(
        testCase.expected.counts.loginSubmitActivations,
      );
      expect.soft(dialogs.count()).toBe(testCase.expected.counts.dialogs);
      expect.soft(mutationRequests.count()).toBe(
        testCase.expected.counts.adminMutationRequests,
      );
    } finally {
      await dialogs.settle();
      dialogs.stop();
      loginResponses.stop();
      mutationRequests.stop();
    }
  });

  test(`${adminRouteInventoryMissingTokenCase.id} ${adminRouteInventoryMissingTokenCase.title}`, async ({
    request,
  }) => {
    const testCase = adminRouteInventoryMissingTokenCase;
    const routeKeys = testCase.routes.map((route) => route.key);
    const cleanupKeys = testCase.controlledCleanup.map(
      (cleanup) => cleanup.key,
    );
    const markers = testCase.routes.flatMap((route) =>
      route.mutationMarker === undefined ? [] : [route.mutationMarker],
    );

    expect(testCase.routes).toHaveLength(testCase.expected.targetRouteCount);
    expect(new Set(routeKeys).size).toBe(testCase.expected.targetRouteCount);
    expect(testCase.snapshots).toHaveLength(
      testCase.expected.snapshotResourceCount,
    );
    expect(markers).toHaveLength(testCase.expected.mutationMarkerCount);
    expect(testCase.controlledCleanup).toHaveLength(
      testCase.expected.controlledCleanupCount,
    );
    expect(new Set(cleanupKeys).size).toBe(
      testCase.expected.controlledCleanupCount,
    );
    for (const route of testCase.routes) {
      expect(route.authorizationHeader !== null).toBe(
        testCase.expected.authorizationHeaderPresent,
      );
      if (route.mutationMarker !== undefined) {
        expect(payloadContainsMarker(route.payload, route.mutationMarker)).toBe(
          true,
        );
      }
    }

    const snapshotSession = await createAdminSnapshotSession(
      request,
      apiBaseUrl,
      testCase.apiSession,
    );
    expect.soft(
      snapshotSession.loginSuccessful,
      `Seeded-admin snapshot session must be acquired; ` +
        `status: ${String(snapshotSession.loginStatus)}; ` +
        `error: ${String(snapshotSession.loginError)}`,
    ).toBe(testCase.expected.snapshotSessionLoginSuccessful);

    const beforeSnapshots = await captureSnapshotsSafely(
      snapshotSession,
      testCase.snapshots,
      testCase.routes,
      'Pre-probe',
    );
    recordSnapshotAcquisition(
      beforeSnapshots,
      testCase.expected.snapshotAcquisitionSuccessful,
      'Pre-probe',
    );

    let completedProbeResponses = 0;
    let successfulProbeResponses = 0;
    let protectedDataResponses = 0;
    let afterSnapshots: SnapshotAttempt[] = [];

    try {
      for (const route of testCase.routes) {
        await test.step(`${route.method} ${route.path} without Authorization`, async () => {
          const attempt = await probeMissingTokenRoute(request, apiBaseUrl, route);
          expect.soft(
            attempt.transportSuccessful,
            `${route.key} transport failure: ${String(attempt.error)}`,
          ).toBe(testCase.expected.probeTransportSuccessful);
          expect.soft(attempt.authorizationHeaderPresent).toBe(
            testCase.expected.authorizationHeaderPresent,
          );

          if (attempt.response !== undefined) {
            completedProbeResponses += 1;
            if (attempt.response.successful) {
              successfulProbeResponses += 1;
            }
            const protectedDataReturned = responseReturnsProtectedData(
              attempt,
              beforeSnapshots,
            );
            if (protectedDataReturned) {
              protectedDataResponses += 1;
            }

            expect.soft(
              attempt.response.successful,
              `${route.key} must be denied; ${responseDiagnostics(attempt.response)}`,
            ).toBe(testCase.expected.responseSuccessful);
            expect.soft(
              protectedDataReturned,
              `${route.key} must not return protected ${route.protectedResource} data`,
            ).toBe(testCase.expected.protectedDataReturned);
          }
        });
      }

      expect.soft(completedProbeResponses).toBe(
        testCase.expected.completedProbeResponses,
      );
      expect.soft(successfulProbeResponses).toBe(
        testCase.expected.successfulProbeResponses,
      );
      expect.soft(protectedDataResponses).toBe(
        testCase.expected.protectedDataResponses,
      );
    } finally {
      afterSnapshots = await captureSnapshotsSafely(
        snapshotSession,
        testCase.snapshots,
        testCase.routes,
        'Post-probe',
      );

      try {
        recordSnapshotAcquisition(
          afterSnapshots,
          testCase.expected.snapshotAcquisitionSuccessful,
          'Post-probe',
        );

        let changedSnapshotCount = 0;
        for (const resource of testCase.snapshots) {
          const before = snapshotByResource(beforeSnapshots, resource.name);
          const after = snapshotByResource(afterSnapshots, resource.name);

          if (before?.successful && after?.successful) {
            const snapshotsEqual = normalizedSnapshotsEqual(
              before.value,
              after.value,
            );
            if (!snapshotsEqual) {
              changedSnapshotCount += 1;
            }
            expect.soft(
              snapshotsEqual,
              `${resource.name} changed after missing-token probes`,
            ).toBe(true);
          }
        }

        expect.soft(changedSnapshotCount).toBe(
          testCase.expected.changedSnapshotCount,
        );
        expect.soft(
          countMutationMarkerMatches(
            [...beforeSnapshots, ...afterSnapshots],
            markers,
          ),
        ).toBe(testCase.expected.mutationMarkerMatches);
      } finally {
        let cleanupResults: ControlledCleanupResult[] = [];

        try {
          cleanupResults = await snapshotSession.cleanupControlledRecords(
            testCase.controlledCleanup,
            afterSnapshots,
          );
          expect.soft(cleanupResults).toHaveLength(
            testCase.expected.controlledCleanupCount,
          );

          for (const cleanup of testCase.controlledCleanup) {
            const result = cleanupResults.find(
              (candidate) => candidate.cleanupKey === cleanup.key,
            );
            expect.soft(
              result?.discoverySuccessful ?? false,
              `Cleanup discovery ${cleanup.key} failed; ` +
                `matching records: ${String(result?.matchingRecordCount)}; ` +
                `error: ${String(result?.error)}`,
            ).toBe(testCase.expected.cleanupDiscoverySuccessful);

            for (const mutation of result?.mutations ?? []) {
              expect.soft(
                mutation.successful,
                `Cleanup ${cleanup.key} failed for controlled ` +
                  `${cleanup.identifierField}=${mutation.identifier}; ` +
                  `status: ${String(mutation.status)}; ` +
                  `error: ${String(mutation.error)}`,
              ).toBe(cleanup.expected.responseSuccessful);
            }
          }
        } catch (error) {
          expect.soft(
            false,
            `Controlled cleanup helper failed: ${errorMessage(error)}`,
          ).toBe(true);
        } finally {
          const finalSnapshots = await captureSnapshotsSafely(
            snapshotSession,
            testCase.snapshots,
            testCase.routes,
            'Post-cleanup',
          );
          recordSnapshotAcquisition(
            finalSnapshots,
            testCase.expected.finalSnapshotAcquisitionSuccessful,
            'Post-cleanup',
          );

          expect.soft(
            countControlledRecordMatches(
              finalSnapshots,
              testCase.controlledCleanup,
            ),
          ).toBe(testCase.expected.controlledMarkerMatchesAfterCleanup);

          let finalChangedSnapshotCount = 0;
          for (const resource of testCase.snapshots) {
            const before = snapshotByResource(beforeSnapshots, resource.name);
            const final = snapshotByResource(finalSnapshots, resource.name);

            if (before?.successful && final?.successful) {
              const snapshotsEqual = normalizedSnapshotsEqual(
                before.value,
                final.value,
              );
              if (!snapshotsEqual) {
                finalChangedSnapshotCount += 1;
              }
              expect.soft(
                snapshotsEqual,
                `${resource.name} was not restored after controlled cleanup`,
              ).toBe(true);
            }
          }

          expect.soft(finalChangedSnapshotCount).toBe(
            testCase.expected.finalChangedSnapshotCount,
          );
        }
      }
    }
  });
});
