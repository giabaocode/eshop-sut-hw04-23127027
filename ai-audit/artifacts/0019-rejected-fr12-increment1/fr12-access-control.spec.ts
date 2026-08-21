import { expect, test } from '@playwright/test';
import { AdminAccessPage } from '../pages/admin-access.page.js';
import {
  countMutationMarkerMatches,
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
  Fr12SnapshotResourceName,
} from '../support/data-loader.js';
import type { SnapshotAttempt } from '../support/fr12-api.js';

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

test.describe('FR-12 access control — reviewed increment 1', () => {
  test(`${adminUiNoTokenCase.id} ${adminUiNoTokenCase.title}`, async ({
    page,
  }) => {
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

      await expect.soft(admin.loginForm).toHaveCount(
        testCase.expected.counts.loginForms,
      );
      await expect.soft(admin.loginHeading).toBeVisible();
      await expect.soft(admin.emailControl).toHaveCount(
        testCase.expected.counts.emailControls,
      );
      await expect.soft(admin.emailControl).toBeVisible();
      await expect.soft(admin.passwordControl).toHaveCount(
        testCase.expected.counts.passwordControls,
      );
      await expect.soft(admin.passwordControl).toBeVisible();
      await expect.soft(admin.submitButton).toHaveCount(
        testCase.expected.counts.submitButtons,
      );
      await expect.soft(admin.submitButton).toBeVisible();
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
      await expect.soft(admin.loginForm).toBeVisible();
      await expect.soft(admin.emailControl).toBeVisible();
      await expect.soft(admin.passwordControl).toBeVisible();
      await expect.soft(admin.submitButton).toBeVisible();

      await admin.loginOnce(testCase.credentials);
      loginSubmitActivations += 1;

      await expect.soft(admin.loginForm).toHaveCount(
        testCase.expected.counts.loginForms,
      );
      await expect.soft(admin.loginForm).toBeVisible();
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
      await expect.soft(admin.loginForm).toBeVisible();
      await expect.soft(admin.emailControl).toBeVisible();
      await expect.soft(admin.passwordControl).toBeVisible();
      await expect.soft(admin.submitButton).toBeVisible();

      await admin.loginOnce(testCase.credentials);
      loginSubmitActivations += 1;

      await expect.soft(admin.protectedAdminIdentity).toHaveCount(
        testCase.expected.counts.protectedAdminIdentities,
      );
      await expect.soft(admin.protectedAdminIdentity).toBeVisible();
      await expect.soft(admin.dashboardIdentity).toHaveCount(
        testCase.expected.counts.dashboardIdentities,
      );
      await expect.soft(admin.dashboardIdentity).toBeVisible();
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
    const markers = testCase.routes.flatMap((route) =>
      route.mutationMarker === undefined ? [] : [route.mutationMarker],
    );

    expect(testCase.routes).toHaveLength(testCase.expected.targetRouteCount);
    expect(new Set(routeKeys).size).toBe(testCase.expected.targetRouteCount);
    expect(testCase.snapshots).toHaveLength(
      testCase.expected.snapshotResourceCount,
    );
    expect(markers).toHaveLength(testCase.expected.mutationMarkerCount);
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

    const beforeSnapshots = await snapshotSession.capture(
      testCase.snapshots,
      testCase.routes,
    );
    recordSnapshotAcquisition(
      beforeSnapshots,
      testCase.expected.snapshotAcquisitionSuccessful,
      'Pre-probe',
    );

    let completedProbeResponses = 0;
    let successfulProbeResponses = 0;
    let protectedDataResponses = 0;

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

    const afterSnapshots = await snapshotSession.capture(
      testCase.snapshots,
      testCase.routes,
    );
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
  });
});
