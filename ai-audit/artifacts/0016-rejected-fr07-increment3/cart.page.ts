import type { Locator, Page } from '@playwright/test';
import type {
  CartColumnLabels,
  CartCurrencyRules,
  DialogActionSemantics,
} from '../support/data-loader.js';

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactAccessibleName(name: string): RegExp {
  return new RegExp(`^\\s*${escapeRegularExpression(name)}\\s*$`, 'i');
}

function requiredMeaningPattern(terms: string[]): RegExp {
  const lookaheads = terms
    .map((term) => `(?=.*${escapeRegularExpression(term)})`)
    .join('');
  return new RegExp(`^${lookaheads}\\s*\\S(?:.*\\S)?\\s*$`, 'iu');
}

function displayedCurrencyOnlyPattern(currency: CartCurrencyRules): RegExp {
  return new RegExp(
    `^\\s*-?\\s*\\d(?:[\\d.,\\s]*\\d)?\\s*${escapeRegularExpression(currency.symbol)}\\s*$`,
    'u',
  );
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

export function displayedCurrencyAmountPattern(
  amount: number,
  currency: CartCurrencyRules,
): RegExp {
  const absoluteDigits = String(Math.abs(amount));
  const separatorPattern = currency.requireThousandsSeparator
    ? '[^\\d]+'
    : '[^\\d]*';
  const groupedDigits = absoluteDigits.replace(
    /\B(?=(\d{3})+(?!\d))/gu,
    separatorPattern,
  );
  const signPattern = amount < 0 ? '-\\s*' : '';

  return new RegExp(
    `${signPattern}${groupedDigits}\\s*${escapeRegularExpression(currency.symbol)}`,
    'u',
  );
}

interface RgbColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface CartRowState {
  productName: string;
  quantity: number;
  lineAmount: number;
}

export interface DisplayedCartState {
  rowCount: number;
  total: number;
  lineAmountSum: number;
}

export type DangerousColorCategory = 'red' | 'not-red';

function parseComputedRgb(value: string): RgbColor | null {
  const match = value.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)$/u,
  );

  if (!match) {
    return null;
  }

  return {
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function isSemanticRed(value: string): boolean {
  const color = parseComputedRgb(value);
  if (color === null || color.alpha === 0) {
    return false;
  }

  const red = color.red / 255;
  const green = color.green / 255;
  const blue = color.blue / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const chroma = maximum - minimum;

  if (chroma < 0.15 || maximum !== red) {
    return false;
  }

  const hueSector = ((green - blue) / chroma) % 6;
  const hue = (hueSector * 60 + 360) % 360;
  return hue <= 20 || hue >= 340;
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

  cartView(): Locator {
    return this.page.getByRole('main').filter({ has: this.table });
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

  deleteButton(row: Locator, accessibleName: string): Locator {
    return row.getByRole('button', {
      name: exactAccessibleName(accessibleName),
    });
  }

  confirmationDialog(): Locator {
    return this.page
      .getByRole('dialog')
      .or(this.page.getByRole('alertdialog'));
  }

  semanticDialogAction(
    dialog: Locator,
    semantics: DialogActionSemantics,
  ): Locator {
    const vocabulary = semantics.vocabulary
      .map(escapeRegularExpression)
      .join('|');
    const excludedVocabulary = semantics.excludedVocabulary
      .map(escapeRegularExpression)
      .join('|');
    const semanticName = new RegExp(
      `^(?!.*(?:${excludedVocabulary})).*(?:${vocabulary}).*$`,
      'iu',
    );

    return dialog.getByRole('button', { name: semanticName });
  }

  async dangerousActionColorCategory(
    action: Locator,
  ): Promise<DangerousColorCategory> {
    const computedColors = await action.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return [style.color, style.backgroundColor, style.borderTopColor];
    });

    return computedColors.some(isSemanticRed) ? 'red' : 'not-red';
  }

  cartNavbarLink(cartLinkName: string): Locator {
    return this.page
      .getByRole('navigation')
      .getByRole('link', {
        name: new RegExp(
          `^\\s*${escapeRegularExpression(cartLinkName)}(?:\\s.*)?$`,
          'i',
        ),
      });
  }

  semanticBreadcrumb(currentPageLabel: string): Locator {
    const currentPage = this.page.getByText(
      exactAccessibleName(currentPageLabel),
    );

    return this.page
      .getByRole('main')
      .getByRole('navigation', { name: /\S/u })
      .filter({ has: currentPage });
  }

  requiredContinueShoppingLink(requiredLabel: string): Locator {
    return this.page.getByRole('main').getByRole('link', {
      name: exactAccessibleName(requiredLabel),
    });
  }

  semanticShoppingDestinationLink(meaningTerms: string[]): Locator {
    return this.page.getByRole('main').getByRole('link', {
      name: requiredMeaningPattern(meaningTerms),
    });
  }

  semanticCartBadge(
    cartLinkName: string,
    numericTextPattern: string,
  ): Locator {
    return this.cartNavbarLink(cartLinkName)
      .locator('xpath=..')
      .getByText(new RegExp(`^\\s*(?:${numericTextPattern})\\s*$`, 'u'));
  }

  async semanticCartBadgeCount(badge: Locator): Promise<number> {
    const displayedCount = await badge.innerText();
    const normalizedCount = displayedCount.trim();

    if (!/^\d+$/u.test(normalizedCount)) {
      throw new Error(
        `Unable to parse displayed cart badge count: ${JSON.stringify(displayedCount)}`,
      );
    }

    return Number(normalizedCount);
  }

  cartBadge(cartLinkName: string, numericTextPattern: string): Locator {
    return this.cartNavbarLink(cartLinkName).getByText(
      new RegExp(`^\\s*(?:${numericTextPattern})\\s*$`, 'u'),
    );
  }

  async cartBadgeCount(
    cartLinkName: string,
    numericTextPattern: string,
  ): Promise<number> {
    const displayedCount = await this.cartBadge(
      cartLinkName,
      numericTextPattern,
    ).innerText();
    const normalizedCount = displayedCount.trim();

    if (!/^\d+$/u.test(normalizedCount)) {
      throw new Error(
        `Unable to parse displayed cart badge count: ${JSON.stringify(displayedCount)}`,
      );
    }

    return Number(normalizedCount);
  }

  unitPriceCell(row: Locator, columns: CartColumnLabels): Locator {
    return this.cell(row, columns, 'unitPrice');
  }

  quantityCell(row: Locator, columns: CartColumnLabels): Locator {
    return this.cell(row, columns, 'quantity');
  }

  lineAmountCell(row: Locator, columns: CartColumnLabels): Locator {
    return this.cell(row, columns, 'lineAmount');
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

  cartSummaryAmount(currency: CartCurrencyRules): Locator {
    return this.cartView()
      .locator('*')
      .filter({ hasText: displayedCurrencyOnlyPattern(currency) })
      .locator('xpath=self::*[not(ancestor::table)]');
  }

  exactTotalSummaryContainer(currency: CartCurrencyRules): Locator {
    return this.cartSummaryAmount(currency).locator('xpath=..');
  }

  async exactTotalLabelText(currency: CartCurrencyRules): Promise<string> {
    const amount = this.cartSummaryAmount(currency);
    const container = this.exactTotalSummaryContainer(currency);
    const amountText = await amount.innerText();
    const containerText = await container.innerText();
    const labelText = containerText.replace(amountText, '').trim();

    return labelText.replace(
      /^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu,
      '',
    );
  }

  emptyStateMessage(meaningTerms: string[]): Locator {
    const semanticName = requiredMeaningPattern(meaningTerms);
    const main = this.page.getByRole('main');

    return main
      .getByRole('heading', { name: semanticName })
      .or(main.getByRole('status').filter({ hasText: semanticName }))
      .or(main.getByRole('alert').filter({ hasText: semanticName }));
  }

  accessibleEmptyStateIllustration(): Locator {
    return this.page.getByRole('main').getByRole('img', { name: /\S/u });
  }

  async cartSummaryTotal(currency: CartCurrencyRules): Promise<number> {
    return parseDisplayedCurrency(
      await this.cartSummaryAmount(currency).innerText(),
      currency,
    );
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

  async readRowState(
    productName: string,
    row: Locator,
    columns: CartColumnLabels,
    currency: CartCurrencyRules,
  ): Promise<CartRowState> {
    return {
      productName,
      quantity: await this.quantity(row, columns),
      lineAmount: await this.lineAmount(row, columns, currency),
    };
  }

  async readCartState(
    columns: CartColumnLabels,
    totalLabel: string,
    currency: CartCurrencyRules,
  ): Promise<DisplayedCartState> {
    return {
      rowCount: await this.dataRows().count(),
      total: await this.cartTotal(totalLabel, currency),
      lineAmountSum: await this.sumDisplayedLineAmounts(columns, currency),
    };
  }

  async readCartStateFromSummary(
    columns: CartColumnLabels,
    currency: CartCurrencyRules,
  ): Promise<DisplayedCartState> {
    return {
      rowCount: await this.dataRows().count(),
      total: await this.cartSummaryTotal(currency),
      lineAmountSum: await this.sumDisplayedLineAmounts(columns, currency),
    };
  }

  private cell(
    row: Locator,
    columns: CartColumnLabels,
    column: keyof CartColumnLabels,
  ): Locator {
    const columnOrder = Object.keys(columns) as Array<keyof CartColumnLabels>;
    const columnIndex = columnOrder.indexOf(column);

    if (columnIndex < 0) {
      throw new Error(`External cart columns do not define ${column}.`);
    }

    return row.getByRole('cell').nth(columnIndex);
  }

  private async cellText(
    row: Locator,
    columns: CartColumnLabels,
    column: keyof CartColumnLabels,
  ): Promise<string> {
    return this.cell(row, columns, column).innerText();
  }
}
