import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import type {
  Fr12AdminApiSessionConfig,
  Fr12AdminRouteRecord,
  Fr12ControlledCleanup,
  Fr12ControlledCleanupDefinition,
  Fr12ExplicitAuthorization,
  Fr12HttpMethod,
  Fr12JsonValue,
  Fr12RoleAwareApiSessionConfig,
  Fr12SnapshotResource,
  Fr12SnapshotResourceName,
  Fr12TargetRouteRecord,
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

export interface ExplicitAuthorizationProbeAttempt {
  route: Fr12TargetRouteRecord;
  transportSuccessful: boolean;
  authorizationPartition: Fr12ExplicitAuthorization['partition'];
  response?: ApiResponseObservation;
  error?: string;
}

export interface AuthenticatedApiIdentity {
  loginSuccessful: boolean;
  tokenPresent: boolean;
  roleEvidenceMatches: boolean;
  observedRole?: string;
  loginStatus?: number;
  loginError?: string;
  token?: string;
}

export interface ExpiredJwtFixtureValidation {
  token: string;
  segmentCount: number;
  algorithmMatches: boolean;
  expClaimNumeric: boolean;
  expiresBeforeCurrentTime: boolean;
  signatureValid: boolean;
}

export interface JsonResourceAttempt {
  successful: boolean;
  value?: unknown;
  status?: number;
  error?: string;
}

export interface ExactMarkerCleanupResult {
  discoverySuccessful: boolean;
  matchingRecordCount: number;
  mutations: ControlledCleanupMutationAttempt[];
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
    cleanups: readonly (Fr12ControlledCleanup | Fr12ControlledCleanupDefinition)[],
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

function resolveRoutePath(route: {
  key: string;
  path: string;
  pathParameters?: Record<string, string>;
}): string {
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
  cleanup: Fr12ControlledCleanup | Fr12ControlledCleanupDefinition,
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
  cleanup: Fr12ControlledCleanup | Fr12ControlledCleanupDefinition,
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
  cleanup: Fr12ControlledCleanup | Fr12ControlledCleanupDefinition,
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

function base64UrlJson(value: Record<string, Fr12JsonValue>): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function hs256Signature(signingInput: string, signingMaterial: string): Buffer {
  return createHmac('sha256', signingMaterial).update(signingInput).digest();
}

export function buildAndValidateExpiredJwtFixture(fixture: {
  algorithm: 'HS256';
  header: Record<string, Fr12JsonValue>;
  claims: Record<string, Fr12JsonValue>;
  signingMaterial: string;
}): ExpiredJwtFixtureValidation {
  const encodedHeader = base64UrlJson(fixture.header);
  const encodedClaims = base64UrlJson(fixture.claims);
  const signingInput = `${encodedHeader}.${encodedClaims}`;
  const signature = hs256Signature(signingInput, fixture.signingMaterial);
  const token = `${signingInput}.${signature.toString('base64url')}`;
  const segments = token.split('.');
  let decodedHeader: unknown;
  let decodedClaims: unknown;
  let decodedSignature = Buffer.alloc(0);

  try {
    decodedHeader = JSON.parse(
      Buffer.from(segments[0] ?? '', 'base64url').toString('utf8'),
    ) as unknown;
    decodedClaims = JSON.parse(
      Buffer.from(segments[1] ?? '', 'base64url').toString('utf8'),
    ) as unknown;
    decodedSignature = Buffer.from(segments[2] ?? '', 'base64url');
  } catch {
    decodedHeader = undefined;
    decodedClaims = undefined;
  }

  const expectedSignature = hs256Signature(
    `${segments[0] ?? ''}.${segments[1] ?? ''}`,
    fixture.signingMaterial,
  );
  const signatureValid =
    decodedSignature.length === expectedSignature.length &&
    timingSafeEqual(decodedSignature, expectedSignature);
  const algorithmMatches =
    fixture.algorithm === 'HS256' &&
    isRecord(decodedHeader) &&
    decodedHeader.alg === fixture.algorithm;
  const exp = isRecord(decodedClaims) ? decodedClaims.exp : undefined;
  const expClaimNumeric = typeof exp === 'number' && Number.isFinite(exp);

  return {
    token,
    segmentCount: segments.length,
    algorithmMatches,
    expClaimNumeric,
    expiresBeforeCurrentTime:
      expClaimNumeric && exp < Math.floor(Date.now() / 1_000),
    signatureValid,
  };
}

export async function acquireRoleAwareApiIdentity(
  request: APIRequestContext,
  apiBaseUrl: string,
  config: Fr12RoleAwareApiSessionConfig,
): Promise<AuthenticatedApiIdentity> {
  try {
    const response = await request.fetch(
      absoluteApiUrl(apiBaseUrl, config.login.path),
      {
        method: config.login.method,
        data: config.login.credentials,
      },
    );
    const body = await parseResponseBody(response);
    const tokenCandidate = isRecord(body)
      ? body[config.login.tokenProperty]
      : undefined;
    const userCandidate = isRecord(body) ? body[config.userProperty] : undefined;
    const roleCandidate = isRecord(userCandidate)
      ? userCandidate[config.roleProperty]
      : undefined;
    const token =
      typeof tokenCandidate === 'string' && tokenCandidate !== ''
        ? tokenCandidate
        : undefined;
    const observedRole =
      typeof roleCandidate === 'string' ? roleCandidate : undefined;
    let loginError: string | undefined;

    if (!response.ok()) {
      loginError = `Login was not successful (status ${response.status()})`;
    } else if (token === undefined) {
      loginError = `Successful login omitted the configured token property`;
    } else if (observedRole === undefined) {
      loginError = `Successful login omitted configured role evidence`;
    }

    return {
      loginSuccessful: response.ok(),
      tokenPresent: token !== undefined,
      roleEvidenceMatches: observedRole === config.expectedRole,
      observedRole,
      loginStatus: response.status(),
      loginError,
      token,
    };
  } catch (error) {
    return {
      loginSuccessful: false,
      tokenPresent: false,
      roleEvidenceMatches: false,
      loginError: `Login transport failed: ${errorMessage(error)}`,
    };
  }
}

function explicitAuthorizationHeaders(
  authorization: Fr12ExplicitAuthorization,
  token: string | undefined,
): Record<string, string> | undefined {
  if (authorization.partition === 'missing_token') {
    if (authorization.header !== null) {
      throw new Error('Missing-token request must configure an absent header');
    }
    return undefined;
  }

  if (
    authorization.header === null ||
    authorization.scheme === undefined ||
    token === undefined ||
    token === ''
  ) {
    throw new Error(
      `${authorization.partition} request lacks configured Bearer material`,
    );
  }

  return {
    [authorization.header]: `${authorization.scheme} ${token}`,
  };
}

export async function probeExplicitAuthorizationRoute(
  request: APIRequestContext,
  apiBaseUrl: string,
  route: Fr12TargetRouteRecord,
  token: string | undefined,
): Promise<ExplicitAuthorizationProbeAttempt> {
  try {
    const headers = explicitAuthorizationHeaders(route.authorization, token);
    const response = await request.fetch(
      absoluteApiUrl(apiBaseUrl, resolveRoutePath(route)),
      {
        method: route.method,
        data: route.payload,
        headers,
      },
    );

    return {
      route,
      transportSuccessful: true,
      authorizationPartition: route.authorization.partition,
      response: await observedResponse(response),
    };
  } catch (error) {
    return {
      route,
      transportSuccessful: false,
      authorizationPartition: route.authorization.partition,
      error: errorMessage(error),
    };
  }
}

export async function requestJsonResource(
  request: APIRequestContext,
  apiBaseUrl: string,
  config: {
    method: Fr12HttpMethod;
    path: string;
    payload?: Fr12JsonValue;
    authorization?: Fr12ExplicitAuthorization;
  },
  token?: string,
): Promise<JsonResourceAttempt> {
  try {
    const headers =
      config.authorization === undefined
        ? undefined
        : explicitAuthorizationHeaders(config.authorization, token);
    const response = await request.fetch(absoluteApiUrl(apiBaseUrl, config.path), {
      method: config.method,
      data: config.payload,
      headers,
    });

    return {
      successful: response.ok(),
      value: await parseResponseBody(response),
      status: response.status(),
      error: response.ok()
        ? undefined
        : `Resource request returned status ${response.status()}`,
    };
  } catch (error) {
    return {
      successful: false,
      error: errorMessage(error),
    };
  }
}

export async function cleanupExactMarkerRecords(
  request: APIRequestContext,
  apiBaseUrl: string,
  snapshotValue: unknown,
  markerValues: readonly string[],
  config: {
    markerField: string;
    identifierField: 'id';
    method: 'DELETE';
    pathTemplate: string;
    authorization: Fr12ExplicitAuthorization;
  },
  token: string | undefined,
): Promise<ExactMarkerCleanupResult> {
  const result: ExactMarkerCleanupResult = {
    discoverySuccessful: false,
    matchingRecordCount: 0,
    mutations: [],
  };

  try {
    if (!Array.isArray(snapshotValue)) {
      throw new Error('Cleanup discovery requires an available array snapshot');
    }

    const configuredMarkers = new Set(markerValues);
    const matchingRecords = snapshotValue.filter(
      (record): record is Record<string, unknown> =>
        isRecord(record) &&
        typeof record[config.markerField] === 'string' &&
        configuredMarkers.has(record[config.markerField] as string),
    );
    const identifiers = matchingRecords.map(
      (record) => record[config.identifierField],
    );

    if (
      identifiers.some(
        (identifier) =>
          typeof identifier !== 'number' ||
          !Number.isSafeInteger(identifier) ||
          identifier <= 0,
      )
    ) {
      throw new Error(
        `Controlled cleanup found a non-positive-integer ${config.identifierField}`,
      );
    }

    const uniqueIdentifiers = [...new Set(identifiers as number[])];
    const placeholder = `:${config.identifierField}`;
    const placeholderCount = config.pathTemplate.split(placeholder).length - 1;

    if (placeholderCount !== 1) {
      throw new Error(
        `Controlled cleanup path must contain exactly one ${placeholder}`,
      );
    }
    result.discoverySuccessful = true;
    result.matchingRecordCount = matchingRecords.length;

    for (const identifier of uniqueIdentifiers) {
      const path = config.pathTemplate.replace(
        placeholder,
        encodeURIComponent(String(identifier)),
      );
      if (/:[A-Za-z][A-Za-z0-9_]*/u.test(path)) {
        throw new Error('Controlled cleanup path contains an unresolved parameter');
      }
      const cleanupAttempt = await requestJsonResource(
        request,
        apiBaseUrl,
        {
          method: config.method,
          path,
          authorization: config.authorization,
        },
        token,
      );
      result.mutations.push({
        identifier,
        successful: cleanupAttempt.successful,
        status: cleanupAttempt.status,
        error: cleanupAttempt.error,
      });
    }
  } catch (error) {
    result.error = errorMessage(error);
  }

  return result;
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
  attempt: MissingTokenProbeAttempt | ExplicitAuthorizationProbeAttempt,
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
  cleanups: readonly (Fr12ControlledCleanup | Fr12ControlledCleanupDefinition)[],
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

export function exactMatchingRecords(
  collection: unknown,
  markerField: string,
  markerValue: string,
): Record<string, unknown>[] {
  if (!Array.isArray(collection)) {
    return [];
  }

  return collection.filter(
    (record): record is Record<string, unknown> =>
      isRecord(record) && record[markerField] === markerValue,
  );
}

export function recordMatchesExpectedFields(
  record: Record<string, unknown>,
  expected: Record<string, Fr12JsonValue>,
): boolean {
  return Object.entries(expected).every(
    ([field, value]) =>
      JSON.stringify(normalizeValue(record[field])) ===
      JSON.stringify(normalizeValue(value)),
  );
}

export function strictPositiveIntegerField(
  value: unknown,
  field: string,
): number | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const candidate = value[field];
  return typeof candidate === 'number' &&
    Number.isSafeInteger(candidate) &&
    candidate > 0
    ? candidate
    : undefined;
}
