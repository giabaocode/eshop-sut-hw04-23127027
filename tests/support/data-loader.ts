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

export interface RegistrationInputTemplate {
  fullName: string;
  emailTemplate: string;
  password: string;
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

export interface Fr01RegistrationData {
  valid_registration_ui: ValidRegistrationCase;
  required_field_omissions: RequiredFieldOmissionsCase;
  email_format_partitions: EmailFormatPartitionsCase;
  registration_form_semantics: RegistrationFormSemanticsCase;
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
