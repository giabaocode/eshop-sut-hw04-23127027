import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import type {
  Fr12AdminApiSessionConfig,
  Fr12AdminRouteRecord,
  Fr12ControlledCleanup,
  Fr12JsonValue,
  Fr12SnapshotResource,
  Fr12SnapshotResourceName,
} from './data-loader.js';

export interface ApiResponseObservation {
  successful: boolean;
  status: number;
  body: unknown;
}

export interface MissingTokenProbeAttempt {
  route: Fr12AdminRouteRecord;
  transportSuccessful: boolean;
  authorizationHeaderPresent: boolean;
  response?: ApiResponseObservation;
  error?: string;
}

export interface SnapshotAttempt {
  resource: Fr12SnapshotResourceName;
  successful: boolean;
  value?: unknown;
  status?: number;
  error?: string;
}

export interface ControlledCleanupMutationAttempt {
  identifier: number;
  successful: boolean;
  status?: number;
  error?: string;
}

export interface ControlledCleanupResult {
  cleanupKey: string;
  discoverySuccessful: boolean;
  matchingRecordCount: number;
  mutations: ControlledCleanupMutationAttempt[];
  error?: string;
}

export interface AdminSnapshotSession {
  loginSuccessful: boolean;
  loginStatus?: number;
  loginError?: string;
  capture(
    resources: readonly Fr12SnapshotResource[],
    routes: readonly Fr12AdminRouteRecord[],
  ): Promise<SnapshotAttempt[]>;
  cleanupControlledRecords(
    cleanups: readonly Fr12ControlledCleanup[],
    postProbeSnapshots: readonly SnapshotAttempt[],
  ): Promise<ControlledCleanupResult[]>;
}

function absoluteApiUrl(apiBaseUrl: string, path: string): string {
  return `${apiBaseUrl.replace(/\/$/u, '')}/${path.replace(/^\//u, '')}`;
}

export async function parseResponseBody(response: APIResponse): Promise<unknown> {
  const text = await response.text();

  if (text === '') {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function responseDiagnostics(
  observation: ApiResponseObservation,
): string {
  return `status: ${observation.status}; body: ${JSON.stringify(observation.body)}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveRoutePath(route: Fr12AdminRouteRecord): string {
  let resolvedPath = route.path;

  for (const [name, value] of Object.entries(route.pathParameters ?? {})) {
    resolvedPath = resolvedPath.replaceAll(`:${name}`, encodeURIComponent(value));
  }

  if (/:[A-Za-z][A-Za-z0-9_]*/u.test(resolvedPath)) {
    throw new Error(`Unresolved path parameter in ${route.key}: ${resolvedPath}`);
  }

  return resolvedPath;
}

function snapshotPath(
  resource: Fr12SnapshotResource,
  routes: readonly Fr12AdminRouteRecord[],
): string {
  if (resource.path !== undefined) {
    return resource.path;
  }

  const matchingRoute = routes.find(
    (route) => route.key === resource.targetRouteKey,
  );

  if (matchingRoute === undefined) {
    throw new Error(
      `Snapshot ${resource.name} references unknown route ${String(resource.targetRouteKey)}`,
    );
  }

  if (matchingRoute.method !== resource.method) {
    throw new Error(
      `Snapshot ${resource.name} method does not match ${matchingRoute.key}`,
    );
  }

  return resolveRoutePath(matchingRoute);
}

function cleanupPath(
  cleanup: Fr12ControlledCleanup,
  identifier: number,
): string {
  const placeholder = `:${cleanup.identifierField}`;
  const placeholderCount = cleanup.pathTemplate.split(placeholder).length - 1;

  if (placeholderCount !== 1) {
    throw new Error(
      `Cleanup ${cleanup.key} path must contain exactly one ${placeholder}`,
    );
  }

  const resolvedPath = cleanup.pathTemplate.replace(
    placeholder,
    encodeURIComponent(String(identifier)),
  );

  if (/:[A-Za-z][A-Za-z0-9_]*/u.test(resolvedPath)) {
    throw new Error(
      `Unresolved cleanup path parameter in ${cleanup.key}: ${resolvedPath}`,
    );
  }

  return resolvedPath;
}

function exactControlledRecords(
  snapshotValue: unknown,
  cleanup: Fr12ControlledCleanup,
): Record<string, unknown>[] {
  if (!Array.isArray(snapshotValue)) {
    throw new Error(
      `Cleanup ${cleanup.key} requires an array snapshot for ${cleanup.snapshotResource}`,
    );
  }

  return snapshotValue.filter(
    (record): record is Record<string, unknown> =>
      isRecord(record) &&
      record[cleanup.markerField] === cleanup.markerValue,
  );
}

function controlledRecordIdentifiers(
  records: readonly Record<string, unknown>[],
  cleanup: Fr12ControlledCleanup,
): number[] {
  const identifiers = records.map((record) => record[cleanup.identifierField]);

  if (
    identifiers.some(
      (identifier) =>
        typeof identifier !== 'number' ||
        !Number.isSafeInteger(identifier) ||
        identifier <= 0,
    )
  ) {
    throw new Error(
      `Cleanup ${cleanup.key} found a controlled record without a strict positive-integer ${cleanup.identifierField}`,
    );
  }

  return [...new Set(identifiers as number[])];
}

async function observedResponse(
  response: APIResponse,
): Promise<ApiResponseObservation> {
  return {
    successful: response.ok(),
    status: response.status(),
    body: await parseResponseBody(response),
  };
}

export async function createAdminSnapshotSession(
  request: APIRequestContext,
  apiBaseUrl: string,
  config: Fr12AdminApiSessionConfig,
): Promise<AdminSnapshotSession> {
  let token: string | undefined;
  let loginStatus: number | undefined;
  let loginError: string | undefined;

  try {
    const response = await request.fetch(
      absoluteApiUrl(apiBaseUrl, config.login.path),
      {
        method: config.login.method,
        data: config.login.credentials,
      },
    );
    loginStatus = response.status();
    const body = await parseResponseBody(response);
    const candidate = isRecord(body) ? body[config.login.tokenProperty] : undefined;

    if (!response.ok()) {
      loginError = `Snapshot-session login was not successful (status ${loginStatus})`;
    } else if (typeof candidate !== 'string' || candidate === '') {
      loginError =
        `Snapshot-session login omitted ${config.login.tokenProperty}`;
    } else {
      token = candidate;
    }
  } catch (error) {
    loginError = `Snapshot-session login failed: ${errorMessage(error)}`;
  }

  return {
    loginSuccessful: token !== undefined,
    loginStatus,
    loginError,
    capture: async (resources, routes) => {
      if (token === undefined) {
        return resources.map((resource) => ({
          resource: resource.name,
          successful: false,
          error: loginError ?? 'Snapshot-session token is unavailable',
        }));
      }

      const attempts: SnapshotAttempt[] = [];
      for (const resource of resources) {
        try {
          const path = snapshotPath(resource, routes);
          const response = await request.fetch(absoluteApiUrl(apiBaseUrl, path), {
            method: resource.method,
            headers: {
              [config.authorizationHeader]: `${config.bearerScheme} ${token}`,
            },
          });
          const body = await parseResponseBody(response);
          attempts.push({
            resource: resource.name,
            successful: response.ok(),
            value: body,
            status: response.status(),
            error: response.ok()
              ? undefined
              : `Snapshot read returned status ${response.status()}`,
          });
        } catch (error) {
          attempts.push({
            resource: resource.name,
            successful: false,
            error: errorMessage(error),
          });
        }
      }

      return attempts;
    },
    cleanupControlledRecords: async (cleanups, postProbeSnapshots) => {
      const results: ControlledCleanupResult[] = [];

      for (const cleanup of cleanups) {
        const result: ControlledCleanupResult = {
          cleanupKey: cleanup.key,
          discoverySuccessful: false,
          matchingRecordCount: 0,
          mutations: [],
        };

        if (token === undefined) {
          result.error =
            loginError ?? 'Snapshot-session token is unavailable for cleanup';
          results.push(result);
          continue;
        }

        const snapshot = postProbeSnapshots.find(
          (attempt) => attempt.resource === cleanup.snapshotResource,
        );

        if (snapshot?.successful !== true) {
          result.error =
            `Successful post-probe ${cleanup.snapshotResource} snapshot is unavailable; ` +
            `status: ${String(snapshot?.status)}; error: ${String(snapshot?.error)}`;
          results.push(result);
          continue;
        }

        try {
          const matchingRecords = exactControlledRecords(snapshot.value, cleanup);
          const identifiers = controlledRecordIdentifiers(matchingRecords, cleanup);
          result.discoverySuccessful = true;
          result.matchingRecordCount = matchingRecords.length;

          for (const identifier of identifiers) {
            try {
              const response = await request.fetch(
                absoluteApiUrl(
                  apiBaseUrl,
                  cleanupPath(cleanup, identifier),
                ),
                {
                  method: cleanup.method,
                  headers: {
                    [config.authorizationHeader]:
                      `${config.bearerScheme} ${token}`,
                  },
                },
              );
              result.mutations.push({
                identifier,
                successful: response.ok(),
                status: response.status(),
                error: response.ok()
                  ? undefined
                  : `Cleanup returned status ${response.status()}; body: ${JSON.stringify(await parseResponseBody(response))}`,
              });
            } catch (error) {
              result.mutations.push({
                identifier,
                successful: false,
                error: errorMessage(error),
              });
            }
          }
        } catch (error) {
          result.error = errorMessage(error);
        }

        results.push(result);
      }

      return results;
    },
  };
}

export async function probeMissingTokenRoute(
  request: APIRequestContext,
  apiBaseUrl: string,
  route: Fr12AdminRouteRecord,
): Promise<MissingTokenProbeAttempt> {
  const authorizationHeaderPresent = route.authorizationHeader !== null;

  if (authorizationHeaderPresent) {
    return {
      route,
      transportSuccessful: false,
      authorizationHeaderPresent,
      error: `${route.key} is not configured as a missing-token probe`,
    };
  }

  try {
    const response = await request.fetch(
      absoluteApiUrl(apiBaseUrl, resolveRoutePath(route)),
      {
        method: route.method,
        data: route.payload,
      },
    );

    return {
      route,
      transportSuccessful: true,
      authorizationHeaderPresent,
      response: await observedResponse(response),
    };
  } catch (error) {
    return {
      route,
      transportSuccessful: false,
      authorizationHeaderPresent,
      error: errorMessage(error),
    };
  }
}

function normalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(normalizeValue)
      .sort((left, right) =>
        JSON.stringify(left).localeCompare(JSON.stringify(right)),
      );
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeValue(value[key])]),
    );
  }

  return value;
}

export function normalizedSnapshotsEqual(
  before: unknown,
  after: unknown,
): boolean {
  return JSON.stringify(normalizeValue(before)) === JSON.stringify(normalizeValue(after));
}

function containsNormalizedValue(container: unknown, target: unknown): boolean {
  if (
    JSON.stringify(normalizeValue(container)) ===
    JSON.stringify(normalizeValue(target))
  ) {
    return true;
  }

  if (Array.isArray(container)) {
    return container.some((value) => containsNormalizedValue(value, target));
  }

  if (isRecord(container)) {
    return Object.values(container).some((value) =>
      containsNormalizedValue(value, target),
    );
  }

  return false;
}

export function responseReturnsProtectedData(
  attempt: MissingTokenProbeAttempt,
  beforeSnapshots: readonly SnapshotAttempt[],
): boolean {
  const body = attempt.response?.body;

  if (body === undefined || body === null) {
    return false;
  }

  if (attempt.route.method === 'GET' && Array.isArray(body)) {
    return true;
  }

  const protectedSnapshot = beforeSnapshots.find(
    (snapshot) =>
      snapshot.resource === attempt.route.protectedResource &&
      snapshot.successful,
  );

  if (protectedSnapshot?.value === undefined) {
    return false;
  }

  const protectedRecords = Array.isArray(protectedSnapshot.value)
    ? protectedSnapshot.value
    : [protectedSnapshot.value];

  return protectedRecords.some((record) =>
    containsNormalizedValue(body, record),
  );
}

function valueContainsMarker(value: unknown, marker: string): boolean {
  if (typeof value === 'string') {
    return value.includes(marker);
  }

  if (Array.isArray(value)) {
    return value.some((entry) => valueContainsMarker(entry, marker));
  }

  if (isRecord(value)) {
    return Object.values(value).some((entry) =>
      valueContainsMarker(entry, marker),
    );
  }

  return false;
}

export function countMutationMarkerMatches(
  snapshots: readonly SnapshotAttempt[],
  markers: readonly string[],
): number {
  return snapshots.reduce((matchCount, snapshot) => {
    if (!snapshot.successful) {
      return matchCount;
    }

    return (
      matchCount +
      markers.filter((marker) => valueContainsMarker(snapshot.value, marker)).length
    );
  }, 0);
}

export function countControlledRecordMatches(
  snapshots: readonly SnapshotAttempt[],
  cleanups: readonly Fr12ControlledCleanup[],
): number {
  return cleanups.reduce((matchCount, cleanup) => {
    const snapshot = snapshots.find(
      (attempt) =>
        attempt.resource === cleanup.snapshotResource && attempt.successful,
    );

    if (snapshot === undefined || !Array.isArray(snapshot.value)) {
      return matchCount;
    }

    return (
      matchCount +
      snapshot.value.filter(
        (record) =>
          isRecord(record) &&
          record[cleanup.markerField] === cleanup.markerValue,
      ).length
    );
  }, 0);
}

export function payloadContainsMarker(
  payload: Fr12JsonValue | undefined,
  marker: string,
): boolean {
  return valueContainsMarker(payload, marker);
}
