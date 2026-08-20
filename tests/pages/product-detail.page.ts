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
