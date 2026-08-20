import type { Locator, Page } from '@playwright/test';
import type {
  LoginDestinationLabels,
  RegistrationFieldKey,
  RegistrationFocusKey,
  RegistrationInputTemplate,
  RegistrationLabels,
} from '../support/data-loader.js';

export interface SubmitColorAssessment {
  cssValue: string;
  isBlue: boolean;
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function labelPattern(label: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(label)}\\s*\\*?\\s*$`, 'i');
}

function accessibleNamePattern(name: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(name)}\\s*$`, 'i');
}

export class RegistrationPage {
  readonly form: Locator;
  readonly allLevelOneHeadings: Locator;
  readonly heading: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmationPasswordInput: Locator;
  readonly submitButton: Locator;

  private readonly formContainer: Locator;

  constructor(
    private readonly page: Page,
    readonly labels: RegistrationLabels,
  ) {
    this.form = page.locator('form').filter({
      has: page.getByRole('button', {
        name: accessibleNamePattern(labels.submit),
      }),
    });
    this.formContainer = this.form.locator('xpath=..');
    this.allLevelOneHeadings = page.getByRole('heading', { level: 1 });
    this.heading = page.getByRole('heading', {
      level: 1,
      name: accessibleNamePattern(labels.heading),
    });
    this.fullNameInput = this.inputNextToLabel(this.form, labels.fullName);
    this.emailInput = this.inputNextToLabel(this.form, labels.email);
    this.passwordInput = this.inputNextToLabel(this.form, labels.password);
    this.confirmationPasswordInput = this.inputNextToLabel(
      this.form,
      labels.confirmationPassword,
    );
    this.submitButton = this.form.getByRole('button', {
      name: accessibleNamePattern(labels.submit),
    });
  }

  private inputNextToLabel(form: Locator, label: string): Locator {
    return form
      .locator('label')
      .filter({ hasText: labelPattern(label) })
      .locator('xpath=..')
      .locator('input');
  }

  async goto(registrationPath: string): Promise<void> {
    await this.page.goto(registrationPath);
  }

  async fillSelectedFields(
    input: RegistrationInputTemplate,
    email: string,
    fields: RegistrationFieldKey[],
  ): Promise<void> {
    for (const field of fields) {
      const value = field === 'email' ? email : input[field];
      await this.inputFor(field).fill(value);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  inputFor(field: RegistrationFieldKey): Locator {
    switch (field) {
      case 'fullName':
        return this.fullNameInput;
      case 'email':
        return this.emailInput;
      case 'password':
        return this.passwordInput;
      case 'confirmationPassword':
        return this.confirmationPasswordInput;
    }
  }

  focusControlFor(control: RegistrationFocusKey): Locator {
    return control === 'submit' ? this.submitButton : this.inputFor(control);
  }

  requiredLabelFor(field: RegistrationFieldKey): Locator {
    return this.form
      .locator('label')
      .filter({ hasText: labelPattern(this.labels[field]) });
  }

  visibleContent(text: string): Locator {
    const pattern = new RegExp(escapeRegularExpression(text), 'i');
    return this.page.getByText(pattern).first();
  }

  async formIsValid(): Promise<boolean> {
    return this.form.evaluate((form) => (form as HTMLFormElement).checkValidity());
  }

  async emailIsValid(): Promise<boolean> {
    return this.emailInput.evaluate((input) =>
      (input as HTMLInputElement).checkValidity(),
    );
  }

  async submitColorAssessment(): Promise<SubmitColorAssessment> {
    return this.submitButton.evaluate((button) => {
      const cssValue = window.getComputedStyle(button).backgroundColor;
      const channels = cssValue.match(
        /rgba?\(\s*(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/i,
      );

      if (channels === null) {
        return { cssValue, isBlue: false };
      }

      const red = Number(channels[1]);
      const green = Number(channels[2]);
      const blue = Number(channels[3]);

      return {
        cssValue,
        isBlue: blue > red && blue > green,
      };
    });
  }

  loginForm(destination: LoginDestinationLabels): Locator {
    return this.page.locator('form').filter({
      has: this.page.getByRole('button', {
        name: accessibleNamePattern(destination.submit),
      }),
    });
  }

  loginHeading(destination: LoginDestinationLabels): Locator {
    return this.page.getByRole('heading', {
      name: accessibleNamePattern(destination.heading),
    });
  }

  loginEmailInput(destination: LoginDestinationLabels): Locator {
    const form = this.loginForm(destination);
    return this.inputNextToLabel(form, destination.email);
  }

  loginPasswordInput(destination: LoginDestinationLabels): Locator {
    const form = this.loginForm(destination);
    return this.inputNextToLabel(form, destination.password);
  }

  async visibleApplicationErrors(): Promise<Locator[]> {
    const semanticCandidates = this.formContainer.locator(
      '[role="alert"], [aria-live="assertive"], [aria-live="polite"], ' +
        '[data-error], [data-testid*="error" i], .error-message',
    );
    const precedingNonHeadingSibling = this.form.locator(
      'xpath=preceding-sibling::*[1]' +
        '[not(self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6)]',
    );
    const candidateGroups = [semanticCandidates, precedingNonHeadingSibling];
    const visibleErrors: Locator[] = [];

    for (const candidates of candidateGroups) {
      for (let index = 0; index < (await candidates.count()); index += 1) {
        const candidate = candidates.nth(index);
        if (await candidate.isVisible()) {
          visibleErrors.push(candidate);
        }
      }
    }

    return visibleErrors;
  }

  async applicationErrorIsAboveSubmit(error: Locator): Promise<boolean> {
    const errorBox = await error.boundingBox();
    const submitBox = await this.submitButton.boundingBox();

    return (
      errorBox !== null && submitBox !== null && errorBox.y < submitBox.y
    );
  }

  async followsVisualReadingOrder(
    first: Locator,
    second: Locator,
  ): Promise<boolean> {
    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();

    if (firstBox === null || secondBox === null) {
      return false;
    }

    const verticalTolerance = 1;
    const secondIsLower = secondBox.y > firstBox.y + verticalTolerance;
    const sameRowAndToTheRight =
      Math.abs(secondBox.y - firstBox.y) <= verticalTolerance &&
      secondBox.x > firstBox.x;

    return secondIsLower || sameRowAndToTheRight;
  }
}
