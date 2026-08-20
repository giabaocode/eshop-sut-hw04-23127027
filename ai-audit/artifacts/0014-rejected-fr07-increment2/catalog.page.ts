import type { Locator, Page } from '@playwright/test';

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactAccessibleName(name: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(name)}\\s*$`, 'i');
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

  productDetailLink(productName: string, linkName: string): Locator {
    return this.productCard(productName).getByRole('link', {
      name: exactAccessibleName(linkName),
    });
  }

  async openProductDetail(
    productName: string,
    linkName: string,
  ): Promise<void> {
    await this.productDetailLink(productName, linkName).click();
  }

  async addProductOnce(productName: string, buttonName: string): Promise<void> {
    await this.addToCartButton(productName, buttonName).click();
  }

  async openCart(cartLinkName: string): Promise<void> {
    await this.page
      .getByRole('navigation')
      .getByRole('link', {
        name: new RegExp(
          `^\\s*${escapeRegularExpression(cartLinkName)}(?:\\s.*)?$`,
          'i',
        ),
      })
      .click();
  }
}
