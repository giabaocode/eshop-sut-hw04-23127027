import type { ElementHandle, Locator, Page } from '@playwright/test';

interface FeedbackElementState {
  visibleText: string;
  ariaLabel: string | null;
}

interface AddControlFeedbackState extends FeedbackElementState {
  disabled: boolean;
  ariaDisabled: string | null;
  ariaPressed: string | null;
  ariaBusy: string | null;
}

interface SemanticFeedbackBaseline {
  element: ElementHandle;
  role: 'alert' | 'status';
  state: FeedbackElementState;
}

export interface AddFeedbackBaseline {
  control: ElementHandle;
  controlState: AddControlFeedbackState;
  semanticSignals: SemanticFeedbackBaseline[];
}

function exactAccessibleName(name: string): RegExp {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escapedName}\\s*$`, 'i');
}

export class ProductDetailPage {
  constructor(private readonly page: Page) {}

  productHeading(productName: string): Locator {
    return this.page.getByRole('heading', {
      level: 1,
      name: exactAccessibleName(productName),
    });
  }

  productView(productName: string): Locator {
    return this.page.getByRole('main').filter({
      has: this.productHeading(productName),
    });
  }

  displayedProductImages(productName: string): Locator {
    return this.productView(productName).locator('img:visible');
  }

  quantityLabel(productName: string, label: string): Locator {
    return this.productView(productName).getByText(exactAccessibleName(label));
  }

  quantityInput(productName: string): Locator {
    return this.productView(productName).getByRole('spinbutton');
  }

  addToCartButton(productName: string, buttonName: string): Locator {
    return this.productView(productName).getByRole('button', {
      name: exactAccessibleName(buttonName),
    });
  }

  async captureAddFeedbackBaseline(
    productName: string,
    addControl: Locator,
    semanticRoles: ['alert', 'status'],
  ): Promise<AddFeedbackBaseline> {
    const control = await addControl.elementHandle();
    if (control === null) {
      throw new Error('Unable to capture the visible Add control baseline.');
    }

    return {
      control,
      controlState: await this.readAddControlFeedbackState(control),
      semanticSignals: await this.visibleSemanticFeedbackSignals(
        productName,
        semanticRoles,
      ),
    };
  }

  async addFeedbackTransitionCount(
    productName: string,
    baseline: AddFeedbackBaseline,
    semanticRoles: ['alert', 'status'],
    allowControlStateOrTextTransition: boolean,
  ): Promise<number> {
    const currentSignals = await this.visibleSemanticFeedbackSignals(
      productName,
      semanticRoles,
    );
    let transitionCount = 0;

    for (const currentSignal of currentSignals) {
      const matchingBaseline = await this.matchingBaselineSignal(
        currentSignal,
        baseline.semanticSignals,
      );
      if (
        matchingBaseline === null ||
        !this.sameFeedbackElementState(
          currentSignal.state,
          matchingBaseline.state,
        )
      ) {
        transitionCount += 1;
      }
    }

    if (!allowControlStateOrTextTransition) {
      return transitionCount;
    }

    const currentControlState = await this.tryReadAddControlFeedbackState(
      baseline.control,
    );
    if (
      currentControlState !== null &&
      !this.sameAddControlFeedbackState(
        currentControlState,
        baseline.controlState,
      )
    ) {
      transitionCount += 1;
    }

    return transitionCount;
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    await this.quantityInput(productName).fill(String(quantity));
  }

  async addToCartOnce(productName: string, buttonName: string): Promise<void> {
    await this.addToCartButton(productName, buttonName).click();
  }

  async openHome(homeLinkName: string): Promise<void> {
    await this.page
      .getByRole('banner')
      .getByRole('link', { name: exactAccessibleName(homeLinkName) })
      .click();
  }

  private async visibleSemanticFeedbackSignals(
    productName: string,
    semanticRoles: ['alert', 'status'],
  ): Promise<SemanticFeedbackBaseline[]> {
    const signals: SemanticFeedbackBaseline[] = [];

    for (const role of semanticRoles) {
      const elements = await this.productView(productName)
        .getByRole(role)
        .elementHandles();
      for (const element of elements) {
        if (await element.isVisible()) {
          signals.push({
            element,
            role,
            state: await this.readFeedbackElementState(element),
          });
        }
      }
    }

    return signals;
  }

  private async matchingBaselineSignal(
    currentSignal: SemanticFeedbackBaseline,
    baselineSignals: SemanticFeedbackBaseline[],
  ): Promise<SemanticFeedbackBaseline | null> {
    for (const baselineSignal of baselineSignals) {
      if (currentSignal.role !== baselineSignal.role) {
        continue;
      }

      const isSameElement = await currentSignal.element.evaluate(
        (currentElement, baselineElement) => currentElement === baselineElement,
        baselineSignal.element,
      );
      if (isSameElement) {
        return baselineSignal;
      }
    }

    return null;
  }

  private async readFeedbackElementState(
    element: ElementHandle,
  ): Promise<FeedbackElementState> {
    return {
      visibleText: (await element.innerText()).trim(),
      ariaLabel: await element.getAttribute('aria-label'),
    };
  }

  private async readAddControlFeedbackState(
    control: ElementHandle,
  ): Promise<AddControlFeedbackState> {
    return {
      ...(await this.readFeedbackElementState(control)),
      disabled: await control.isDisabled(),
      ariaDisabled: await control.getAttribute('aria-disabled'),
      ariaPressed: await control.getAttribute('aria-pressed'),
      ariaBusy: await control.getAttribute('aria-busy'),
    };
  }

  private async tryReadAddControlFeedbackState(
    control: ElementHandle,
  ): Promise<AddControlFeedbackState | null> {
    try {
      return await this.readAddControlFeedbackState(control);
    } catch {
      return null;
    }
  }

  private sameFeedbackElementState(
    left: FeedbackElementState,
    right: FeedbackElementState,
  ): boolean {
    return (
      left.visibleText === right.visibleText &&
      left.ariaLabel === right.ariaLabel
    );
  }

  private sameAddControlFeedbackState(
    left: AddControlFeedbackState,
    right: AddControlFeedbackState,
  ): boolean {
    return (
      this.sameFeedbackElementState(left, right) &&
      left.disabled === right.disabled &&
      left.ariaDisabled === right.ariaDisabled &&
      left.ariaPressed === right.ariaPressed &&
      left.ariaBusy === right.ariaBusy
    );
  }
}
