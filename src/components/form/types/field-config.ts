import type { FormikProps } from "formik";
import type { Schema as YupSchema } from "yup";
import type { FormValues, Option } from "./field-types";

export type SUPPROT_FIELD_TYPE = "text" | "select" | "switch";

export type FormikInstance<T = FormValues> = FormikProps<T>;

export interface SchemaNode<T = FormValues> {
  type: SUPPROT_FIELD_TYPE;
  name: keyof T & string;
  label: string | ((values: T) => string);
  required?: boolean | ((values: T) => boolean);
  disabled?: boolean | ((values: T) => boolean);
  helper?: string;
  placeholder?: string;
  hide?: (formik: FormikInstance<T>) => boolean;
  yup?: YupSchema<any>;
}

export interface TextFieldConfig<T = FormValues>
  extends Omit<SchemaNode<T>, "type"> {
  type: "text";
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface SelectFieldConfig<T = FormValues>
  extends Omit<SchemaNode<T>, "type"> {
  type: "select";
  options: Option[] | ((values: T) => Option[]);
}

export interface SwitchFieldConfig<T = FormValues>
  extends Omit<SchemaNode<T>, "type"> {
  type: "switch";
}

export type FieldConfig<T = FormValues> =
  | TextFieldConfig<T>
  | SelectFieldConfig<T>
  | SwitchFieldConfig<T>;

export type FieldOrFields<T = FormValues> = FieldConfig<T> | FieldConfig<T>[];
