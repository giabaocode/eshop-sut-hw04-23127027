import type {
  Dialog,
  Locator,
  Page,
  Request,
  Response,
} from '@playwright/test';
import type {
  AdminAccessLabels,
  AdminCredentials,
  AdminMutationRequestClassifier,
  Fr12HttpMethod,
} from '../support/data-loader.js';

export interface RequestCountObserver {
  count(): number;
  stop(): void;
}

export interface LoginResponseObserver extends RequestCountObserver {
  successfulCount(): number;
}

export interface DialogObservation {
  count(): number;
  messages(): string[];
  types(): string[];
  settle(): Promise<void>;
  stop(): void;
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactAccessibleName(value: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(value)}\\s*$`, 'i');
}

function pathTemplatePattern(pathTemplate: string): RegExp {
  const escaped = escapeRegularExpression(pathTemplate)
    .replace(/:[A-Za-z][A-Za-z0-9_]*/g, '[^/]+')
    .replace(/\\\*/g, '.*');

  return new RegExp(`^${escaped}$`, 'u');
}

function requestMatches(
  request: Request,
  method: Fr12HttpMethod,
  path: string,
): boolean {
  return request.method() === method && new URL(request.url()).pathname === path;
}

export class AdminAccessPage {
  readonly loginForm: Locator;
  readonly loginHeading: Locator;
  readonly emailControl: Locator;
  readonly passwordControl: Locator;
  readonly submitButton: Locator;
  readonly protectedAdminIdentity: Locator;
  readonly dashboardIdentity: Locator;

  constructor(
    private readonly page: Page,
    labels: AdminAccessLabels,
  ) {
    this.loginForm = page.locator('form').filter({
      has: page.getByRole('button', {
        name: exactAccessibleName(labels.submitButton),
      }),
    });
    this.loginHeading = this.loginForm.getByRole('heading', {
      name: exactAccessibleName(labels.loginHeading),
    });
    this.emailControl = this.loginForm.getByPlaceholder(
      exactAccessibleName(labels.emailControl),
    );
    this.passwordControl = this.loginForm.getByPlaceholder(
      exactAccessibleName(labels.passwordControl),
    );
    this.submitButton = this.loginForm.getByRole('button', {
      name: exactAccessibleName(labels.submitButton),
    });
    this.protectedAdminIdentity = page.getByRole('heading', {
      name: exactAccessibleName(labels.protectedAdminIdentity),
    });
    this.dashboardIdentity = page.getByRole('heading', {
      name: exactAccessibleName(labels.dashboardIdentity),
    });
  }

  async goto(adminOrigin: string, adminEntryPath: string): Promise<void> {
    const normalizedOrigin = `${adminOrigin.replace(/\/$/u, '')}/`;
    await this.page.goto(new URL(adminEntryPath, normalizedOrigin).toString());
  }

  async loginOnce(credentials: AdminCredentials): Promise<void> {
    await this.emailControl.fill(credentials.email);
    await this.passwordControl.fill(credentials.password);
    await this.submitButton.click();
  }

  observeMutationRequests(
    classifier: AdminMutationRequestClassifier,
  ): RequestCountObserver {
    const pathPatterns = classifier.pathTemplates.map(pathTemplatePattern);
    let observedCount = 0;
    let isObserving = true;
    const listener = (request: Request): void => {
      const requestMethod = request.method() as Fr12HttpMethod;
      const requestPath = new URL(request.url()).pathname;

      if (
        classifier.methods.includes(requestMethod) &&
        pathPatterns.some((pattern) => pattern.test(requestPath))
      ) {
        observedCount += 1;
      }
    };

    this.page.on('request', listener);

    return {
      count: () => observedCount,
      stop: () => {
        if (isObserving) {
          this.page.off('request', listener);
          isObserving = false;
        }
      },
    };
  }

  observeLoginResponses(method: Fr12HttpMethod, path: string): LoginResponseObserver {
    const matchingResponses: Response[] = [];
    let isObserving = true;
    const listener = (response: Response): void => {
      if (requestMatches(response.request(), method, path)) {
        matchingResponses.push(response);
      }
    };

    this.page.on('response', listener);

    return {
      count: () => matchingResponses.length,
      successfulCount: () =>
        matchingResponses.filter((response) => response.ok()).length,
      stop: () => {
        if (isObserving) {
          this.page.off('response', listener);
          isObserving = false;
        }
      },
    };
  }

  observeAndDismissDialogs(): DialogObservation {
    const observedDialogs: Dialog[] = [];
    const handlingPromises: Promise<void>[] = [];
    let isObserving = true;
    const listener = (dialog: Dialog): void => {
      observedDialogs.push(dialog);
      handlingPromises.push(dialog.dismiss());
    };

    this.page.on('dialog', listener);

    return {
      count: () => observedDialogs.length,
      messages: () => observedDialogs.map((dialog) => dialog.message()),
      types: () => observedDialogs.map((dialog) => dialog.type()),
      settle: async () => Promise.all(handlingPromises).then(() => undefined),
      stop: () => {
        if (isObserving) {
          this.page.off('dialog', listener);
          isObserving = false;
        }
      },
    };
  }
}
