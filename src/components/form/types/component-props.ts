import type { FormValues, I18nFunction } from "./field-types";
import type { FormikInstance } from "./field-config";

export interface FormComponentProps<T = FormValues> {
  formik: FormikInstance<T>;
  name: keyof T & string;
  label: string | ((values: T) => string);
  required?: boolean | ((values: T) => boolean);
  disabled?: boolean | ((values: T) => boolean);
  helper?: string;
  placeholder?: string;
  hide?: (formik: FormikInstance<T>) => boolean;
  i18n?: I18nFunction;
  index?: number;
}

export interface ViewComponentProps<T = FormValues> {
  data: T;
  name: keyof T & string;
  label: string | ((values: T) => string);
  formatter?: (value: any) => string;
  i18n?: I18nFunction;
  index?: number;
}
