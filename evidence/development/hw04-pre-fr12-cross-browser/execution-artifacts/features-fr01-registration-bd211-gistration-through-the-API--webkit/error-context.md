# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 3 >> FR01-TC12 unique-email registration followed by duplicate registration through the API.
- Location: tests/features/fr01-registration.spec.ts:556:7

# Error details

```
Error: second_duplicate_registration reused email from created id 7; status: 200; response body: {"message":"User registered successfully","id":8}

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  536 |         ).toBeVisible();
  537 |         await expect(
  538 |           registration.loginForm(testCase.expected.loginDestination),
  539 |         ).toBeVisible();
  540 |         await expect(
  541 |           registration.loginEmailInput(testCase.expected.loginDestination),
  542 |         ).toBeVisible();
  543 |         await expect(
  544 |           registration.loginPasswordInput(testCase.expected.loginDestination),
  545 |         ).toBeVisible();
  546 |         expect(
  547 |           registrationRequests.count(),
  548 |           `${equalRow.name} must submit exactly one registration request`,
  549 |         ).toBe(equalRow.expected.registrationRequestCount);
  550 |       } finally {
  551 |         registrationRequests.stop();
  552 |       }
  553 |     });
  554 |   });
  555 | 
  556 |   test(`${apiUniqueThenDuplicateCase.id} ${apiUniqueThenDuplicateCase.title}`, async ({
  557 |     request,
  558 |   }) => {
  559 |     const testCase = apiUniqueThenDuplicateCase;
  560 |     const [firstRecord, secondRecord] = testCase.records;
  561 |     const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
  562 |     const registrationUrl = `${apiBaseUrl.replace(/\/$/, '')}/${testCase.endpoint.replace(/^\//, '')}`;
  563 |     const firstEmail = generateCollisionSafeEmail(
  564 |       firstRecord.input.emailTemplate,
  565 |     );
  566 |     const secondEmail = secondRecord.input.emailTemplate.replaceAll(
  567 |       testCase.firstEmailReferenceToken,
  568 |       firstEmail,
  569 |     );
  570 |     const firstRequestBody = {
  571 |       name: firstRecord.input.name,
  572 |       email: firstEmail,
  573 |       password: firstRecord.input.password,
  574 |     };
  575 |     const secondRequestBody = {
  576 |       name: secondRecord.input.name,
  577 |       email: secondEmail,
  578 |       password: secondRecord.input.password,
  579 |     };
  580 | 
  581 |     expect(
  582 |       secondEmail,
  583 |       `${secondRecord.name} must reuse the generated email from ${firstRecord.name}`,
  584 |     ).toBe(firstEmail);
  585 | 
  586 |     const firstResponse = await request.post(registrationUrl, {
  587 |       data: firstRequestBody,
  588 |     });
  589 |     const firstResponseText = await firstResponse.text();
  590 |     let firstResponseBody: unknown;
  591 | 
  592 |     try {
  593 |       firstResponseBody = JSON.parse(firstResponseText) as unknown;
  594 |     } catch {
  595 |       firstResponseBody = firstResponseText;
  596 |     }
  597 | 
  598 |     const firstDiagnostics = JSON.stringify(firstResponseBody);
  599 |     expect(
  600 |       firstResponse.status(),
  601 |       `${firstRecord.name} status; response body: ${firstDiagnostics}`,
  602 |     ).toBe(testCase.expected.first.status);
  603 |     expect(
  604 |       firstResponseBody,
  605 |       `${firstRecord.name} must return a JSON object; response body: ${firstDiagnostics}`,
  606 |     ).not.toBeNull();
  607 |     expect(
  608 |       typeof firstResponseBody,
  609 |       `${firstRecord.name} must return a JSON object; response body: ${firstDiagnostics}`,
  610 |     ).toBe('object');
  611 | 
  612 |     const firstResponseRecord = firstResponseBody as Record<string, unknown>;
  613 |     expect(
  614 |       firstResponseRecord.message,
  615 |       `${firstRecord.name} success message; response body: ${firstDiagnostics}`,
  616 |     ).toBe(testCase.expected.first.message);
  617 |     expect(
  618 |       typeof firstResponseRecord.id,
  619 |       `${firstRecord.name} id type; response body: ${firstDiagnostics}`,
  620 |     ).toBe(testCase.expected.first.idType);
  621 | 
  622 |     const firstId = firstResponseRecord.id;
  623 |     if (typeof firstId !== 'number') {
  624 |       throw new Error(
  625 |         `${firstRecord.name} did not return the required numeric id; response body: ${firstDiagnostics}`,
  626 |       );
  627 |     }
  628 | 
  629 |     const secondResponse = await request.post(registrationUrl, {
  630 |       data: secondRequestBody,
  631 |     });
  632 |     const secondResponseText = await secondResponse.text();
  633 |     expect(
  634 |       secondResponse.ok(),
  635 |       `${secondRecord.name} reused email from created id ${firstId}; status: ${secondResponse.status()}; response body: ${secondResponseText}`,
> 636 |     ).toBe(testCase.expected.second.successful);
      |       ^ Error: second_duplicate_registration reused email from created id 7; status: 200; response body: {"message":"User registered successfully","id":8}
  637 |   });
  638 | });
  639 | 
```