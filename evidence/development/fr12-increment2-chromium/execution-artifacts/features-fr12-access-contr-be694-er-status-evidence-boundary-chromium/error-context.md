# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr12-access-control.spec.ts >> FR-12 access control — reviewed increment 2 >> FR12-TC05 invalid-token probes cover every Admin route with an explicit order-status evidence boundary
- Location: tests/features/fr12-access-control.spec.ts:896:7

# Error details

```
Error: malformed_admin_orders_status_put EVIDENCE MISSING: For a non-existing order ID, an access-control bypass can reach the business handler and return Order not found, so a generic non-success response plus unchanged snapshots cannot prove invalid-token rejection. Retain the one-shot response and post-target state for human triage, but do not assert an unsupported exact status or wording and do not count this route as a verified denial. Original one-shot target response evidence: status: 403; body: {"error":"Forbidden"}

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: expired_admin_orders_status_put EVIDENCE MISSING: For a non-existing order ID, an access-control bypass can reach the business handler and return Order not found, so a generic non-success response plus unchanged snapshots cannot prove invalid-token rejection. Retain the one-shot response and post-target state for human triage, but do not assert an unsupported exact status or wording and do not count this route as a verified denial. Original one-shot target response evidence: status: 403; body: {"error":"Forbidden"}

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  792 | 
  793 |           expect.soft(finalChangedSnapshotCount).toBe(
  794 |             testCase.expected.finalChangedSnapshotCount,
  795 |           );
  796 |         }
  797 |       }
  798 |     }
  799 |   });
  800 | });
  801 | 
  802 | function evidenceBoundaryForRoute(
  803 |   route: Fr12TargetRouteRecord,
  804 |   boundaries: readonly Fr12EvidenceBoundary[],
  805 | ): Fr12EvidenceBoundary | undefined {
  806 |   if (route.evidenceBoundaryKey === undefined) {
  807 |     return undefined;
  808 |   }
  809 | 
  810 |   const matches = boundaries.filter(
  811 |     (boundary) => boundary.key === route.evidenceBoundaryKey,
  812 |   );
  813 |   expect(
  814 |     matches,
  815 |     `${route.key} must resolve exactly one external evidence boundary`,
  816 |   ).toHaveLength(1);
  817 |   const boundary = matches[0];
  818 | 
  819 |   if (boundary === undefined) {
  820 |     throw new Error(`${route.key} evidence boundary is unavailable`);
  821 |   }
  822 | 
  823 |   expect(boundary.classification).toBe('EVIDENCE MISSING');
  824 |   expect(boundary.targetMethod).toBe(route.method);
  825 |   expect(boundary.targetPath).toBe(route.path);
  826 |   expect(boundary.targetIdentifierType).toBe('positive_integer');
  827 |   const configuredIdentifier =
  828 |     route.pathParameters?.[boundary.targetIdentifierParameter];
  829 |   const targetIdentifier = Number(configuredIdentifier);
  830 |   expect(Number.isSafeInteger(targetIdentifier)).toBe(true);
  831 |   expect(targetIdentifier).toBeGreaterThan(0);
  832 |   expect(String(targetIdentifier)).toBe(configuredIdentifier);
  833 |   expect(boundary.apiOnlyReversibleFixturePossible).toBe(false);
  834 |   expect(boundary.creationLeavesPersistentOrder).toBe(true);
  835 |   expect(boundary.supportedDeleteEndpoint).toBeNull();
  836 |   expect(boundary.supportedRestoreTransition).toBeNull();
  837 |   expect(boundary.sourceBasis.length).toBeGreaterThan(0);
  838 |   expect(boundary.ambiguity.length).toBeGreaterThan(0);
  839 |   expect(boundary.oracleConstraint.length).toBeGreaterThan(0);
  840 | 
  841 |   return boundary;
  842 | }
  843 | 
  844 | function recordSafeNonExistingOrderTargets(
  845 |   routes: readonly Fr12TargetRouteRecord[],
  846 |   boundaries: readonly Fr12EvidenceBoundary[],
  847 |   beforeSnapshots: readonly SnapshotAttempt[],
  848 | ): void {
  849 |   const orderSnapshot = snapshotByResource(beforeSnapshots, 'orders');
  850 | 
  851 |   for (const route of routes) {
  852 |     const boundary = evidenceBoundaryForRoute(route, boundaries);
  853 |     if (boundary === undefined) {
  854 |       continue;
  855 |     }
  856 | 
  857 |     const targetIdentifier = Number(
  858 |       route.pathParameters?.[boundary.targetIdentifierParameter],
  859 |     );
  860 |     const targetExists =
  861 |       Array.isArray(orderSnapshot?.value) &&
  862 |       orderSnapshot.value.some(
  863 |         (record) =>
  864 |           typeof record === 'object' &&
  865 |           record !== null &&
  866 |           !Array.isArray(record) &&
  867 |           (record as Record<string, unknown>).id === targetIdentifier,
  868 |       );
  869 |     expect(
  870 |       targetExists,
  871 |       `${route.key} safe order-status target must be absent from the authenticated baseline`,
  872 |     ).toBe(boundary.targetExistsInBaseline);
  873 |   }
  874 | }
  875 | 
  876 | function recordEvidenceMissingRouteObservation(
  877 |   route: Fr12TargetRouteRecord,
  878 |   boundary: Fr12EvidenceBoundary,
  879 |   response: Parameters<typeof responseDiagnostics>[0] | undefined,
  880 |   transportError: string | undefined,
  881 | ): void {
  882 |   const originalResponseEvidence =
  883 |     response === undefined
  884 |       ? `unavailable; transport error: ${String(transportError)}`
  885 |       : responseDiagnostics(response);
  886 | 
  887 |   expect.soft(
  888 |     false,
  889 |     `${route.key} ${boundary.classification}: ${boundary.ambiguity} ` +
  890 |       `${boundary.oracleConstraint} Original one-shot target response evidence: ` +
  891 |       originalResponseEvidence,
> 892 |   ).toBe(true);
      |     ^ Error: expired_admin_orders_status_put EVIDENCE MISSING: For a non-existing order ID, an access-control bypass can reach the business handler and return Order not found, so a generic non-success response plus unchanged snapshots cannot prove invalid-token rejection. Retain the one-shot response and post-target state for human triage, but do not assert an unsupported exact status or wording and do not count this route as a verified denial. Original one-shot target response evidence: status: 403; body: {"error":"Forbidden"}
  893 | }
  894 | 
  895 | test.describe('FR-12 access control — reviewed increment 2', () => {
  896 |   test(`${adminRouteInventoryInvalidTokensCase.id} ${adminRouteInventoryInvalidTokensCase.title}`, async ({
  897 |     request,
  898 |   }) => {
  899 |     test.slow();
  900 |     const testCase = adminRouteInventoryInvalidTokensCase;
  901 |     const tokenClasses = [
  902 |       ...new Set(
  903 |         testCase.probes.map((probe) => probe.authorization.tokenClass),
  904 |       ),
  905 |     ];
  906 |     const cleanupKeys = testCase.controlledCleanup.map(
  907 |       (cleanup) => cleanup.key,
  908 |     );
  909 |     const markers = testCase.probes.flatMap((probe) =>
  910 |       probe.mutationMarker === undefined ? [] : [probe.mutationMarker],
  911 |     );
  912 | 
  913 |     expect(tokenClasses).toHaveLength(testCase.expected.tokenClassCount);
  914 |     expect(tokenClasses).toEqual(Object.keys(testCase.invalidTokens));
  915 |     expect(testCase.probes).toHaveLength(testCase.expected.probeCount);
  916 |     expect(testCase.evidenceBoundaries).toHaveLength(
  917 |       testCase.expected.evidenceBoundaryDefinitionCount,
  918 |     );
  919 |     const evidenceBoundaryProbes = testCase.probes.filter(
  920 |       (probe) =>
  921 |         evidenceBoundaryForRoute(probe, testCase.evidenceBoundaries) !==
  922 |         undefined,
  923 |     );
  924 |     expect(evidenceBoundaryProbes).toHaveLength(
  925 |       testCase.expected.evidenceMissingProbeResponses,
  926 |     );
  927 |     expect(testCase.controlledCleanup).toHaveLength(
  928 |       testCase.expected.cleanupMarkerCount,
  929 |     );
  930 |     expect(new Set(cleanupKeys).size).toBe(
  931 |       testCase.expected.cleanupMarkerCount,
  932 |     );
  933 |     for (const tokenClass of tokenClasses) {
  934 |       const classProbes = testCase.probes.filter(
  935 |         (probe) => probe.authorization.tokenClass === tokenClass,
  936 |       );
  937 |       const classRoutes = classProbes.map(
  938 |         (probe) => `${probe.method} ${probe.path}`,
  939 |       );
  940 |       expect(classProbes).toHaveLength(testCase.expected.routesPerTokenClass);
  941 |       expect(new Set(classRoutes).size).toBe(
  942 |         testCase.expected.routesPerTokenClass,
  943 |       );
  944 |       expect(
  945 |         classProbes.filter(
  946 |           (probe) => probe.evidenceBoundaryKey === undefined,
  947 |         ),
  948 |       ).toHaveLength(testCase.expected.verifiedDenialsPerTokenClass);
  949 |     }
  950 |     for (const probe of testCase.probes) {
  951 |       expect(probe.authorization.partition).toBe('invalid_bearer');
  952 |       expect(probe.authorization.header).toBe(
  953 |         testCase.snapshotSession.authorizationHeader,
  954 |       );
  955 |       expect(probe.authorization.scheme).toBe(
  956 |         testCase.snapshotSession.bearerScheme,
  957 |       );
  958 |       if (probe.mutationMarker !== undefined) {
  959 |         expect(payloadContainsMarker(probe.payload, probe.mutationMarker)).toBe(
  960 |           true,
  961 |         );
  962 |       }
  963 |     }
  964 | 
  965 |     const expiredFixture = buildAndValidateExpiredJwtFixture(
  966 |       testCase.invalidTokens.expired,
  967 |     );
  968 |     expect(expiredFixture.segmentCount).toBe(
  969 |       testCase.expected.jwtSegmentCount,
  970 |     );
  971 |     expect(expiredFixture.algorithmMatches).toBe(
  972 |       testCase.expected.algorithmMatches,
  973 |     );
  974 |     expect(expiredFixture.expClaimNumeric).toBe(
  975 |       testCase.expected.expiredClaimNumeric,
  976 |     );
  977 |     expect(expiredFixture.expiresBeforeCurrentTime).toBe(
  978 |       testCase.expected.expiredBeforeCurrentTime,
  979 |     );
  980 |     expect(expiredFixture.signatureValid).toBe(
  981 |       testCase.expected.signatureValid,
  982 |     );
  983 |     expect(testCase.invalidTokens.malformed.value.length).toBeGreaterThan(0);
  984 | 
  985 |     const snapshotSession = await createAdminSnapshotSession(
  986 |       request,
  987 |       apiBaseUrl,
  988 |       testCase.snapshotSession,
  989 |     );
  990 |     expect(
  991 |       snapshotSession.loginSuccessful,
  992 |       `TC05 seeded-admin snapshot fixture failed; status: ` +
```