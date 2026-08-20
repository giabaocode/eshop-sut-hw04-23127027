import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type RegistrationFieldKey =
  | 'fullName'
  | 'email'
  | 'password'
  | 'confirmationPassword';

export type RegistrationFocusKey = RegistrationFieldKey | 'submit';

export interface RegistrationLabels {
  heading: string;
  fullName: string;
  email: string;
  password: string;
  confirmationPassword: string;
  submit: string;
}

export interface RegistrationFillInput {
  fullName: string;
  emailTemplate: string;
  password: string;
  confirmationPassword?: string;
}

export interface RegistrationInputTemplate extends RegistrationFillInput {
  confirmationPassword: string;
}

export interface LoginDestinationLabels {
  heading: string;
  email: string;
  password: string;
  submit: string;
}

interface RegistrationCaseBase {
  id: string;
  title: string;
  registrationPath: string;
}

interface ValidRegistrationCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  input: RegistrationInputTemplate;
  expected: {
    labels: RegistrationLabels;
    vietnameseContent: string[];
    loginDestination: LoginDestinationLabels;
  };
}

interface OmissionVariant {
  name: string;
  fieldsToFill: RegistrationFieldKey[];
  omittedFields: RegistrationFieldKey[];
  input: RegistrationInputTemplate;
}

interface RequiredFieldOmissionsCase extends RegistrationCaseBase {
  expected: {
    labels: RegistrationLabels;
    requiredMarker: string;
    requiredFields: RegistrationFieldKey[];
  };
  variants: OmissionVariant[];
}

interface EmailPartition {
  name: string;
  input: RegistrationInputTemplate;
}

interface EmailFormatPartitionsCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  expected: {
    labels: RegistrationLabels;
    emailType: string;
  };
  invalid: EmailPartition[];
  valid: EmailPartition;
}

interface RegistrationFormSemanticsCase extends RegistrationCaseBase {
  expected: {
    labels: RegistrationLabels;
    passwordType: string;
    focusOrder: RegistrationFocusKey[];
  };
}

interface PasswordBoundaryVariant {
  name: string;
  input: RegistrationFillInput;
  expected: {
    registrationRequestCount: number;
  };
}

interface PasswordLengthBoundaryCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  variants: {
    sevenCharacterInvalid: PasswordBoundaryVariant;
    eightCharacterValid: PasswordBoundaryVariant;
  };
  expected: {
    labels: RegistrationLabels;
    registrationEndpoint: string;
    loginDestination: LoginDestinationLabels;
  };
}

export interface PasswordRuleRejectionCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  input: RegistrationFillInput;
  expected: {
    labels: RegistrationLabels;
    registrationEndpoint: string;
    registrationRequestCount: number;
  };
}

interface PasswordAllowedSpecialRow {
  name: string;
  symbol: string;
  input: RegistrationFillInput;
  expected: {
    registrationRequestCount: number;
  };
}

interface PasswordEachAllowedSpecialCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  rows: PasswordAllowedSpecialRow[];
  expected: {
    labels: RegistrationLabels;
    registrationEndpoint: string;
    loginDestination: LoginDestinationLabels;
  };
}

interface ConfirmationMatchRow {
  name: string;
  passwordsMatch: boolean;
  input: RegistrationFillInput;
  expected: {
    registrationRequestCount: number;
  };
}

interface ConfirmationMatchMatrixCase extends RegistrationCaseBase {
  fieldsToFill: RegistrationFieldKey[];
  rows: [ConfirmationMatchRow, ConfirmationMatchRow];
  expected: {
    labels: RegistrationLabels;
    confirmationControl: {
      requiredAttribute: string;
      type: string;
    };
    registrationEndpoint: string;
    loginDestination: LoginDestinationLabels;
  };
}

interface ApiRegistrationInput {
  name: string;
  emailTemplate: string;
  password: string;
}

interface ApiRegistrationRecord {
  name: string;
  input: ApiRegistrationInput;
}

interface ApiUniqueThenDuplicateCase {
  id: string;
  title: string;
  endpoint: string;
  firstEmailReferenceToken: string;
  records: [ApiRegistrationRecord, ApiRegistrationRecord];
  expected: {
    first: {
      status: number;
      message: string;
      idType: string;
    };
    second: {
      successful: boolean;
    };
  };
}

export interface Fr01RegistrationData {
  valid_registration_ui: ValidRegistrationCase;
  required_field_omissions: RequiredFieldOmissionsCase;
  email_format_partitions: EmailFormatPartitionsCase;
  registration_form_semantics: RegistrationFormSemanticsCase;
  password_length_boundary: PasswordLengthBoundaryCase;
  password_missing_uppercase: PasswordRuleRejectionCase;
  password_missing_lowercase: PasswordRuleRejectionCase;
  password_missing_digit: PasswordRuleRejectionCase;
  password_missing_allowed_special: PasswordRuleRejectionCase;
  password_each_allowed_special: PasswordEachAllowedSpecialCase;
  confirmation_match_matrix: ConfirmationMatchMatrixCase;
  api_unique_then_duplicate: ApiUniqueThenDuplicateCase;
}

export interface CartPaths {
  home: string;
  cart: string;
}

export interface CartNavigationLabels {
  cartLink: string;
  addToCartButton: string;
}

export interface CartColumnLabels {
  product: string;
  unitPrice: string;
  quantity: string;
  lineAmount: string;
  action: string;
}

export interface CartCurrencyRules {
  symbol: string;
  requireThousandsSeparator: boolean;
}

export interface CartProductFixture {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface DialogActionSemantics {
  vocabulary: string[];
  excludedVocabulary: string[];
}

interface Fr07CaseBase {
  id: string;
  title: string;
}

interface PopulatedCartTwoProductsCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  products: [CartProductFixture, CartProductFixture];
  expected: {
    heading: string;
    columns: CartColumnLabels;
    controls: {
      increment: string;
      decrement: string;
    };
    currency: CartCurrencyRules;
    counts: {
      distinctProducts: number;
      addActionsPerProduct: number;
      rows: number;
      levelOneHeadings: number;
      rowsPerProduct: number;
      incrementControlsPerRow: number;
      decrementControlsPerRow: number;
    };
  };
}

interface InvalidAuthenticationPartition {
  name: string;
  tokenClass: string;
  authorizationHeader: string | null;
}

interface CartInvalidAuthenticationCase extends Fr07CaseBase {
  endpoints: {
    login: string;
    cart: string;
  };
  headers: {
    authorization: string;
    bearerScheme: string;
  };
  loginCredentials: {
    email: string;
    password: string;
  };
  tokenPartitions: [
    InvalidAuthenticationPartition,
    InvalidAuthenticationPartition,
    InvalidAuthenticationPartition,
  ];
  postRequestBody: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  expected: {
    tokenProperty: string;
    tokenPartitionCount: number;
    requestsPerPartition: number;
    rejectionResponseCount: number;
    loginSuccessful: boolean;
    baselineGetSuccessful: boolean;
    finalGetSuccessful: boolean;
  };
}

interface SameProductUiAdditionCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  product: CartProductFixture;
  addActionCount: number;
  expected: {
    columns: CartColumnLabels;
    totalLabel: string;
    currency: CartCurrencyRules;
    counts: {
      rows: number;
      rowsForProduct: number;
    };
  };
}

interface QuantityIncrementCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  product: {
    id: number;
    name: string;
    unitPrice: number;
    initialQuantity: number;
    incrementedQuantity: number;
  };
  addActionCount: number;
  expected: {
    columns: CartColumnLabels;
    controls: {
      increment: string;
    };
    totalLabel: string;
    currency: CartCurrencyRules;
    counts: {
      rows: number;
      rowsForProduct: number;
      incrementControlsForProduct: number;
    };
  };
}

interface QuantityDecrementAboveMinimumCase extends Fr07CaseBase {
  paths: CartPaths & {
    productDetail: string;
  };
  navigation: {
    homeLink: string;
    cartLink: string;
    productDetailLink: string;
    homeAddToCartButton: string;
    productDetailAddToCartButton: string;
    quantityLabel: string;
  };
  targetProduct: {
    id: number;
    name: string;
    unitPrice: number;
    initialQuantity: number;
    finalQuantity: number;
    initialLineAmount: number;
    finalLineAmount: number;
  };
  comparisonProduct: {
    id: number;
    name: string;
    unitPrice: number;
    quantity: number;
    lineAmount: number;
  };
  actionCounts: {
    targetAdd: number;
    comparisonAdd: number;
    decrement: number;
  };
  expected: {
    columns: CartColumnLabels;
    controls: {
      decrement: string;
    };
    totalLabel: string;
    currency: CartCurrencyRules;
    counts: {
      rows: number;
      rowsForTargetProduct: number;
      rowsForComparisonProduct: number;
      decrementControlsForTargetProduct: number;
    };
    initialTotal: number;
    finalTotal: number;
    deltas: {
      rowCount: number;
      targetQuantity: number;
      targetLineAmount: number;
      comparisonQuantity: number;
      comparisonLineAmount: number;
      cartTotal: number;
    };
  };
}

interface DeletableItemCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  product: CartProductFixture & {
    lineAmount: number;
  };
  actions: {
    delete: string;
    dismiss: DialogActionSemantics;
  };
  actionCounts: {
    add: number;
    delete: number;
    dismiss: number;
  };
  expected: {
    columns: CartColumnLabels;
    totalLabel: string;
    currency: CartCurrencyRules;
    dangerousColorCategory: 'red';
    total: number;
    counts: {
      rows: number;
      rowsForProduct: number;
      deleteActionsForProduct: number;
      dialogs: number;
      dismissActions: number;
    };
  };
}

interface DeletionCancelCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  product: CartProductFixture & {
    lineAmount: number;
  };
  actions: {
    delete: string;
    cancel: DialogActionSemantics;
  };
  actionCounts: {
    add: number;
    delete: number;
    cancel: number;
  };
  expected: {
    columns: CartColumnLabels;
    totalLabel: string;
    currency: CartCurrencyRules;
    total: number;
    lineAmountSum: number;
    counts: {
      rows: number;
      rowsForProduct: number;
      deleteActionsForProduct: number;
      dialogs: number;
      cancelActions: number;
    };
  };
}

interface DeletionConfirmCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  products: {
    selectedForDeletion: CartProductFixture & {
      lineAmount: number;
    };
    remaining: CartProductFixture & {
      lineAmount: number;
    };
  };
  actions: {
    delete: string;
    confirm: DialogActionSemantics;
  };
  badge: {
    numericTextPattern: string;
    remainingCartCount: number;
  };
  actionCounts: {
    addPerProduct: number;
    delete: number;
    confirm: number;
  };
  expected: {
    columns: CartColumnLabels;
    totalLabel: string;
    currency: CartCurrencyRules;
    initialTotal: number;
    finalTotal: number;
    initialLineAmountSum: number;
    finalLineAmountSum: number;
    deltas: {
      rowCount: number;
      cartTotal: number;
    };
    counts: {
      initialRows: number;
      finalRows: number;
      initialRowsForSelectedProduct: number;
      finalRowsForSelectedProduct: number;
      rowsForRemainingProduct: number;
      deleteActionsForSelectedProduct: number;
      dialogs: number;
      confirmActions: number;
      cartBadges: number;
    };
  };
}

export interface Fr07CartData {
  populated_cart_two_products: PopulatedCartTwoProductsCase;
  cart_invalid_authentication: CartInvalidAuthenticationCase;
  same_product_ui_addition: SameProductUiAdditionCase;
  quantity_increment: QuantityIncrementCase;
  quantity_decrement_above_minimum: QuantityDecrementAboveMinimumCase;
  deletable_item: DeletableItemCase;
  deletion_cancel: DeletionCancelCase;
  deletion_confirm: DeletionConfirmCase;
}

export function loadJsonFile<T>(workspaceRelativePath: string): T {
  const absolutePath = resolve(process.cwd(), workspaceRelativePath);

  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8')) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to load JSON test data at ${absolutePath}: ${reason}`);
  }
}

export function generateCollisionSafeEmail(template: string): string {
  if (template === '') {
    return '';
  }

  if (!template.includes('{{unique}}')) {
    throw new Error('Email template must contain the {{unique}} token.');
  }

  const uniqueToken = [
    Date.now().toString(36),
    process.pid.toString(36),
    randomUUID().replaceAll('-', ''),
  ].join('-');

  return template.replaceAll('{{unique}}', uniqueToken);
}
