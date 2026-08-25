# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr12-access-control.spec.ts >> FR-12 access control — reviewed increment 2 >> FR12-TC06 ordinary-user probes cover every Admin route with an explicit order-status evidence boundary
- Location: tests/features/fr12-access-control.spec.ts:1124:7

# Error details

```
Error: user_admin_import_products_post authenticated ordinary user must be denied authorization; status: 200; body: {"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_coupons_post authenticated ordinary user must be denied authorization; status: 200; body: {"message":"Coupon created","id":5}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_coupons_delete authenticated ordinary user must be denied authorization; status: 200; body: {"message":"Coupon deleted"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_users_get authenticated ordinary user must be denied authorization; status: 200; body: [{"id":1,"name":"Admin User","email":"admin@eshop.com","role":"admin","login_attempts":0,"locked_until":null,"shipping_address":null},{"id":2,"name":"Test User","email":"test@eshop.com","role":"user","login_attempts":0,"locked_until":null,"shipping_address":null}]

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_users_get must not return protected users data

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_users_delete authenticated ordinary user must be denied authorization; status: 200; body: {"message":"User deleted"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_orders_get authenticated ordinary user must be denied authorization; status: 200; body: []

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_orders_get must not return protected orders data

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: user_admin_orders_status_put EVIDENCE MISSING: For a non-existing order ID, an access-control bypass can reach the business handler and return Order not found, so a generic non-success response plus unchanged snapshots cannot prove ordinary-user authorization denial. Retain the one-shot response and post-target state for human triage, but do not assert an unsupported exact status or wording and do not count this route as a verified denial. Original one-shot target response evidence: status: 404; body: {"error":"Order not found"}

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 6
Received: 0
```

```
Error: products changed after TC06 ordinary-user probes

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: coupons changed after TC06 ordinary-user probes

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

```
Error: TC06 ordinary-user original mutation-marker evidence

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

# Test source

```ts
  146 | }
  147 | 
  148 | function resolveProductPayload(
  149 |   payload: Fr12ProductPayload,
  150 |   referenceToken: string,
  151 |   categoryId: number,
  152 | ): Fr12ProductPayload {
  153 |   expect(payload.category_id).toBe(referenceToken);
  154 | 
  155 |   return {
  156 |     ...payload,
  157 |     category_id: categoryId,
  158 |   };
  159 | }
  160 | 
  161 | function matrixTargetRoute(
  162 |   row: Fr12ProductMatrixRow,
  163 |   resolvedPayload: Fr12ProductPayload | undefined,
  164 |   targetId: number | undefined,
  165 |   protectedResource: Fr12SnapshotResourceName,
  166 | ): Fr12TargetRouteRecord {
  167 |   return {
  168 |     key: row.key,
  169 |     method: row.method,
  170 |     path: row.path,
  171 |     pathParameters:
  172 |       row.path.includes(':id') && targetId !== undefined
  173 |         ? { id: String(targetId) }
  174 |         : undefined,
  175 |     payload: resolvedPayload,
  176 |     authorization: row.authorization,
  177 |     protectedResource,
  178 |   };
  179 | }
  180 | 
  181 | function productById(
  182 |   collection: unknown,
  183 |   identifier: number,
  184 | ): Record<string, unknown> | undefined {
  185 |   if (!Array.isArray(collection)) {
  186 |     return undefined;
  187 |   }
  188 | 
  189 |   return collection.find(
  190 |     (record): record is Record<string, unknown> =>
  191 |       typeof record === 'object' &&
  192 |       record !== null &&
  193 |       !Array.isArray(record) &&
  194 |       record.id === identifier,
  195 |   );
  196 | }
  197 | 
  198 | async function recordInventoryMutationEvidenceAndRestore(
  199 |   snapshotSession: AdminSnapshotSession,
  200 |   resources: readonly Fr12SnapshotResource[],
  201 |   beforeSnapshots: readonly SnapshotAttempt[],
  202 |   afterSnapshots: readonly SnapshotAttempt[],
  203 |   markers: readonly string[],
  204 |   cleanups: readonly Fr12ControlledCleanupDefinition[],
  205 |   expected: {
  206 |     snapshotAcquisitionSuccessful: boolean;
  207 |     finalSnapshotAcquisitionSuccessful: boolean;
  208 |     changedSnapshotCount: number;
  209 |     mutationMarkerMatches: number;
  210 |     cleanupDiscoverySuccessful: boolean;
  211 |     controlledMarkerMatchesAfterCleanup: number;
  212 |     finalChangedSnapshotCount: number;
  213 |   },
  214 |   partitionName: string,
  215 | ): Promise<void> {
  216 |   try {
  217 |     recordSnapshotAcquisition(
  218 |       afterSnapshots,
  219 |       expected.snapshotAcquisitionSuccessful,
  220 |       `${partitionName} post-probe`,
  221 |     );
  222 | 
  223 |     let changedSnapshotCount = 0;
  224 |     for (const resource of resources) {
  225 |       const before = snapshotByResource(beforeSnapshots, resource.name);
  226 |       const after = snapshotByResource(afterSnapshots, resource.name);
  227 | 
  228 |       if (before?.successful && after?.successful) {
  229 |         const unchanged = normalizedSnapshotsEqual(before.value, after.value);
  230 |         if (!unchanged) {
  231 |           changedSnapshotCount += 1;
  232 |         }
  233 |         expect.soft(
  234 |           unchanged,
  235 |           `${resource.name} changed after ${partitionName} probes`,
  236 |         ).toBe(true);
  237 |       }
  238 |     }
  239 |     expect.soft(changedSnapshotCount).toBe(expected.changedSnapshotCount);
  240 |     expect.soft(
  241 |       countMutationMarkerMatches(
  242 |         [...beforeSnapshots, ...afterSnapshots],
  243 |         markers,
  244 |       ),
  245 |       `${partitionName} original mutation-marker evidence`,
> 246 |     ).toBe(expected.mutationMarkerMatches);
      |       ^ Error: TC06 ordinary-user original mutation-marker evidence
  247 |   } finally {
  248 |     try {
  249 |       const cleanupResults = await snapshotSession.cleanupControlledRecords(
  250 |         cleanups,
  251 |         afterSnapshots,
  252 |       );
  253 |       expect.soft(cleanupResults).toHaveLength(cleanups.length);
  254 | 
  255 |       for (const cleanup of cleanups) {
  256 |         const result = cleanupResults.find(
  257 |           (candidate) => candidate.cleanupKey === cleanup.key,
  258 |         );
  259 |         expect.soft(
  260 |           result?.discoverySuccessful ?? false,
  261 |           `${partitionName} cleanup discovery ${cleanup.key} failed; ` +
  262 |             `matches: ${String(result?.matchingRecordCount)}; ` +
  263 |             `error: ${String(result?.error)}`,
  264 |         ).toBe(expected.cleanupDiscoverySuccessful);
  265 |         for (const mutation of result?.mutations ?? []) {
  266 |           expect.soft(
  267 |             mutation.successful,
  268 |             `${partitionName} cleanup ${cleanup.key} failed for controlled ` +
  269 |               `${cleanup.identifierField}=${mutation.identifier}; ` +
  270 |               `status: ${String(mutation.status)}; ` +
  271 |               `error: ${String(mutation.error)}`,
  272 |           ).toBe(cleanup.expected.responseSuccessful);
  273 |         }
  274 |       }
  275 |     } catch (error) {
  276 |       expect.soft(
  277 |         false,
  278 |         `${partitionName} controlled cleanup helper failed: ${errorMessage(error)}`,
  279 |       ).toBe(true);
  280 |     } finally {
  281 |       const finalSnapshots = await captureSnapshotsSafely(
  282 |         snapshotSession,
  283 |         resources,
  284 |         [],
  285 |         `${partitionName} post-cleanup`,
  286 |       );
  287 |       recordSnapshotAcquisition(
  288 |         finalSnapshots,
  289 |         expected.finalSnapshotAcquisitionSuccessful,
  290 |         `${partitionName} post-cleanup`,
  291 |       );
  292 |       expect.soft(countControlledRecordMatches(finalSnapshots, cleanups)).toBe(
  293 |         expected.controlledMarkerMatchesAfterCleanup,
  294 |       );
  295 | 
  296 |       let finalChangedSnapshotCount = 0;
  297 |       for (const resource of resources) {
  298 |         const before = snapshotByResource(beforeSnapshots, resource.name);
  299 |         const final = snapshotByResource(finalSnapshots, resource.name);
  300 |         if (before?.successful && final?.successful) {
  301 |           const restored = normalizedSnapshotsEqual(before.value, final.value);
  302 |           if (!restored) {
  303 |             finalChangedSnapshotCount += 1;
  304 |           }
  305 |           expect.soft(
  306 |             restored,
  307 |             `${resource.name} was not restored after ${partitionName} cleanup`,
  308 |           ).toBe(true);
  309 |         }
  310 |       }
  311 |       expect.soft(finalChangedSnapshotCount).toBe(
  312 |         expected.finalChangedSnapshotCount,
  313 |       );
  314 |     }
  315 |   }
  316 | }
  317 | 
  318 | test.describe('FR-12 access control — reviewed increment 1', () => {
  319 |   test(`${adminUiNoTokenCase.id} ${adminUiNoTokenCase.title}`, async ({
  320 |     page,
  321 |   }) => {
  322 |     test.slow();
  323 |     const testCase = adminUiNoTokenCase;
  324 |     const admin = new AdminAccessPage(page, testCase.labels);
  325 |     const mutationRequests = admin.observeMutationRequests(
  326 |       testCase.requestObservation.mutations,
  327 |     );
  328 |     const loginResponses = admin.observeLoginResponses(
  329 |       testCase.requestObservation.login.method,
  330 |       testCase.requestObservation.login.path,
  331 |     );
  332 |     const dialogs = admin.observeAndDismissDialogs();
  333 |     const loginSubmitActivations = 0;
  334 | 
  335 |     try {
  336 |       await admin.goto(adminOrigin, testCase.adminEntryPath);
  337 | 
  338 |       await recordGuardedVisibility(
  339 |         admin.loginForm,
  340 |         testCase.expected.counts.loginForms,
  341 |         'Admin login form',
  342 |       );
  343 |       await recordGuardedVisibility(
  344 |         admin.loginHeading,
  345 |         testCase.expected.counts.loginHeadings,
  346 |         'Admin login heading',
```