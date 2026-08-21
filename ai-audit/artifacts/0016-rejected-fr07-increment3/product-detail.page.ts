import type { Locator, Page } from '@playwright/test';

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

  visualAddFeedback(
    productName: string,
    initialButtonName: string,
    semanticRoles: ['alert', 'status'],
    allowControlStateOrTextTransition: boolean,
  ): Locator {
    const semanticNotification = this.page
      .getByRole(semanticRoles[0])
      .or(this.page.getByRole(semanticRoles[1]));

    if (!allowControlStateOrTextTransition) {
      return semanticNotification;
    }

    const productView = this.productView(productName);
    const controlTextTransition = productView
      .getByRole('button')
      .filter({ hasNotText: exactAccessibleName(initialButtonName) });
    const controlStateTransition = productView.locator(
      'button:disabled, [role="button"][aria-disabled="true"], button[aria-pressed="true"], button[aria-busy="true"]',
    );

    return semanticNotification
      .or(controlTextTransition)
      .or(controlStateTransition);
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
}
