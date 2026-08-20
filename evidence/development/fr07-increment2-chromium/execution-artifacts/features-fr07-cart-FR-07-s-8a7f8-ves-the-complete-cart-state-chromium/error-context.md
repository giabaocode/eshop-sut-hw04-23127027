# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC07 cancelling deletion preserves the complete cart state
- Location: tests/features/fr07-cart.spec.ts:850:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5173/
Call log:
  - navigating to "http://127.0.0.1:5173/", waiting until "load"

```

# Test source

```ts
  1  | import type { Locator, Page } from '@playwright/test';
  2  | 
  3  | function escapeRegularExpression(value: string): string {
  4  |   return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  5  | }
  6  | 
  7  | function exactAccessibleName(name: string): RegExp {
  8  |   return new RegExp(`^\\s*${escapeRegularExpression(name)}\\s*$`, 'i');
  9  | }
  10 | 
  11 | export class CatalogPage {
  12 |   constructor(private readonly page: Page) {}
  13 | 
  14 |   async goto(homePath: string): Promise<void> {
> 15 |     await this.page.goto(homePath);
     |                     ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5173/
  16 |   }
  17 | 
  18 |   productHeading(productName: string): Locator {
  19 |     return this.page.getByRole('heading', {
  20 |       name: exactAccessibleName(productName),
  21 |     });
  22 |   }
  23 | 
  24 |   productCard(productName: string): Locator {
  25 |     return this.productHeading(productName).locator('xpath=..');
  26 |   }
  27 | 
  28 |   addToCartButton(productName: string, buttonName: string): Locator {
  29 |     return this.productCard(productName).getByRole('button', {
  30 |       name: exactAccessibleName(buttonName),
  31 |     });
  32 |   }
  33 | 
  34 |   productDetailLink(productName: string, linkName: string): Locator {
  35 |     return this.productCard(productName).getByRole('link', {
  36 |       name: exactAccessibleName(linkName),
  37 |     });
  38 |   }
  39 | 
  40 |   async openProductDetail(
  41 |     productName: string,
  42 |     linkName: string,
  43 |   ): Promise<void> {
  44 |     await this.productDetailLink(productName, linkName).click();
  45 |   }
  46 | 
  47 |   async addProductOnce(productName: string, buttonName: string): Promise<void> {
  48 |     await this.addToCartButton(productName, buttonName).click();
  49 |   }
  50 | 
  51 |   async openCart(cartLinkName: string): Promise<void> {
  52 |     await this.page
  53 |       .getByRole('navigation')
  54 |       .getByRole('link', {
  55 |         name: new RegExp(
  56 |           `^\\s*${escapeRegularExpression(cartLinkName)}(?:\\s.*)?$`,
  57 |           'i',
  58 |         ),
  59 |       })
  60 |       .click();
  61 |   }
  62 | }
  63 | 
```