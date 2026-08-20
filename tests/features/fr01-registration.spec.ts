import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page.js';
import {
  generateCollisionSafeEmail,
  loadJsonFile,
} from '../support/data-loader.js';
import type { Fr01RegistrationData } from '../support/data-loader.js';
import type {
  RegistrationFieldKey,
  RegistrationFillInput,
} from '../support/data-loader.js';

const data = loadJsonFile<Fr01RegistrationData>(
  'tests/data/fr01-registration.json',
);
const validRegistrationUiCase = data.valid_registration_ui;
const requiredFieldOmissionsCase = data.required_field_omissions;
const emailFormatPartitionsCase = data.email_format_partitions;
const registrationFormSemanticsCase = data.registration_form_semantics;
const passwordLengthBoundaryCase = data.password_length_boundary;
const passwordMissingUppercaseCase = data.password_missing_uppercase;
const passwordMissingLowercaseCase = data.password_missing_lowercase;
const passwordMissingDigitCase = data.password_missing_digit;
const passwordMissingAllowedSpecialCase =
  data.password_missing_allowed_special;
const passwordEachAllowedSpecialCase = data.password_each_allowed_special;
const confirmationMatchMatrixCase = data.confirmation_match_matrix;
const apiUniqueThenDuplicateCase = data.api_unique_then_duplicate;

async function submitAndAssertPasswordRejection(
  page: Page,
  registration: RegistrationPage,
  registrationPath: string,
  input: RegistrationFillInput,
  fieldsToFill: RegistrationFieldKey[],
  registrationEndpoint: string,
  expectedRegistrationRequestCount: number,
  scenarioName: string,
): Promise<void> {
  await registration.goto(registrationPath);
  const registrationRequests = registration.observeRegistrationPostRequests(
    registrationEndpoint,
  );

  try {
    const email = generateCollisionSafeEmail(input.emailTemplate);
    await registration.fillSelectedFields(input, email, fieldsToFill);
    const registrationUrl = page.url();

    await registration.submit();

    await expect(
      page,
      `${scenarioName} must remain on the registration page`,
    ).toHaveURL(registrationUrl);
    await expect(registration.form).toBeVisible();

    const applicationError = registration.visibleNonEmptyApplicationError();
    await expect(
      applicationError,
      `${scenarioName} must show an application validation error`,
    ).toBeVisible();
    await expect(
      applicationError,
      `${scenarioName} application validation error must be non-empty`,
    ).toContainText(/\S/);
    await expect
      .poll(
        () => registration.applicationErrorIsAboveSubmit(applicationError),
        {
          message: `${scenarioName} application validation error must appear above submit`,
        },
      )
      .toBe(true);
    expect(
      registrationRequests.count(),
      `${scenarioName} must not invoke the registration creation path`,
    ).toBe(expectedRegistrationRequestCount);
  } finally {
    registrationRequests.stop();
  }
}

test.describe('FR-01 account registration — reviewed increment 1', () => {
  test(`${validRegistrationUiCase.id} ${validRegistrationUiCase.title}`, async ({
    page,
  }) => {
    const testCase = validRegistrationUiCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    await expect(registration.allLevelOneHeadings).toHaveCount(1);
    await expect(registration.heading).toBeVisible();
    await expect(registration.confirmationPasswordInput).toBeVisible();
    await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
    for (const expectedText of testCase.expected.vietnameseContent) {
      await expect(registration.visibleContent(expectedText)).toBeVisible();
    }

    const submitColor = await registration.submitColorAssessment();
    expect(
      submitColor.isBlue,
      `Expected the positive registration submit action to be blue; computed background was ${submitColor.cssValue}`,
    ).toBe(true);

    const email = generateCollisionSafeEmail(testCase.input.emailTemplate);
    await registration.fillSelectedFields(
      testCase.input,
      email,
      testCase.fieldsToFill,
    );
    await registration.submit();

    await expect(registration.loginHeading(testCase.expected.loginDestination)).toBeVisible();
    await expect(registration.loginForm(testCase.expected.loginDestination)).toBeVisible();
    await expect(
      registration.loginEmailInput(testCase.expected.loginDestination),
    ).toBeVisible();
    await expect(
      registration.loginPasswordInput(testCase.expected.loginDestination),
    ).toBeVisible();
  });

  test(`${requiredFieldOmissionsCase.id} ${requiredFieldOmissionsCase.title}`, async ({
    page,
  }) => {
    const testCase = requiredFieldOmissionsCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    await expect(registration.confirmationPasswordInput).toBeVisible();
    await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
    for (const field of testCase.expected.requiredFields) {
      const input = registration.inputFor(field);
      const label = registration.requiredLabelFor(field);
      await expect(input, `Required ${field} control must be visible`).toBeVisible();
      await expect(input, `Required ${field} control must be marked required`).toHaveAttribute("required", "");
      await expect(label, `Required ${field} label must be visible`).toBeVisible();
      await expect(
        label,
        `Required ${field} label must show ${testCase.expected.requiredMarker}`,
      ).toContainText(testCase.expected.requiredMarker);
    }

    for (const variant of testCase.variants) {
      await registration.goto(testCase.registrationPath);
      const attemptedEmail = generateCollisionSafeEmail(
        variant.input.emailTemplate,
      );
      await registration.fillSelectedFields(
        variant.input,
        attemptedEmail,
        variant.fieldsToFill,
      );

      for (const field of testCase.expected.requiredFields) {
        const input = registration.inputFor(field);
        if (variant.omittedFields.includes(field)) {
          await expect(
            input,
            `${variant.name} must leave ${field} blank`,
          ).toHaveValue('');
        } else {
          await expect(
            input,
            `${variant.name} must populate non-omitted ${field}`,
          ).not.toHaveValue('');
        }
      }

      expect(
        await registration.formIsValid(),
        `${variant.name} must be invalid before submission`,
      ).toBe(false);

      const registrationUrl = page.url();
      await registration.submit();
      await expect(
        page,
        `${variant.name} must remain on the registration page`,
      ).toHaveURL(registrationUrl);
      await expect(registration.form).toBeVisible();

      // Native constraint validation need not create an application error.
      // If the application does render one, its required placement is asserted.
      for (const applicationError of await registration.visibleApplicationErrors()) {
        expect(
          await registration.applicationErrorIsAboveSubmit(applicationError),
          `${variant.name} application error must appear above submit`,
        ).toBe(true);
      }
    }
  });

  test(`${emailFormatPartitionsCase.id} ${emailFormatPartitionsCase.title}`, async ({
    page,
  }) => {
    const testCase = emailFormatPartitionsCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);
    await expect(registration.emailInput).toHaveAttribute(
      'type',
      testCase.expected.emailType,
    );

    for (const partition of testCase.invalid) {
      await registration.goto(testCase.registrationPath);
      const email = generateCollisionSafeEmail(partition.input.emailTemplate);
      await registration.fillSelectedFields(
        partition.input,
        email,
        testCase.fieldsToFill,
      );

      expect(
        await registration.emailIsValid(),
        `${partition.name} must be rejected by email-format validity`,
      ).toBe(false);

      const registrationUrl = page.url();
      await registration.submit();
      await expect(
        page,
        `${partition.name} must not complete registration`,
      ).toHaveURL(registrationUrl);
      await expect(registration.form).toBeVisible();
    }

    await registration.goto(testCase.registrationPath);
    const validEmail = generateCollisionSafeEmail(
      testCase.valid.input.emailTemplate,
    );
    await registration.fillSelectedFields(
      testCase.valid.input,
      validEmail,
      testCase.fieldsToFill,
    );
    expect(
      await registration.emailIsValid(),
      `${testCase.valid.name} must not be rejected for email format alone`,
    ).toBe(true);
  });

  test(`${registrationFormSemanticsCase.id} ${registrationFormSemanticsCase.title}`, async ({
    page,
  }) => {
    const testCase = registrationFormSemanticsCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    await expect(registration.confirmationPasswordInput).toBeVisible();
    await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
    await expect(registration.passwordInput).toHaveAttribute(
      'type',
      testCase.expected.passwordType,
    );
    await expect(registration.confirmationPasswordInput).toHaveAttribute(
      'type',
      testCase.expected.passwordType,
    );
    await expect(registration.allLevelOneHeadings).toHaveCount(1);
    await expect(registration.heading).toBeVisible();

    const focusOrder = testCase.expected.focusOrder;
    const firstControl = registration.focusControlFor(focusOrder[0]);
    await firstControl.focus();

    for (let index = 0; index < focusOrder.length; index += 1) {
      const current = registration.focusControlFor(focusOrder[index]);
      await expect(
        current,
        `${focusOrder[index]} must receive focus at position ${index + 1}`,
      ).toBeFocused();

      if (index + 1 < focusOrder.length) {
        const next = registration.focusControlFor(focusOrder[index + 1]);
        expect(
          await registration.followsVisualReadingOrder(current, next),
          `${focusOrder[index + 1]} must follow ${focusOrder[index]} visually`,
        ).toBe(true);
        await page.keyboard.press('Tab');
      }
    }
  });
});

test.describe('FR-01 account registration — reviewed increment 2', () => {
  test(`${passwordLengthBoundaryCase.id} ${passwordLengthBoundaryCase.title}`, async ({
    page,
  }) => {
    const testCase = passwordLengthBoundaryCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);
    const invalidBoundary = testCase.variants.sevenCharacterInvalid;

    await submitAndAssertPasswordRejection(
      page,
      registration,
      testCase.registrationPath,
      invalidBoundary.input,
      testCase.fieldsToFill,
      testCase.expected.registrationEndpoint,
      invalidBoundary.expected.registrationRequestCount,
      invalidBoundary.name,
    );

    const validBoundary = testCase.variants.eightCharacterValid;
    await registration.goto(testCase.registrationPath);
    const registrationRequests = registration.observeRegistrationPostRequests(
      testCase.expected.registrationEndpoint,
    );

    try {
      const email = generateCollisionSafeEmail(
        validBoundary.input.emailTemplate,
      );
      await registration.fillSelectedFields(
        validBoundary.input,
        email,
        testCase.fieldsToFill,
      );
      await registration.submit();

      await expect(
        registration.loginHeading(testCase.expected.loginDestination),
      ).toBeVisible();
      await expect(
        registration.loginForm(testCase.expected.loginDestination),
      ).toBeVisible();
      await expect(
        registration.loginEmailInput(testCase.expected.loginDestination),
      ).toBeVisible();
      await expect(
        registration.loginPasswordInput(testCase.expected.loginDestination),
      ).toBeVisible();
      expect(
        registrationRequests.count(),
        `${validBoundary.name} must submit exactly one registration request`,
      ).toBe(validBoundary.expected.registrationRequestCount);
    } finally {
      registrationRequests.stop();
    }
  });

  test(`${passwordMissingUppercaseCase.id} ${passwordMissingUppercaseCase.title}`, async ({
    page,
  }) => {
    const testCase = passwordMissingUppercaseCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await submitAndAssertPasswordRejection(
      page,
      registration,
      testCase.registrationPath,
      testCase.input,
      testCase.fieldsToFill,
      testCase.expected.registrationEndpoint,
      testCase.expected.registrationRequestCount,
      testCase.id,
    );
  });

  test(`${passwordMissingLowercaseCase.id} ${passwordMissingLowercaseCase.title}`, async ({
    page,
  }) => {
    const testCase = passwordMissingLowercaseCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await submitAndAssertPasswordRejection(
      page,
      registration,
      testCase.registrationPath,
      testCase.input,
      testCase.fieldsToFill,
      testCase.expected.registrationEndpoint,
      testCase.expected.registrationRequestCount,
      testCase.id,
    );
  });

  test(`${passwordMissingDigitCase.id} ${passwordMissingDigitCase.title}`, async ({
    page,
  }) => {
    const testCase = passwordMissingDigitCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await submitAndAssertPasswordRejection(
      page,
      registration,
      testCase.registrationPath,
      testCase.input,
      testCase.fieldsToFill,
      testCase.expected.registrationEndpoint,
      testCase.expected.registrationRequestCount,
      testCase.id,
    );
  });
});

test.describe('FR-01 account registration — reviewed increment 3', () => {
  test(`${passwordMissingAllowedSpecialCase.id} ${passwordMissingAllowedSpecialCase.title}`, async ({
    page,
  }) => {
    const testCase = passwordMissingAllowedSpecialCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await submitAndAssertPasswordRejection(
      page,
      registration,
      testCase.registrationPath,
      testCase.input,
      testCase.fieldsToFill,
      testCase.expected.registrationEndpoint,
      testCase.expected.registrationRequestCount,
      testCase.id,
    );
  });

  test(`${passwordEachAllowedSpecialCase.id} ${passwordEachAllowedSpecialCase.title}`, async ({
    page,
  }) => {
    test.slow();
    const testCase = passwordEachAllowedSpecialCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    for (const row of testCase.rows) {
      await test.step(`${row.name}: ${row.symbol}`, async () => {
        await registration.goto(testCase.registrationPath);
        const registrationRequests =
          registration.observeRegistrationPostRequests(
            testCase.expected.registrationEndpoint,
          );

        try {
          const email = generateCollisionSafeEmail(row.input.emailTemplate);
          await registration.fillSelectedFields(
            row.input,
            email,
            testCase.fieldsToFill,
          );
          await registration.submit();

          await Promise.all([
            expect.soft(
              registration.loginHeading(testCase.expected.loginDestination),
              `${row.name} must reach the documented login heading`,
            ).toBeVisible(),
            expect.soft(
              registration.loginForm(testCase.expected.loginDestination),
              `${row.name} must reach the documented login form`,
            ).toBeVisible(),
            expect.soft(
              registration.loginEmailInput(testCase.expected.loginDestination),
              `${row.name} login destination must show its email control`,
            ).toBeVisible(),
            expect.soft(
              registration.loginPasswordInput(
                testCase.expected.loginDestination,
              ),
              `${row.name} login destination must show its password control`,
            ).toBeVisible(),
          ]);
          expect.soft(
            registrationRequests.count(),
            `${row.name} must submit exactly one registration request`,
          ).toBe(row.expected.registrationRequestCount);
        } finally {
          registrationRequests.stop();
        }
      });
    }
  });

  test(`${confirmationMatchMatrixCase.id} ${confirmationMatchMatrixCase.title}`, async ({
    page,
  }) => {
    const testCase = confirmationMatchMatrixCase;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);
    await expect(registration.confirmationPasswordInput).toBeVisible();
    await expect(registration.confirmationPasswordInput).toHaveAttribute(
      'required',
      testCase.expected.confirmationControl.requiredAttribute,
    );
    await expect(registration.confirmationPasswordInput).toHaveAttribute(
      'type',
      testCase.expected.confirmationControl.type,
    );

    const [unequalRow, equalRow] = testCase.rows;
    expect(
      unequalRow.input.password === unequalRow.input.confirmationPassword,
      `${unequalRow.name} decision-table input must match its external decision value`,
    ).toBe(unequalRow.passwordsMatch);
    expect(
      equalRow.input.password === equalRow.input.confirmationPassword,
      `${equalRow.name} decision-table input must match its external decision value`,
    ).toBe(equalRow.passwordsMatch);

    await test.step(unequalRow.name, async () => {
      await submitAndAssertPasswordRejection(
        page,
        registration,
        testCase.registrationPath,
        unequalRow.input,
        testCase.fieldsToFill,
        testCase.expected.registrationEndpoint,
        unequalRow.expected.registrationRequestCount,
        unequalRow.name,
      );
    });

    await test.step(equalRow.name, async () => {
      await registration.goto(testCase.registrationPath);
      const registrationRequests =
        registration.observeRegistrationPostRequests(
          testCase.expected.registrationEndpoint,
        );

      try {
        const email = generateCollisionSafeEmail(equalRow.input.emailTemplate);
        await registration.fillSelectedFields(
          equalRow.input,
          email,
          testCase.fieldsToFill,
        );
        await registration.submit();

        await expect(
          registration.loginHeading(testCase.expected.loginDestination),
        ).toBeVisible();
        await expect(
          registration.loginForm(testCase.expected.loginDestination),
        ).toBeVisible();
        await expect(
          registration.loginEmailInput(testCase.expected.loginDestination),
        ).toBeVisible();
        await expect(
          registration.loginPasswordInput(testCase.expected.loginDestination),
        ).toBeVisible();
        expect(
          registrationRequests.count(),
          `${equalRow.name} must submit exactly one registration request`,
        ).toBe(equalRow.expected.registrationRequestCount);
      } finally {
        registrationRequests.stop();
      }
    });
  });

  test(`${apiUniqueThenDuplicateCase.id} ${apiUniqueThenDuplicateCase.title}`, async ({
    request,
  }) => {
    const testCase = apiUniqueThenDuplicateCase;
    const [firstRecord, secondRecord] = testCase.records;
    const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
    const registrationUrl = `${apiBaseUrl.replace(/\/$/, '')}/${testCase.endpoint.replace(/^\//, '')}`;
    const firstEmail = generateCollisionSafeEmail(
      firstRecord.input.emailTemplate,
    );
    const secondEmail = secondRecord.input.emailTemplate.replaceAll(
      testCase.firstEmailReferenceToken,
      firstEmail,
    );
    const firstRequestBody = {
      name: firstRecord.input.name,
      email: firstEmail,
      password: firstRecord.input.password,
    };
    const secondRequestBody = {
      name: secondRecord.input.name,
      email: secondEmail,
      password: secondRecord.input.password,
    };

    expect(
      secondEmail,
      `${secondRecord.name} must reuse the generated email from ${firstRecord.name}`,
    ).toBe(firstEmail);

    const firstResponse = await request.post(registrationUrl, {
      data: firstRequestBody,
    });
    const firstResponseText = await firstResponse.text();
    let firstResponseBody: unknown;

    try {
      firstResponseBody = JSON.parse(firstResponseText) as unknown;
    } catch {
      firstResponseBody = firstResponseText;
    }

    const firstDiagnostics = JSON.stringify(firstResponseBody);
    expect(
      firstResponse.status(),
      `${firstRecord.name} status; response body: ${firstDiagnostics}`,
    ).toBe(testCase.expected.first.status);
    expect(
      firstResponseBody,
      `${firstRecord.name} must return a JSON object; response body: ${firstDiagnostics}`,
    ).not.toBeNull();
    expect(
      typeof firstResponseBody,
      `${firstRecord.name} must return a JSON object; response body: ${firstDiagnostics}`,
    ).toBe('object');

    const firstResponseRecord = firstResponseBody as Record<string, unknown>;
    expect(
      firstResponseRecord.message,
      `${firstRecord.name} success message; response body: ${firstDiagnostics}`,
    ).toBe(testCase.expected.first.message);
    expect(
      typeof firstResponseRecord.id,
      `${firstRecord.name} id type; response body: ${firstDiagnostics}`,
    ).toBe(testCase.expected.first.idType);

    const firstId = firstResponseRecord.id;
    if (typeof firstId !== 'number') {
      throw new Error(
        `${firstRecord.name} did not return the required numeric id; response body: ${firstDiagnostics}`,
      );
    }

    const secondResponse = await request.post(registrationUrl, {
      data: secondRequestBody,
    });
    const secondResponseText = await secondResponse.text();
    expect(
      secondResponse.ok(),
      `${secondRecord.name} reused email from created id ${firstId}; status: ${secondResponse.status()}; response body: ${secondResponseText}`,
    ).toBe(testCase.expected.second.successful);
  });
});
