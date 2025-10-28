import type { SUPPROT_FIELD_TYPE } from "./field-config";

export interface ComponentMapping {
  component: React.ComponentType<any>;
  defaultValue?: any;
  formatter?: (value: any) => string;
}

export interface FormFactoryConfig {
  viewComponents: Record<SUPPROT_FIELD_TYPE, ComponentMapping>;
  formComponents: Record<SUPPROT_FIELD_TYPE, ComponentMapping>;
  viewLayoutComponents?: string[];
}
