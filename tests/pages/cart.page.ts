import type { Locator, Page } from '@playwright/test';
import type {
  CartColumnLabels,
  CartCurrencyRules,
} from '../support/data-loader.js';

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactAccessibleName(name: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(name)}\\s*$`, 'i');
}

export function parseDisplayedCurrency(
  displayedValue: string,
  currency: CartCurrencyRules,
): number {
  const withoutCurrencySymbol = displayedValue.replaceAll(currency.symbol, '');
  const numericCharacters = withoutCurrencySymbol.replace(/[^\d-]/gu, '');

  if (!/^-?\d+$/u.test(numericCharacters)) {
    throw new Error(
      `Unable to parse displayed currency value: ${JSON.stringify(displayedValue)}`,
    );
  }

  return Number(numericCharacters);
}

export function hasDisplayedThousandsSeparator(displayedValue: string): boolean {
  return /\d[^\d]\d{3}(?=[^\d]|$)/u.test(displayedValue);
}

export class CartPage {
  readonly table: Locator;
  readonly allLevelOneHeadings: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
    this.allLevelOneHeadings = page.getByRole('heading', { level: 1 });
  }

  descriptiveHeading(heading: string): Locator {
    return this.page.getByRole('heading', {
      level: 1,
      name: exactAccessibleName(heading),
    });
  }

  columnHeader(label: string): Locator {
    return this.table.getByRole('columnheader', {
      name: exactAccessibleName(label),
    });
  }

  productRows(productName: string): Locator {
    return this.table.getByRole('row').filter({
      has: this.page.getByRole('cell', {
        name: exactAccessibleName(productName),
      }),
    });
  }

  productRow(productName: string): Locator {
    return this.productRows(productName);
  }

  dataRows(): Locator {
    return this.table.getByRole('row').filter({
      has: this.page.getByRole('cell'),
    });
  }

  incrementButton(row: Locator, accessibleName: string): Locator {
    return row.getByRole('button', {
      name: exactAccessibleName(accessibleName),
    });
  }

  decrementButton(row: Locator, accessibleName: string): Locator {
    return row.getByRole('button', {
      name: exactAccessibleName(accessibleName),
    });
  }

  async unitPriceText(
    row: Locator,
    columns: CartColumnLabels,
  ): Promise<string> {
    return this.cellText(row, columns, 'unitPrice');
  }

  async unitPrice(
    row: Locator,
    columns: CartColumnLabels,
    currency: CartCurrencyRules,
  ): Promise<number> {
    return parseDisplayedCurrency(
      await this.unitPriceText(row, columns),
      currency,
    );
  }

  async quantity(row: Locator, columns: CartColumnLabels): Promise<number> {
    const displayedQuantity = await this.cellText(row, columns, 'quantity');
    const normalizedQuantity = displayedQuantity.trim();

    if (!/^\d+$/u.test(normalizedQuantity)) {
      throw new Error(
        `Unable to parse displayed quantity: ${JSON.stringify(displayedQuantity)}`,
      );
    }

    return Number(normalizedQuantity);
  }

  async lineAmountText(
    row: Locator,
    columns: CartColumnLabels,
  ): Promise<string> {
    return this.cellText(row, columns, 'lineAmount');
  }

  async lineAmount(
    row: Locator,
    columns: CartColumnLabels,
    currency: CartCurrencyRules,
  ): Promise<number> {
    return parseDisplayedCurrency(
      await this.lineAmountText(row, columns),
      currency,
    );
  }

  cartTotalContainer(totalLabel: string): Locator {
    return this.page.getByText(
      new RegExp(`^\\s*${escapeRegularExpression(totalLabel)}\\s*:`),
    );
  }

  async cartTotalText(totalLabel: string): Promise<string> {
    return this.cartTotalContainer(totalLabel).innerText();
  }

  async cartTotal(
    totalLabel: string,
    currency: CartCurrencyRules,
  ): Promise<number> {
    return parseDisplayedCurrency(await this.cartTotalText(totalLabel), currency);
  }

  async sumDisplayedLineAmounts(
    columns: CartColumnLabels,
    currency: CartCurrencyRules,
  ): Promise<number> {
    const rows = await this.dataRows().all();
    let total = 0;

    for (const row of rows) {
      total += await this.lineAmount(row, columns, currency);
    }

    return total;
  }

  private async cellText(
    row: Locator,
    columns: CartColumnLabels,
    column: keyof CartColumnLabels,
  ): Promise<string> {
    const columnOrder = Object.keys(columns) as Array<keyof CartColumnLabels>;
    const columnIndex = columnOrder.indexOf(column);

    if (columnIndex < 0) {
      throw new Error(`External cart columns do not define ${column}.`);
    }

    return row.getByRole('cell').nth(columnIndex).innerText();
  }
}
