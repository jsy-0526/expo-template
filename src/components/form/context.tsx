import { createContext, useContext, type ReactNode } from "react";
import { FormFactory } from "./factory";
import { SelectField } from "./fields/editable/SelectField";
import { SwitchField } from "./fields/editable/SwitchField";
import { TextField } from "./fields/editable/TextField";
import { TextView } from "./fields/readonly/TextView";

import type { ComponentMapping, FormValues } from "./types";

// form compoent mapping
const defaultFormComponents: Record<string, ComponentMapping> = {
  text: {
    component: TextField,
    defaultValue: "",
  },
  select: {
    component: SelectField,
    defaultValue: "",
  },
  switch: {
    component: SwitchField,
    defaultValue: false,
  },
};

// readonly component mapping
const defaultViewComponents: Record<string, ComponentMapping> = {
  text: {
    component: TextView,
  },
  select: {
    component: TextView,
  },
  switch: {
    component: TextView,
    formatter: (value) => (value ? "Yes" : "No"),
  },
};

interface FormContextValue<T = FormValues> {
  factory: FormFactory<T>;
  formComponents: Record<string, ComponentMapping>;
  viewComponents: Record<string, ComponentMapping>;
  viewLayoutComponents: string[];
}

const FormContext = createContext<FormContextValue | null>(null);

// form provider props
interface FormProviderProps {
  children: ReactNode;
  formComponents?: Record<string, ComponentMapping>;
  viewComponents?: Record<string, ComponentMapping>;
  viewLayoutComponents?: string[];
}

// form provider
export function FormProvider({
  children,
  formComponents = defaultFormComponents,
  viewComponents = defaultViewComponents,
  viewLayoutComponents = ["divider", "title"],
}: FormProviderProps) {
  const factory = new FormFactory(
    viewComponents,
    formComponents,
    viewLayoutComponents
  );

  const value: FormContextValue = {
    factory,
    formComponents,
    viewComponents,
    viewLayoutComponents,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext<T = FormValues>(): FormContextValue<T> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context as FormContextValue<T>;
}
