# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr12-access-control.spec.ts >> FR-12 access control — reviewed increment 2 >> FR12-TC08 product POST PUT DELETE enforce missing-user-admin access partitions
- Location: tests/features/fr12-access-control.spec.ts:1402:7

# Error details

```
Error: post_missing_token authentication_denied; status: 200; body: {"message":"Product created","id":13}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"category_id": 1, "description": "FR12 TC08 POST missing token", "id": 13, "imageUrl": "https://example.test/fr12-tc08-post-missing.png", "name": "FR12_TC08_POST_MISSING_23127027", "price": 128011}]
```

```
Error: post_ordinary_user authorization_denied; status: 200; body: {"message":"Product created","id":14}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"category_id": 1, "description": "FR12 TC08 POST ordinary user", "id": 14, "imageUrl": "https://example.test/fr12-tc08-post-user.png", "name": "FR12_TC08_POST_USER_23127027", "price": 128012}]
```

```
Error: put_missing_token authentication_denied; status: 200; body: {"message":"Product updated"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: put_missing_token state must satisfy controlled_target_unchanged

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: put_ordinary_user authorization_denied; status: 200; body: {"message":"Product updated"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: put_ordinary_user state must satisfy controlled_target_unchanged

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: delete_missing_token authentication_denied; status: 200; body: {"message":"Product deleted"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: delete_missing_token state must satisfy controlled_target_unchanged

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: delete_ordinary_user authorization_denied; status: 200; body: {"message":"Product deleted"}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: delete_ordinary_user state must satisfy controlled_target_unchanged

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1552 |         );
  1553 |         expect(
  1554 |           record !== undefined && recordMatchesExpectedFields(record, expectedSetup),
  1555 |           `${row.key} controlled setup product must exist with configured fields`,
  1556 |         ).toBe(row.setup.expected.productPresent);
  1557 |       }
  1558 | 
  1559 |       for (const row of testCase.rows) {
  1560 |         await test.step(
  1561 |           `${row.method} products with ${row.authorization.partition}`,
  1562 |           async () => {
  1563 |             const targetId = setupIdentifiers.get(row.key);
  1564 |             const resolvedPayload =
  1565 |               row.payload === undefined
  1566 |                 ? undefined
  1567 |                 : resolveProductPayload(
  1568 |                     row.payload,
  1569 |                     testCase.categoryReference.payloadReferenceToken,
  1570 |                     categoryId,
  1571 |                   );
  1572 |             const route = matrixTargetRoute(
  1573 |               row,
  1574 |               resolvedPayload,
  1575 |               targetId,
  1576 |               testCase.productSnapshot.resource,
  1577 |             );
  1578 |             const token =
  1579 |               row.authorization.partition === 'ordinary_user'
  1580 |                 ? ordinaryToken
  1581 |                 : row.authorization.partition === 'admin'
  1582 |                   ? adminToken
  1583 |                   : undefined;
  1584 |             const attempt = await probeExplicitAuthorizationRoute(
  1585 |               request,
  1586 |               apiBaseUrl,
  1587 |               route,
  1588 |               token,
  1589 |             );
  1590 |             expect.soft(
  1591 |               attempt.transportSuccessful,
  1592 |               `${row.key} target transport failed: ${String(attempt.error)}`,
  1593 |             ).toBe(testCase.expected.targetTransportSuccessful);
  1594 |             if (attempt.response !== undefined) {
  1595 |               completedTargetResponses += 1;
  1596 |               expect.soft(
  1597 |                 attempt.response.successful,
  1598 |                 `${row.key} ${row.expected.accessObservation}; ` +
  1599 |                   responseDiagnostics(attempt.response),
  1600 |               ).toBe(row.expected.responseSuccessful);
  1601 |             }
  1602 | 
  1603 |             const stateAttempt = await requestJsonResource(
  1604 |               request,
  1605 |               apiBaseUrl,
  1606 |               testCase.productSnapshot,
  1607 |             );
  1608 |             expect.soft(
  1609 |               stateAttempt.successful && Array.isArray(stateAttempt.value),
  1610 |               `${row.key} post-target state unavailable; status: ` +
  1611 |                 `${String(stateAttempt.status)}; error: ${String(stateAttempt.error)}`,
  1612 |             ).toBe(testCase.expected.targetStateSnapshotSuccessful);
  1613 |             if (!stateAttempt.successful || !Array.isArray(stateAttempt.value)) {
  1614 |               return;
  1615 |             }
  1616 | 
  1617 |             const expectedProduct =
  1618 |               row.expectedProduct === undefined
  1619 |                 ? undefined
  1620 |                 : resolveProductPayload(
  1621 |                     row.expectedProduct,
  1622 |                     testCase.categoryReference.payloadReferenceToken,
  1623 |                     categoryId,
  1624 |                   );
  1625 |             const markerMatches = exactMatchingRecords(
  1626 |               stateAttempt.value,
  1627 |               row.controlledMarker.field,
  1628 |               row.controlledMarker.value,
  1629 |             );
  1630 | 
  1631 |             if (row.expected.stateObservation === 'controlled_product_absent') {
  1632 |               expect.soft(markerMatches).toHaveLength(0);
  1633 |             } else if (
  1634 |               row.expected.stateObservation === 'controlled_target_removed'
  1635 |             ) {
  1636 |               expect.soft(
  1637 |                 targetId === undefined
  1638 |                   ? false
  1639 |                   : productById(stateAttempt.value, targetId) === undefined,
  1640 |                 `${row.key} controlled target must be removed`,
  1641 |               ).toBe(true);
  1642 |             } else {
  1643 |               const targetRecord =
  1644 |                 targetId === undefined
  1645 |                   ? markerMatches[0]
  1646 |                   : productById(stateAttempt.value, targetId);
  1647 |               expect.soft(
  1648 |                 targetRecord !== undefined &&
  1649 |                   expectedProduct !== undefined &&
  1650 |                   recordMatchesExpectedFields(targetRecord, expectedProduct),
  1651 |                 `${row.key} state must satisfy ${row.expected.stateObservation}`,
> 1652 |               ).toBe(true);
       |                 ^ Error: delete_ordinary_user state must satisfy controlled_target_unchanged
  1653 |             }
  1654 |           },
  1655 |         );
  1656 |       }
  1657 | 
  1658 |       expect.soft(completedTargetResponses).toBe(
  1659 |         testCase.expected.completedTargetResponses,
  1660 |       );
  1661 |     } finally {
  1662 |       const preCleanup = await requestJsonResource(
  1663 |         request,
  1664 |         apiBaseUrl,
  1665 |         testCase.productSnapshot,
  1666 |       );
  1667 |       expect.soft(
  1668 |         preCleanup.successful && Array.isArray(preCleanup.value),
  1669 |         `TC08 pre-cleanup matrix state unavailable; status: ` +
  1670 |           `${String(preCleanup.status)}; error: ${String(preCleanup.error)}`,
  1671 |       ).toBe(testCase.expected.preCleanupSnapshotSuccessful);
  1672 | 
  1673 |       const cleanupResult = await cleanupExactMarkerRecords(
  1674 |         request,
  1675 |         apiBaseUrl,
  1676 |         preCleanup.value,
  1677 |         cleanupMarkers,
  1678 |         testCase.cleanup,
  1679 |         adminToken,
  1680 |       );
  1681 |       expect.soft(
  1682 |         cleanupResult.discoverySuccessful,
  1683 |         `TC08 exact-marker cleanup discovery failed; matches: ` +
  1684 |           `${cleanupResult.matchingRecordCount}; error: ${String(cleanupResult.error)}`,
  1685 |       ).toBe(testCase.expected.cleanupDiscoverySuccessful);
  1686 |       for (const mutation of cleanupResult.mutations) {
  1687 |         expect.soft(
  1688 |           mutation.successful,
  1689 |           `TC08 cleanup failed for controlled id=${mutation.identifier}; ` +
  1690 |             `status: ${String(mutation.status)}; ` +
  1691 |             `error: ${String(mutation.error)}`,
  1692 |         ).toBe(testCase.expected.cleanupResponseSuccessful);
  1693 |       }
  1694 | 
  1695 |       const finalSnapshot = await requestJsonResource(
  1696 |         request,
  1697 |         apiBaseUrl,
  1698 |         testCase.productSnapshot,
  1699 |       );
  1700 |       expect.soft(
  1701 |         finalSnapshot.successful && Array.isArray(finalSnapshot.value),
  1702 |         `TC08 final product snapshot unavailable; status: ` +
  1703 |           `${String(finalSnapshot.status)}; error: ${String(finalSnapshot.error)}`,
  1704 |       ).toBe(testCase.expected.finalSnapshotSuccessful);
  1705 |       if (
  1706 |         baseline.successful &&
  1707 |         finalSnapshot.successful &&
  1708 |         Array.isArray(baseline.value) &&
  1709 |         Array.isArray(finalSnapshot.value)
  1710 |       ) {
  1711 |         expect.soft(
  1712 |           normalizedSnapshotsEqual(baseline.value, finalSnapshot.value),
  1713 |           'TC08 final product collection must equal the pre-test baseline',
  1714 |         ).toBe(testCase.expected.finalMatchesBaseline);
  1715 |       }
  1716 |     }
  1717 |   });
  1718 | });
  1719 | 
```