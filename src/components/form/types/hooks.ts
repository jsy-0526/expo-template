import type { FormValues, I18nFunction } from "./field-types";
import type { FieldOrFields, FormikInstance } from "./field-config";

export interface UseFormParams<T = FormValues> {
  fields: FieldOrFields<T>[];
  i18n?: I18nFunction;
  defaultValues?: Partial<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  additionalNames?: string[];
}

export interface UseFormViewParams<T = FormValues> {
  fields: FieldOrFields<T>[];
  data: T;
  i18n?: I18nFunction;
  keepFormat?: boolean;
}

export interface BuildFormParams<T = FormValues> {
  fields: FieldOrFields<T>[];
  formik: FormikInstance<T>;
  i18n?: I18nFunction;
}

export interface BuildViewParams<T = FormValues> {
  fields: FieldOrFields<T>[];
  data: T;
  i18n?: I18nFunction;
  keepFormat?: boolean;
}
