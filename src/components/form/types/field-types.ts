import type { TFunction } from "i18next";

export type I18nFunction = ((key: string) => string) | TFunction;

export type FormValues = Record<string, any>;

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  meta?: Record<string, any>;
}
