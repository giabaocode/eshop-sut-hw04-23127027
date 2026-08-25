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

interface CartNavigationCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels & {
    requiredContinueShoppingLabel: string;
    shoppingDestinationMeaningTerms: string[];
  };
  product: CartProductFixture;
  actionCounts: {
    add: number;
    homeDestination: number;
  };
  expected: {
    breadcrumb: {
      currentPageLabel: string;
    };
    navbar: {
      currentStateAttribute: string;
      currentStateValue: string;
    };
    destinationIdentity: {
      heading: string;
    };
    counts: {
      rows: number;
      breadcrumbs: number;
      cartNavbarLinks: number;
      requiredContinueShoppingLinks: number;
      homeDestinationLinks: number;
    };
  };
}

interface CartTotalFormattingCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: CartNavigationLabels;
  product: CartProductFixture;
  actionCounts: {
    add: number;
  };
  expected: {
    columns: CartColumnLabels;
    totalLabel: string;
    forbiddenTotalLabel: string;
    total: number;
    currency: CartCurrencyRules;
    counts: {
      rows: number;
      rowsForProduct: number;
      summaryAmounts: number;
      summaryContainers: number;
    };
  };
}

interface EmptyCartCase extends Fr07CaseBase {
  paths: CartPaths;
  navigation: {
    cartLink: string;
  };
  initialState: {
    naturalFreshContext: boolean;
    cartProductRows: number;
  };
  expected: {
    messageMeaningTerms: string[];
    counts: {
      messages: number;
      illustrations: number;
      rows: number;
    };
  };
}

interface ProductDetailAddToCartCase extends Fr07CaseBase {
  paths: {
    home: string;
    productDetail: string;
  };
  navigation: {
    cartLink: string;
    productDetailLink: string;
    productDetailAddToCartButton: string;
  };
  targetProduct: {
    id: number;
    name: string;
    quantity: number;
  };
  initialState: {
    naturalFreshContext: boolean;
    targetProductAbsent: boolean;
    cartBadgeCount: number;
  };
  badge: {
    numericTextPattern: string;
    expectedDelta: number;
  };
  feedback: {
    semanticRoles: ['alert', 'status'];
    allowControlStateOrTextTransition: boolean;
  };
  actionCounts: {
    add: number;
  };
  expected: {
    imageAlt: {
      requireNonEmpty: boolean;
      requireProductIdentity: boolean;
    };
    counts: {
      productDetailLinks: number;
      productImages: number;
      quantityControls: number;
      cartBadges: number;
      minimumFeedbackSignals: number;
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
  cart_navigation: CartNavigationCase;
  cart_total_formatting: CartTotalFormattingCase;
  empty_cart: EmptyCartCase;
  product_detail_add_to_cart: ProductDetailAddToCartCase;
}

export type Fr12HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Fr12JsonValue =
  | null
  | boolean
  | number
  | string
  | Fr12JsonValue[]
  | { [key: string]: Fr12JsonValue };

export interface AdminAccessLabels {
  loginHeading: string;
  emailControl: string;
  passwordControl: string;
  submitButton: string;
  protectedAdminIdentity: string;
  dashboardIdentity: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface Fr12AccessPartition {
  authentication: 'missing_token' | 'valid_credentials';
  authorization:
    | 'not_evaluated'
    | 'ordinary_user_denied'
    | 'admin_allowed';
}

export interface AdminMutationRequestClassifier {
  methods: Fr12HttpMethod[];
  pathTemplates: string[];
}

interface AdminUiExpectedCounts {
  loginForms: number;
  loginHeadings: number;
  emailControls: number;
  passwordControls: number;
  submitButtons: number;
  protectedAdminIdentities: number;
  dashboardIdentities: number;
  loginSubmitActivations: number;
  loginResponses: number;
  successfulLoginResponses: number;
  dialogs: number;
  adminMutationRequests: number;
}

interface AdminUiCaseBase {
  id: string;
  title: string;
  adminEntryPath: string;
  labels: AdminAccessLabels;
  accessPartition: Fr12AccessPartition;
  requestObservation: {
    login: {
      method: Fr12HttpMethod;
      path: string;
    };
    mutations: AdminMutationRequestClassifier;
  };
  expected: {
    counts: AdminUiExpectedCounts;
  };
}

interface AdminUiNoTokenCase extends AdminUiCaseBase {
  initialState: {
    naturalFreshBrowserContext: boolean;
    browserStorageAccess: 'none';
  };
}

interface AdminLoginPrerequisiteCounts {
  loginForms: number;
  emailControls: number;
  passwordControls: number;
  submitButtons: number;
}

interface AdminUiCredentialCaseBase extends AdminUiCaseBase {
  credentials: AdminCredentials;
  loginPrerequisites: {
    counts: AdminLoginPrerequisiteCounts;
  };
}

interface AdminUiOrdinaryUserCase extends AdminUiCredentialCaseBase {
  dialog: {
    allowedTypes: string[];
    requireNonEmptyMessage: boolean;
    action: 'dismiss';
  };
}

type AdminUiAdminCase = AdminUiCredentialCaseBase;

export type Fr12SnapshotResourceName =
  | 'users'
  | 'orders'
  | 'products'
  | 'coupons';

export interface Fr12AdminRouteRecord {
  key: string;
  method: Fr12HttpMethod;
  path: string;
  pathParameters?: Record<string, string>;
  payload?: Fr12JsonValue;
  mutationMarker?: string;
  authorizationHeader: null;
  protectedResource: Fr12SnapshotResourceName;
}

export interface Fr12SnapshotResource {
  name: Fr12SnapshotResourceName;
  method: 'GET';
  path?: string;
  targetRouteKey?: string;
}

export interface Fr12AdminApiSessionConfig {
  login: {
    method: 'POST';
    path: string;
    credentials: AdminCredentials;
    tokenProperty: string;
  };
  authorizationHeader: string;
  bearerScheme: string;
}

interface Fr12ControlledCleanupBase {
  markerValue: string;
  identifierField: 'id';
  identifierType: 'positive_integer';
  method: 'DELETE';
  expected: {
    responseSuccessful: boolean;
  };
}

interface Fr12ProductCleanup extends Fr12ControlledCleanupBase {
  key: 'imported_product';
  snapshotResource: 'products';
  markerField: 'name';
  pathTemplate: '/api/products/:id';
}

interface Fr12CouponCleanup extends Fr12ControlledCleanupBase {
  key: 'coupon';
  snapshotResource: 'coupons';
  markerField: 'code';
  pathTemplate: '/api/admin/coupons/:id';
}

export type Fr12ControlledCleanup =
  | Fr12ProductCleanup
  | Fr12CouponCleanup;

interface AdminRouteInventoryMissingTokenCase {
  id: string;
  title: string;
  accessPartition: Fr12AccessPartition;
  apiSession: Fr12AdminApiSessionConfig;
  snapshots: [
    Fr12SnapshotResource,
    Fr12SnapshotResource,
    Fr12SnapshotResource,
    Fr12SnapshotResource,
  ];
  routes: [
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
    Fr12AdminRouteRecord,
  ];
  controlledCleanup: [Fr12ProductCleanup, Fr12CouponCleanup];
  expected: {
    targetRouteCount: number;
    snapshotResourceCount: number;
    mutationMarkerCount: number;
    controlledCleanupCount: number;
    snapshotSessionLoginSuccessful: boolean;
    snapshotAcquisitionSuccessful: boolean;
    finalSnapshotAcquisitionSuccessful: boolean;
    probeTransportSuccessful: boolean;
    completedProbeResponses: number;
    successfulProbeResponses: number;
    protectedDataResponses: number;
    responseSuccessful: boolean;
    authorizationHeaderPresent: boolean;
    protectedDataReturned: boolean;
    changedSnapshotCount: number;
    mutationMarkerMatches: number;
    cleanupDiscoverySuccessful: boolean;
    controlledMarkerMatchesAfterCleanup: number;
    finalChangedSnapshotCount: number;
  };
}

export type Fr12TokenPartition =
  | 'missing_token'
  | 'invalid_bearer'
  | 'ordinary_user'
  | 'admin';

export interface Fr12ExplicitAuthorization {
  partition: Fr12TokenPartition;
  header: string | null;
  scheme?: string;
  tokenClass?: 'malformed' | 'expired';
}

export interface Fr12TargetRouteRecord {
  key: string;
  method: Fr12HttpMethod;
  path: string;
  pathParameters?: Record<string, string>;
  payload?: Fr12JsonValue;
  mutationMarker?: string;
  authorization: Fr12ExplicitAuthorization;
  protectedResource: Fr12SnapshotResourceName;
}

export interface Fr12RoleAwareApiSessionConfig
  extends Fr12AdminApiSessionConfig {
  userProperty: string;
  roleProperty: string;
  expectedRole: 'user' | 'admin';
}

export interface Fr12ControlledCleanupDefinition {
  key: string;
  snapshotResource: Fr12SnapshotResourceName;
  markerField: string;
  markerValue: string;
  identifierField: 'id';
  identifierType: 'positive_integer';
  method: 'DELETE';
  pathTemplate: string;
  expected: {
    responseSuccessful: boolean;
  };
}

interface AdminRouteInventoryInvalidTokensCase {
  id: string;
  title: string;
  accessPartition: {
    authentication: 'invalid_token';
    authorization: 'not_evaluated';
  };
  snapshotSession: Fr12AdminApiSessionConfig;
  invalidTokens: {
    malformed: {
      value: string;
    };
    expired: {
      algorithm: 'HS256';
      header: Record<string, Fr12JsonValue>;
      claims: Record<string, Fr12JsonValue>;
      signingMaterial: string;
      sourceObservation: string;
    };
  };
  snapshots: Fr12SnapshotResource[];
  probes: Fr12TargetRouteRecord[];
  controlledCleanup: Fr12ControlledCleanupDefinition[];
  expected: {
    tokenClassCount: number;
    probeCount: number;
    routesPerTokenClass: number;
    cleanupMarkerCount: number;
    snapshotSessionLoginSuccessful: boolean;
    snapshotAcquisitionSuccessful: boolean;
    finalSnapshotAcquisitionSuccessful: boolean;
    jwtSegmentCount: number;
    algorithmMatches: boolean;
    expiredClaimNumeric: boolean;
    expiredBeforeCurrentTime: boolean;
    signatureValid: boolean;
    probeTransportSuccessful: boolean;
    completedProbeResponses: number;
    successfulProbeResponses: number;
    protectedDataResponses: number;
    responseSuccessful: boolean;
    protectedDataReturned: boolean;
    changedSnapshotCount: number;
    mutationMarkerMatches: number;
    cleanupDiscoverySuccessful: boolean;
    controlledMarkerMatchesAfterCleanup: number;
    finalChangedSnapshotCount: number;
  };
}

interface AdminRouteInventoryUserTokenCase {
  id: string;
  title: string;
  accessPartition: {
    authentication: 'valid_credentials';
    authorization: 'ordinary_user_denied';
  };
  apiSession: Fr12RoleAwareApiSessionConfig;
  snapshotSession: Fr12AdminApiSessionConfig;
  snapshots: Fr12SnapshotResource[];
  routes: Fr12TargetRouteRecord[];
  controlledCleanup: Fr12ControlledCleanupDefinition[];
  expected: {
    routeCount: number;
    cleanupMarkerCount: number;
    loginSuccessful: boolean;
    tokenPresent: boolean;
    roleEvidenceMatches: boolean;
    snapshotSessionLoginSuccessful: boolean;
    snapshotAcquisitionSuccessful: boolean;
    finalSnapshotAcquisitionSuccessful: boolean;
    probeTransportSuccessful: boolean;
    completedProbeResponses: number;
    successfulProbeResponses: number;
    protectedDataResponses: number;
    responseSuccessful: boolean;
    protectedDataReturned: boolean;
    changedSnapshotCount: number;
    mutationMarkerMatches: number;
    cleanupDiscoverySuccessful: boolean;
    controlledMarkerMatchesAfterCleanup: number;
    finalChangedSnapshotCount: number;
  };
}

export interface Fr12AdminReadRouteRecord extends Fr12TargetRouteRecord {
  method: 'GET';
  payload?: never;
  mutationMarker?: never;
  authorization: Fr12ExplicitAuthorization & {
    partition: 'admin';
  };
  collectionOracle: {
    allowEmpty: boolean;
    identityField?: string;
    expectedIdentities?: string[];
  };
}

interface AdminReadRoutesAdminTokenCase {
  id: string;
  title: string;
  accessPartition: {
    authentication: 'valid_credentials';
    authorization: 'admin_allowed';
  };
  apiSession: Fr12RoleAwareApiSessionConfig;
  routes: Fr12AdminReadRouteRecord[];
  expected: {
    routeCount: number;
    loginSuccessful: boolean;
    tokenPresent: boolean;
    roleEvidenceMatches: boolean;
    probeTransportSuccessful: boolean;
    completedResponses: number;
    successfulResponses: number;
    protectedCollectionResponses: number;
    responseSuccessful: boolean;
    protectedCollectionReturned: boolean;
  };
}

export interface Fr12ProductPayload extends Record<string, Fr12JsonValue> {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category_id: number | string;
}

export interface Fr12ProductMatrixSetup {
  method: 'POST';
  path: string;
  authorization: Fr12ExplicitAuthorization & {
    partition: 'admin';
  };
  payload: Fr12ProductPayload;
  responseIdentifierField: 'id';
  expected: {
    responseSuccessful: boolean;
    strictPositiveIntegerId: boolean;
    productPresent: boolean;
  };
}

export interface Fr12ProductMatrixRow {
  key: string;
  method: 'POST' | 'PUT' | 'DELETE';
  path: string;
  setup?: Fr12ProductMatrixSetup;
  payload?: Fr12ProductPayload;
  authorization: Fr12ExplicitAuthorization;
  controlledMarker: {
    field: 'name';
    value: string;
  };
  cleanupInvariantMarkers: string[];
  expectedProduct?: Fr12ProductPayload;
  expected: {
    accessObservation:
      | 'authentication_denied'
      | 'authorization_denied'
      | 'business_execution';
    responseSuccessful: boolean;
    stateObservation:
      | 'controlled_product_absent'
      | 'controlled_target_unchanged'
      | 'controlled_product_present'
      | 'controlled_target_changed'
      | 'controlled_target_removed';
  };
}

interface ProductMutationAccessMatrixCase {
  id: string;
  title: string;
  apiSessions: {
    ordinaryUser: Fr12RoleAwareApiSessionConfig;
    admin: Fr12RoleAwareApiSessionConfig;
  };
  categoryReference: {
    method: 'GET';
    path: string;
    markerField: string;
    markerValue: string;
    identifierField: 'id';
    identifierType: 'positive_integer';
    payloadReferenceToken: string;
  };
  productSnapshot: {
    resource: 'products';
    method: 'GET';
    path: string;
  };
  rows: Fr12ProductMatrixRow[];
  cleanup: {
    markerField: 'name';
    identifierField: 'id';
    identifierType: 'positive_integer';
    method: 'DELETE';
    pathTemplate: string;
    authorization: Fr12ExplicitAuthorization & {
      partition: 'admin';
    };
  };
  expected: {
    rowCount: number;
    methodCount: number;
    tokenPartitionCount: number;
    loginSuccessful: boolean;
    tokenPresent: boolean;
    roleEvidenceMatches: boolean;
    categoryReadSuccessful: boolean;
    categoryReferenceFound: boolean;
    baselineSnapshotSuccessful: boolean;
    setupSuccessful: boolean;
    targetTransportSuccessful: boolean;
    targetStateSnapshotSuccessful: boolean;
    completedTargetResponses: number;
    preCleanupSnapshotSuccessful: boolean;
    cleanupDiscoverySuccessful: boolean;
    cleanupResponseSuccessful: boolean;
    finalSnapshotSuccessful: boolean;
    finalMatchesBaseline: boolean;
  };
}

export interface Fr12AccessControlData {
  admin_ui_no_token: AdminUiNoTokenCase;
  admin_ui_ordinary_user: AdminUiOrdinaryUserCase;
  admin_ui_admin: AdminUiAdminCase;
  admin_route_inventory_missing_token: AdminRouteInventoryMissingTokenCase;
  admin_route_inventory_invalid_tokens: AdminRouteInventoryInvalidTokensCase;
  admin_route_inventory_user_token: AdminRouteInventoryUserTokenCase;
  admin_read_routes_admin_token: AdminReadRoutesAdminTokenCase;
  product_mutation_access_matrix: ProductMutationAccessMatrixCase;
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
