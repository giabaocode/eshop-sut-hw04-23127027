import { expect, test } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page.js';
import {
  generateCollisionSafeEmail,
  loadJsonFile,
} from '../support/data-loader.js';
import type { Fr01RegistrationData } from '../support/data-loader.js';

const data = loadJsonFile<Fr01RegistrationData>(
  'tests/data/fr01-registration.json',
);

test.describe('FR-01 account registration — reviewed increment 1', () => {
  test('FR01-TC01 valid registration reaches the login destination with compliant registration UI', async ({
    page,
  }) => {
    const testCase = data.valid_registration_ui;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    await expect(registration.allLevelOneHeadings).toHaveCount(1);
    await expect(registration.heading).toBeVisible();
    for (const expectedText of testCase.expected.vietnameseContent) {
      await expect(registration.visibleContent(expectedText)).toBeVisible();
    }

    const submitColor = await registration.submitColorAssessment();
    expect(
      submitColor.isBlue,
      `Expected the positive registration submit action to be blue; computed background was ${submitColor.cssValue}`,
    ).toBe(true);

    const email = generateCollisionSafeEmail(testCase.input.emailTemplate);
    await registration.fill(testCase.input, email);
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

  test('FR01-TC02 required controls reject blank and one-field omissions with correctly placed application errors', async ({
    page,
  }) => {
    const testCase = data.required_field_omissions;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    for (const field of testCase.expected.requiredFields) {
      const input = registration.inputFor(field);
      const label = registration.requiredLabelFor(field);
      await expect(input, `Required ${field} control must be visible`).toBeVisible();
      await expect(input, `Required ${field} control must be marked required`).toBeRequired();
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
      await registration.fill(variant.input, attemptedEmail);

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

  test('FR01-TC03 email control enforces invalid and valid format partitions without browser-specific wording', async ({
    page,
  }) => {
    const testCase = data.email_format_partitions;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);
    await expect(registration.emailInput).toHaveAttribute(
      'type',
      testCase.expected.emailType,
    );

    for (const partition of testCase.invalid) {
      await registration.goto(testCase.registrationPath);
      const email = generateCollisionSafeEmail(partition.input.emailTemplate);
      await registration.fill(partition.input, email);

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
    await registration.fill(testCase.valid.input, validEmail);
    expect(
      await registration.emailIsValid(),
      `${testCase.valid.name} must not be rejected for email format alone`,
    ).toBe(true);
  });

  test('FR01-TC04 confirmation and password semantics have one h1 and top-to-bottom keyboard focus order', async ({
    page,
  }) => {
    const testCase = data.registration_form_semantics;
    const registration = new RegistrationPage(page, testCase.expected.labels);

    await registration.goto(testCase.registrationPath);

    await expect(registration.confirmationPasswordInput).toBeVisible();
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
