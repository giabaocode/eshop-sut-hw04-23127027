import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { AdminAccessPage } from '../pages/admin-access.page.js';
import {
  acquireRoleAwareApiIdentity,
  buildAndValidateExpiredJwtFixture,
  cleanupExactMarkerRecords,
  countMutationMarkerMatches,
  countControlledRecordMatches,
  createAdminSnapshotSession,
  exactMatchingRecords,
  normalizedSnapshotsEqual,
  payloadContainsMarker,
  probeExplicitAuthorizationRoute,
  probeMissingTokenRoute,
  recordMatchesExpectedFields,
  requestJsonResource,
  responseDiagnostics,
  responseReturnsProtectedData,
  strictPositiveIntegerField,
} from '../support/fr12-api.js';
import { loadJsonFile } from '../support/data-loader.js';
import type {
  Fr12AccessControlData,
  Fr12AdminRouteRecord,
  Fr12ControlledCleanupDefinition,
  Fr12ProductMatrixRow,
  Fr12ProductPayload,
  Fr12SnapshotResource,
  Fr12SnapshotResourceName,
  Fr12TargetRouteRecord,
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
const adminRouteInventoryInvalidTokensCase =
  data.admin_route_inventory_invalid_tokens;
const adminRouteInventoryUserTokenCase =
  data.admin_route_inventory_user_token;
const adminReadRoutesAdminTokenCase = data.admin_read_routes_admin_token;
const productMutationAccessMatrixCase = data.product_mutation_access_matrix;

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

function requireAuthenticatedToken(
  identity: Awaited<ReturnType<typeof acquireRoleAwareApiIdentity>>,
  expected: {
    loginSuccessful: boolean;
    tokenPresent: boolean;
    roleEvidenceMatches: boolean;
  },
  fixtureName: string,
): string {
  expect(
    identity.loginSuccessful,
    `${fixtureName} login prerequisite failed; status: ` +
      `${String(identity.loginStatus)}; error: ${String(identity.loginError)}`,
  ).toBe(expected.loginSuccessful);
  expect(
    identity.tokenPresent,
    `${fixtureName} login must provide a non-empty configured token`,
  ).toBe(expected.tokenPresent);
  expect(
    identity.roleEvidenceMatches,
    `${fixtureName} role evidence mismatch; observed role: ` +
      `${String(identity.observedRole)}`,
  ).toBe(expected.roleEvidenceMatches);

  if (identity.token === undefined) {
    throw new Error(`${fixtureName} token is unavailable after prerequisites`);
  }

  return identity.token;
}

function resolveProductPayload(
  payload: Fr12ProductPayload,
  referenceToken: string,
  categoryId: number,
): Fr12ProductPayload {
  expect(payload.category_id).toBe(referenceToken);

  return {
    ...payload,
    category_id: categoryId,
  };
}

function matrixTargetRoute(
  row: Fr12ProductMatrixRow,
  resolvedPayload: Fr12ProductPayload | undefined,
  targetId: number | undefined,
  protectedResource: Fr12SnapshotResourceName,
): Fr12TargetRouteRecord {
  return {
    key: row.key,
    method: row.method,
    path: row.path,
    pathParameters:
      row.path.includes(':id') && targetId !== undefined
        ? { id: String(targetId) }
        : undefined,
    payload: resolvedPayload,
    authorization: row.authorization,
    protectedResource,
  };
}

function productById(
  collection: unknown,
  identifier: number,
): Record<string, unknown> | undefined {
  if (!Array.isArray(collection)) {
    return undefined;
  }

  return collection.find(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' &&
      record !== null &&
      !Array.isArray(record) &&
      record.id === identifier,
  );
}

async function recordInventoryMutationEvidenceAndRestore(
  snapshotSession: AdminSnapshotSession,
  resources: readonly Fr12SnapshotResource[],
  beforeSnapshots: readonly SnapshotAttempt[],
  afterSnapshots: readonly SnapshotAttempt[],
  markers: readonly string[],
  cleanups: readonly Fr12ControlledCleanupDefinition[],
  expected: {
    snapshotAcquisitionSuccessful: boolean;
    finalSnapshotAcquisitionSuccessful: boolean;
    changedSnapshotCount: number;
    mutationMarkerMatches: number;
    cleanupDiscoverySuccessful: boolean;
    controlledMarkerMatchesAfterCleanup: number;
    finalChangedSnapshotCount: number;
  },
  partitionName: string,
): Promise<void> {
  try {
    recordSnapshotAcquisition(
      afterSnapshots,
      expected.snapshotAcquisitionSuccessful,
      `${partitionName} post-probe`,
    );

    let changedSnapshotCount = 0;
    for (const resource of resources) {
      const before = snapshotByResource(beforeSnapshots, resource.name);
      const after = snapshotByResource(afterSnapshots, resource.name);

      if (before?.successful && after?.successful) {
        const unchanged = normalizedSnapshotsEqual(before.value, after.value);
        if (!unchanged) {
          changedSnapshotCount += 1;
        }
        expect.soft(
          unchanged,
          `${resource.name} changed after ${partitionName} probes`,
        ).toBe(true);
      }
    }
    expect.soft(changedSnapshotCount).toBe(expected.changedSnapshotCount);
    expect.soft(
      countMutationMarkerMatches(
        [...beforeSnapshots, ...afterSnapshots],
        markers,
      ),
      `${partitionName} original mutation-marker evidence`,
    ).toBe(expected.mutationMarkerMatches);
  } finally {
    try {
      const cleanupResults = await snapshotSession.cleanupControlledRecords(
        cleanups,
        afterSnapshots,
      );
      expect.soft(cleanupResults).toHaveLength(cleanups.length);

      for (const cleanup of cleanups) {
        const result = cleanupResults.find(
          (candidate) => candidate.cleanupKey === cleanup.key,
        );
        expect.soft(
          result?.discoverySuccessful ?? false,
          `${partitionName} cleanup discovery ${cleanup.key} failed; ` +
            `matches: ${String(result?.matchingRecordCount)}; ` +
            `error: ${String(result?.error)}`,
        ).toBe(expected.cleanupDiscoverySuccessful);
        for (const mutation of result?.mutations ?? []) {
          expect.soft(
            mutation.successful,
            `${partitionName} cleanup ${cleanup.key} failed for controlled ` +
              `${cleanup.identifierField}=${mutation.identifier}; ` +
              `status: ${String(mutation.status)}; ` +
              `error: ${String(mutation.error)}`,
          ).toBe(cleanup.expected.responseSuccessful);
        }
      }
    } catch (error) {
      expect.soft(
        false,
        `${partitionName} controlled cleanup helper failed: ${errorMessage(error)}`,
      ).toBe(true);
    } finally {
      const finalSnapshots = await captureSnapshotsSafely(
        snapshotSession,
        resources,
        [],
        `${partitionName} post-cleanup`,
      );
      recordSnapshotAcquisition(
        finalSnapshots,
        expected.finalSnapshotAcquisitionSuccessful,
        `${partitionName} post-cleanup`,
      );
      expect.soft(countControlledRecordMatches(finalSnapshots, cleanups)).toBe(
        expected.controlledMarkerMatchesAfterCleanup,
      );

      let finalChangedSnapshotCount = 0;
      for (const resource of resources) {
        const before = snapshotByResource(beforeSnapshots, resource.name);
        const final = snapshotByResource(finalSnapshots, resource.name);
        if (before?.successful && final?.successful) {
          const restored = normalizedSnapshotsEqual(before.value, final.value);
          if (!restored) {
            finalChangedSnapshotCount += 1;
          }
          expect.soft(
            restored,
            `${resource.name} was not restored after ${partitionName} cleanup`,
          ).toBe(true);
        }
      }
      expect.soft(finalChangedSnapshotCount).toBe(
        expected.finalChangedSnapshotCount,
      );
    }
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

test.describe('FR-12 access control — reviewed increment 2', () => {
  test(`${adminRouteInventoryInvalidTokensCase.id} ${adminRouteInventoryInvalidTokensCase.title}`, async ({
    request,
  }) => {
    test.slow();
    const testCase = adminRouteInventoryInvalidTokensCase;
    const tokenClasses = [
      ...new Set(
        testCase.probes.map((probe) => probe.authorization.tokenClass),
      ),
    ];
    const cleanupKeys = testCase.controlledCleanup.map(
      (cleanup) => cleanup.key,
    );
    const markers = testCase.probes.flatMap((probe) =>
      probe.mutationMarker === undefined ? [] : [probe.mutationMarker],
    );

    expect(tokenClasses).toHaveLength(testCase.expected.tokenClassCount);
    expect(tokenClasses).toEqual(Object.keys(testCase.invalidTokens));
    expect(testCase.probes).toHaveLength(testCase.expected.probeCount);
    expect(testCase.controlledCleanup).toHaveLength(
      testCase.expected.cleanupMarkerCount,
    );
    expect(new Set(cleanupKeys).size).toBe(
      testCase.expected.cleanupMarkerCount,
    );
    for (const tokenClass of tokenClasses) {
      const classProbes = testCase.probes.filter(
        (probe) => probe.authorization.tokenClass === tokenClass,
      );
      const classRoutes = classProbes.map(
        (probe) => `${probe.method} ${probe.path}`,
      );
      expect(classProbes).toHaveLength(testCase.expected.routesPerTokenClass);
      expect(new Set(classRoutes).size).toBe(
        testCase.expected.routesPerTokenClass,
      );
    }
    for (const probe of testCase.probes) {
      expect(probe.authorization.partition).toBe('invalid_bearer');
      expect(probe.authorization.header).toBe(
        testCase.snapshotSession.authorizationHeader,
      );
      expect(probe.authorization.scheme).toBe(
        testCase.snapshotSession.bearerScheme,
      );
      if (probe.mutationMarker !== undefined) {
        expect(payloadContainsMarker(probe.payload, probe.mutationMarker)).toBe(
          true,
        );
      }
    }

    const expiredFixture = buildAndValidateExpiredJwtFixture(
      testCase.invalidTokens.expired,
    );
    expect(expiredFixture.segmentCount).toBe(
      testCase.expected.jwtSegmentCount,
    );
    expect(expiredFixture.algorithmMatches).toBe(
      testCase.expected.algorithmMatches,
    );
    expect(expiredFixture.expClaimNumeric).toBe(
      testCase.expected.expiredClaimNumeric,
    );
    expect(expiredFixture.expiresBeforeCurrentTime).toBe(
      testCase.expected.expiredBeforeCurrentTime,
    );
    expect(expiredFixture.signatureValid).toBe(
      testCase.expected.signatureValid,
    );
    expect(testCase.invalidTokens.malformed.value.length).toBeGreaterThan(0);

    const snapshotSession = await createAdminSnapshotSession(
      request,
      apiBaseUrl,
      testCase.snapshotSession,
    );
    expect(
      snapshotSession.loginSuccessful,
      `TC05 seeded-admin snapshot fixture failed; status: ` +
        `${String(snapshotSession.loginStatus)}; ` +
        `error: ${String(snapshotSession.loginError)}`,
    ).toBe(testCase.expected.snapshotSessionLoginSuccessful);
    const beforeSnapshots = await captureSnapshotsSafely(
      snapshotSession,
      testCase.snapshots,
      [],
      'TC05 pre-probe',
    );
    for (const snapshot of beforeSnapshots) {
      expect(
        snapshot.successful,
        `TC05 ${snapshot.resource} pre-probe snapshot unavailable; ` +
          `status: ${String(snapshot.status)}; error: ${String(snapshot.error)}`,
      ).toBe(testCase.expected.snapshotAcquisitionSuccessful);
    }

    let completedProbeResponses = 0;
    let successfulProbeResponses = 0;
    let protectedDataResponses = 0;
    let afterSnapshots: SnapshotAttempt[] = [];

    try {
      for (const probe of testCase.probes) {
        await test.step(
          `${probe.authorization.tokenClass} ${probe.method} ${probe.path}`,
          async () => {
            const token =
              probe.authorization.tokenClass === 'malformed'
                ? testCase.invalidTokens.malformed.value
                : expiredFixture.token;
            const attempt = await probeExplicitAuthorizationRoute(
              request,
              apiBaseUrl,
              probe,
              token,
            );
            expect.soft(
              attempt.transportSuccessful,
              `${probe.key} transport failure: ${String(attempt.error)}`,
            ).toBe(testCase.expected.probeTransportSuccessful);

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
                `${probe.key} invalid-token request must be denied; ` +
                  responseDiagnostics(attempt.response),
              ).toBe(testCase.expected.responseSuccessful);
              expect.soft(
                protectedDataReturned,
                `${probe.key} must not return protected ${probe.protectedResource} data`,
              ).toBe(testCase.expected.protectedDataReturned);
            }
          },
        );
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
        [],
        'TC05 post-probe',
      );
      await recordInventoryMutationEvidenceAndRestore(
        snapshotSession,
        testCase.snapshots,
        beforeSnapshots,
        afterSnapshots,
        markers,
        testCase.controlledCleanup,
        testCase.expected,
        'TC05 invalid-token',
      );
    }
  });

  test(`${adminRouteInventoryUserTokenCase.id} ${adminRouteInventoryUserTokenCase.title}`, async ({
    request,
  }) => {
    test.slow();
    const testCase = adminRouteInventoryUserTokenCase;
    const routeIdentities = testCase.routes.map(
      (route) => `${route.method} ${route.path}`,
    );
    const markers = testCase.routes.flatMap((route) =>
      route.mutationMarker === undefined ? [] : [route.mutationMarker],
    );

    expect(testCase.routes).toHaveLength(testCase.expected.routeCount);
    expect(new Set(routeIdentities).size).toBe(testCase.expected.routeCount);
    expect(testCase.controlledCleanup).toHaveLength(
      testCase.expected.cleanupMarkerCount,
    );
    for (const route of testCase.routes) {
      expect(route.authorization.partition).toBe('ordinary_user');
      if (route.mutationMarker !== undefined) {
        expect(payloadContainsMarker(route.payload, route.mutationMarker)).toBe(
          true,
        );
      }
    }

    const ordinaryIdentity = await acquireRoleAwareApiIdentity(
      request,
      apiBaseUrl,
      testCase.apiSession,
    );
    const ordinaryToken = requireAuthenticatedToken(
      ordinaryIdentity,
      testCase.expected,
      'TC06 seeded ordinary-user',
    );
    const snapshotSession = await createAdminSnapshotSession(
      request,
      apiBaseUrl,
      testCase.snapshotSession,
    );
    expect(
      snapshotSession.loginSuccessful,
      `TC06 seeded-admin snapshot fixture failed; status: ` +
        `${String(snapshotSession.loginStatus)}; ` +
        `error: ${String(snapshotSession.loginError)}`,
    ).toBe(testCase.expected.snapshotSessionLoginSuccessful);
    const beforeSnapshots = await captureSnapshotsSafely(
      snapshotSession,
      testCase.snapshots,
      [],
      'TC06 pre-probe',
    );
    for (const snapshot of beforeSnapshots) {
      expect(
        snapshot.successful,
        `TC06 ${snapshot.resource} pre-probe snapshot unavailable; ` +
          `status: ${String(snapshot.status)}; error: ${String(snapshot.error)}`,
      ).toBe(testCase.expected.snapshotAcquisitionSuccessful);
    }

    let completedProbeResponses = 0;
    let successfulProbeResponses = 0;
    let protectedDataResponses = 0;
    let afterSnapshots: SnapshotAttempt[] = [];

    try {
      for (const route of testCase.routes) {
        await test.step(
          `${route.method} ${route.path} with ordinary-user Bearer token`,
          async () => {
            const attempt = await probeExplicitAuthorizationRoute(
              request,
              apiBaseUrl,
              route,
              ordinaryToken,
            );
            expect.soft(
              attempt.transportSuccessful,
              `${route.key} transport failure: ${String(attempt.error)}`,
            ).toBe(testCase.expected.probeTransportSuccessful);

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
                `${route.key} authenticated ordinary user must be denied authorization; ` +
                  responseDiagnostics(attempt.response),
              ).toBe(testCase.expected.responseSuccessful);
              expect.soft(
                protectedDataReturned,
                `${route.key} must not return protected ${route.protectedResource} data`,
              ).toBe(testCase.expected.protectedDataReturned);
            }
          },
        );
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
        [],
        'TC06 post-probe',
      );
      await recordInventoryMutationEvidenceAndRestore(
        snapshotSession,
        testCase.snapshots,
        beforeSnapshots,
        afterSnapshots,
        markers,
        testCase.controlledCleanup,
        testCase.expected,
        'TC06 ordinary-user',
      );
    }
  });

  test(`${adminReadRoutesAdminTokenCase.id} ${adminReadRoutesAdminTokenCase.title}`, async ({
    request,
  }) => {
    const testCase = adminReadRoutesAdminTokenCase;
    expect(testCase.routes).toHaveLength(testCase.expected.routeCount);
    for (const route of testCase.routes) {
      expect(route.method).toBe('GET');
      expect(route.authorization.partition).toBe('admin');
      expect(route.payload).toBeUndefined();
      expect(route.mutationMarker).toBeUndefined();
    }

    const adminIdentity = await acquireRoleAwareApiIdentity(
      request,
      apiBaseUrl,
      testCase.apiSession,
    );
    const adminToken = requireAuthenticatedToken(
      adminIdentity,
      testCase.expected,
      'TC07 seeded admin',
    );
    let completedResponses = 0;
    let successfulResponses = 0;
    let protectedCollectionResponses = 0;

    for (const route of testCase.routes) {
      await test.step(`${route.method} ${route.path} with admin Bearer token`, async () => {
        const attempt = await probeExplicitAuthorizationRoute(
          request,
          apiBaseUrl,
          route,
          adminToken,
        );
        expect.soft(
          attempt.transportSuccessful,
          `${route.key} transport failure: ${String(attempt.error)}`,
        ).toBe(testCase.expected.probeTransportSuccessful);

        if (attempt.response !== undefined) {
          completedResponses += 1;
          if (attempt.response.successful) {
            successfulResponses += 1;
          }
          const responseBody = attempt.response.body;
          const collectionReturned = Array.isArray(responseBody);
          if (collectionReturned) {
            protectedCollectionResponses += 1;
          }
          expect.soft(
            attempt.response.successful,
            `${route.key} admin read must succeed; ` +
              responseDiagnostics(attempt.response),
          ).toBe(testCase.expected.responseSuccessful);
          expect.soft(
            collectionReturned,
            `${route.key} must return a protected collection representation`,
          ).toBe(testCase.expected.protectedCollectionReturned);

          if (collectionReturned) {
            if (!route.collectionOracle.allowEmpty) {
              expect.soft(responseBody.length).toBeGreaterThan(0);
            }
            const identityField = route.collectionOracle.identityField;
            const expectedIdentities =
              route.collectionOracle.expectedIdentities ?? [];
            if (identityField !== undefined) {
              const observedIdentities = responseBody.flatMap(
                (record) =>
                  typeof record === 'object' &&
                  record !== null &&
                  !Array.isArray(record) &&
                  typeof (record as Record<string, unknown>)[identityField] ===
                    'string'
                    ? [
                        (record as Record<string, string>)[identityField] as string,
                      ]
                    : [],
              );
              for (const expectedIdentity of expectedIdentities) {
                expect.soft(observedIdentities).toContain(expectedIdentity);
              }
            }
          }
        }
      });
    }

    expect.soft(completedResponses).toBe(testCase.expected.completedResponses);
    expect.soft(successfulResponses).toBe(
      testCase.expected.successfulResponses,
    );
    expect.soft(protectedCollectionResponses).toBe(
      testCase.expected.protectedCollectionResponses,
    );
  });

  test(`${productMutationAccessMatrixCase.id} ${productMutationAccessMatrixCase.title}`, async ({
    request,
  }) => {
    test.slow();
    const testCase = productMutationAccessMatrixCase;
    const rowIdentities = testCase.rows.map(
      (row) => `${row.method} ${row.authorization.partition}`,
    );
    const methods = new Set(testCase.rows.map((row) => row.method));
    const partitions = new Set(
      testCase.rows.map((row) => row.authorization.partition),
    );
    const primaryMarkers = testCase.rows.map(
      (row) => row.controlledMarker.value,
    );
    const cleanupMarkers = testCase.rows.flatMap(
      (row) => row.cleanupInvariantMarkers,
    );

    expect(testCase.rows).toHaveLength(testCase.expected.rowCount);
    expect(new Set(rowIdentities).size).toBe(testCase.expected.rowCount);
    expect(methods.size).toBe(testCase.expected.methodCount);
    expect(partitions.size).toBe(testCase.expected.tokenPartitionCount);
    expect(new Set(primaryMarkers).size).toBe(testCase.expected.rowCount);
    expect(new Set(cleanupMarkers).size).toBe(cleanupMarkers.length);

    const ordinaryIdentity = await acquireRoleAwareApiIdentity(
      request,
      apiBaseUrl,
      testCase.apiSessions.ordinaryUser,
    );
    const ordinaryToken = requireAuthenticatedToken(
      ordinaryIdentity,
      testCase.expected,
      'TC08 seeded ordinary-user',
    );
    const adminIdentity = await acquireRoleAwareApiIdentity(
      request,
      apiBaseUrl,
      testCase.apiSessions.admin,
    );
    const adminToken = requireAuthenticatedToken(
      adminIdentity,
      testCase.expected,
      'TC08 seeded admin',
    );

    const categoryAttempt = await requestJsonResource(
      request,
      apiBaseUrl,
      testCase.categoryReference,
    );
    expect(
      categoryAttempt.successful,
      `TC08 category read failed; status: ${String(categoryAttempt.status)}; ` +
        `error: ${String(categoryAttempt.error)}`,
    ).toBe(testCase.expected.categoryReadSuccessful);
    const matchingCategories = exactMatchingRecords(
      categoryAttempt.value,
      testCase.categoryReference.markerField,
      testCase.categoryReference.markerValue,
    );
    expect(matchingCategories.length > 0).toBe(
      testCase.expected.categoryReferenceFound,
    );
    const categoryId = strictPositiveIntegerField(
      matchingCategories[0],
      testCase.categoryReference.identifierField,
    );
    expect(categoryId).toBeDefined();
    if (categoryId === undefined) {
      throw new Error('TC08 category reference lacks a strict positive-integer id');
    }

    const baseline = await requestJsonResource(
      request,
      apiBaseUrl,
      testCase.productSnapshot,
    );
    expect(
      baseline.successful && Array.isArray(baseline.value),
      `TC08 baseline product snapshot unavailable; status: ` +
        `${String(baseline.status)}; error: ${String(baseline.error)}`,
    ).toBe(testCase.expected.baselineSnapshotSuccessful);

    const setupIdentifiers = new Map<string, number>();
    let completedTargetResponses = 0;

    try {
      for (const row of testCase.rows) {
        if (row.setup === undefined) {
          continue;
        }
        const setupPayload = resolveProductPayload(
          row.setup.payload,
          testCase.categoryReference.payloadReferenceToken,
          categoryId,
        );
        const setupAttempt = await requestJsonResource(
          request,
          apiBaseUrl,
          {
            method: row.setup.method,
            path: row.setup.path,
            payload: setupPayload,
            authorization: row.setup.authorization,
          },
          adminToken,
        );
        expect(
          setupAttempt.successful,
          `${row.key} controlled admin setup failed; status: ` +
            `${String(setupAttempt.status)}; error: ${String(setupAttempt.error)}`,
        ).toBe(row.setup.expected.responseSuccessful);
        const identifier = strictPositiveIntegerField(
          setupAttempt.value,
          row.setup.responseIdentifierField,
        );
        expect(identifier !== undefined).toBe(
          row.setup.expected.strictPositiveIntegerId,
        );
        if (identifier === undefined) {
          throw new Error(`${row.key} setup did not return a controlled id`);
        }
        setupIdentifiers.set(row.key, identifier);
      }

      const setupSnapshot = await requestJsonResource(
        request,
        apiBaseUrl,
        testCase.productSnapshot,
      );
      expect(
        setupSnapshot.successful && Array.isArray(setupSnapshot.value),
        `TC08 setup verification snapshot unavailable; status: ` +
          `${String(setupSnapshot.status)}; error: ${String(setupSnapshot.error)}`,
      ).toBe(testCase.expected.setupSuccessful);
      for (const row of testCase.rows) {
        if (row.setup === undefined) {
          continue;
        }
        const identifier = setupIdentifiers.get(row.key);
        const record =
          identifier === undefined
            ? undefined
            : productById(setupSnapshot.value, identifier);
        const expectedSetup = resolveProductPayload(
          row.setup.payload,
          testCase.categoryReference.payloadReferenceToken,
          categoryId,
        );
        expect(
          record !== undefined && recordMatchesExpectedFields(record, expectedSetup),
          `${row.key} controlled setup product must exist with configured fields`,
        ).toBe(row.setup.expected.productPresent);
      }

      for (const row of testCase.rows) {
        await test.step(
          `${row.method} products with ${row.authorization.partition}`,
          async () => {
            const targetId = setupIdentifiers.get(row.key);
            const resolvedPayload =
              row.payload === undefined
                ? undefined
                : resolveProductPayload(
                    row.payload,
                    testCase.categoryReference.payloadReferenceToken,
                    categoryId,
                  );
            const route = matrixTargetRoute(
              row,
              resolvedPayload,
              targetId,
              testCase.productSnapshot.resource,
            );
            const token =
              row.authorization.partition === 'ordinary_user'
                ? ordinaryToken
                : row.authorization.partition === 'admin'
                  ? adminToken
                  : undefined;
            const attempt = await probeExplicitAuthorizationRoute(
              request,
              apiBaseUrl,
              route,
              token,
            );
            expect.soft(
              attempt.transportSuccessful,
              `${row.key} target transport failed: ${String(attempt.error)}`,
            ).toBe(testCase.expected.targetTransportSuccessful);
            if (attempt.response !== undefined) {
              completedTargetResponses += 1;
              expect.soft(
                attempt.response.successful,
                `${row.key} ${row.expected.accessObservation}; ` +
                  responseDiagnostics(attempt.response),
              ).toBe(row.expected.responseSuccessful);
            }

            const stateAttempt = await requestJsonResource(
              request,
              apiBaseUrl,
              testCase.productSnapshot,
            );
            expect.soft(
              stateAttempt.successful && Array.isArray(stateAttempt.value),
              `${row.key} post-target state unavailable; status: ` +
                `${String(stateAttempt.status)}; error: ${String(stateAttempt.error)}`,
            ).toBe(testCase.expected.targetStateSnapshotSuccessful);
            if (!stateAttempt.successful || !Array.isArray(stateAttempt.value)) {
              return;
            }

            const expectedProduct =
              row.expectedProduct === undefined
                ? undefined
                : resolveProductPayload(
                    row.expectedProduct,
                    testCase.categoryReference.payloadReferenceToken,
                    categoryId,
                  );
            const markerMatches = exactMatchingRecords(
              stateAttempt.value,
              row.controlledMarker.field,
              row.controlledMarker.value,
            );

            if (row.expected.stateObservation === 'controlled_product_absent') {
              expect.soft(markerMatches).toHaveLength(0);
            } else if (
              row.expected.stateObservation === 'controlled_target_removed'
            ) {
              expect.soft(
                targetId === undefined
                  ? false
                  : productById(stateAttempt.value, targetId) === undefined,
                `${row.key} controlled target must be removed`,
              ).toBe(true);
            } else {
              const targetRecord =
                targetId === undefined
                  ? markerMatches[0]
                  : productById(stateAttempt.value, targetId);
              expect.soft(
                targetRecord !== undefined &&
                  expectedProduct !== undefined &&
                  recordMatchesExpectedFields(targetRecord, expectedProduct),
                `${row.key} state must satisfy ${row.expected.stateObservation}`,
              ).toBe(true);
            }
          },
        );
      }

      expect.soft(completedTargetResponses).toBe(
        testCase.expected.completedTargetResponses,
      );
    } finally {
      const preCleanup = await requestJsonResource(
        request,
        apiBaseUrl,
        testCase.productSnapshot,
      );
      expect.soft(
        preCleanup.successful && Array.isArray(preCleanup.value),
        `TC08 pre-cleanup matrix state unavailable; status: ` +
          `${String(preCleanup.status)}; error: ${String(preCleanup.error)}`,
      ).toBe(testCase.expected.preCleanupSnapshotSuccessful);

      const cleanupResult = await cleanupExactMarkerRecords(
        request,
        apiBaseUrl,
        preCleanup.value,
        cleanupMarkers,
        testCase.cleanup,
        adminToken,
      );
      expect.soft(
        cleanupResult.discoverySuccessful,
        `TC08 exact-marker cleanup discovery failed; matches: ` +
          `${cleanupResult.matchingRecordCount}; error: ${String(cleanupResult.error)}`,
      ).toBe(testCase.expected.cleanupDiscoverySuccessful);
      for (const mutation of cleanupResult.mutations) {
        expect.soft(
          mutation.successful,
          `TC08 cleanup failed for controlled id=${mutation.identifier}; ` +
            `status: ${String(mutation.status)}; ` +
            `error: ${String(mutation.error)}`,
        ).toBe(testCase.expected.cleanupResponseSuccessful);
      }

      const finalSnapshot = await requestJsonResource(
        request,
        apiBaseUrl,
        testCase.productSnapshot,
      );
      expect.soft(
        finalSnapshot.successful && Array.isArray(finalSnapshot.value),
        `TC08 final product snapshot unavailable; status: ` +
          `${String(finalSnapshot.status)}; error: ${String(finalSnapshot.error)}`,
      ).toBe(testCase.expected.finalSnapshotSuccessful);
      if (
        baseline.successful &&
        finalSnapshot.successful &&
        Array.isArray(baseline.value) &&
        Array.isArray(finalSnapshot.value)
      ) {
        expect.soft(
          normalizedSnapshotsEqual(baseline.value, finalSnapshot.value),
          'TC08 final product collection must equal the pre-test baseline',
        ).toBe(testCase.expected.finalMatchesBaseline);
      }
    }
  });
});
