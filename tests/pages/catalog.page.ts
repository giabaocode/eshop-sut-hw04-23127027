import type { Locator, Page } from '@playwright/test';

function exactAccessibleName(name: string): RegExp {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escapedName}\\s*$`, 'i');
}

export class CatalogPage {
  constructor(private readonly page: Page) {}

  async goto(homePath: string): Promise<void> {
    await this.page.goto(homePath);
  }

  productHeading(productName: string): Locator {
    return this.page.getByRole('heading', {
      name: exactAccessibleName(productName),
    });
  }

  productCard(productName: string): Locator {
    return this.productHeading(productName).locator('xpath=..');
  }

  addToCartButton(productName: string, buttonName: string): Locator {
    return this.productCard(productName).getByRole('button', {
      name: exactAccessibleName(buttonName),
    });
  }

  async addProductOnce(productName: string, buttonName: string): Promise<void> {
    await this.addToCartButton(productName, buttonName).click();
  }

  async openCart(cartLinkName: string): Promise<void> {
    await this.page
      .getByRole('link', { name: exactAccessibleName(cartLinkName) })
      .click();
  }
}
