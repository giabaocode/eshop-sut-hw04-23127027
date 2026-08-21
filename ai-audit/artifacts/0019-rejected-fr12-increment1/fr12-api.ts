import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import type {
  Fr12AdminApiSessionConfig,
  Fr12AdminRouteRecord,
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

export interface AdminSnapshotSession {
  loginSuccessful: boolean;
  loginStatus?: number;
  loginError?: string;
  capture(
    resources: readonly Fr12SnapshotResource[],
    routes: readonly Fr12AdminRouteRecord[],
  ): Promise<SnapshotAttempt[]>;
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

export function payloadContainsMarker(
  payload: Fr12JsonValue | undefined,
  marker: string,
): boolean {
  return valueContainsMarker(payload, marker);
}
