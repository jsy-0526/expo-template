import { flatten, isNil } from "lodash";
import React from "react";
import { Text, View } from "react-native";
import { FormWrapper } from "./fields/wrapper/FormWrapper";
import type {
  BuildFormParams,
  BuildViewParams,
  ComponentMapping,
  FieldConfig,
  FormikInstance,
  FormValues,
  I18nFunction,
} from "./types";

const UndefinedFormComponent = ({ type }: { type: string }) => (
  <View className="p-4 bg-red-50 rounded">
    <Text className="text-red-600 text-center">
      Undefined form component: {type}
    </Text>
  </View>
);

const UndefinedViewComponent = ({ type }: { type: string }) => (
  <View className="p-2 bg-gray-50 rounded">
    <Text className="text-gray-500 text-center">
      Undefined view component: {type}
    </Text>
  </View>
);

export class FormFactory<T = FormValues> {
  private viewComponents: Record<string, ComponentMapping>;
  private formComponents: Record<string, ComponentMapping>;
  private viewLayoutComponents: string[];

  constructor(
    viewComponents: Record<string, ComponentMapping>,
    formComponents: Record<string, ComponentMapping>,
    viewLayoutComponents: string[] = ["divider", "title"]
  ) {
    this.viewComponents = {
      ...viewComponents,
      undefined: {
        component: UndefinedViewComponent,
        defaultValue: "",
      },
    };
    this.formComponents = {
      ...formComponents,
      undefined: {
        component: UndefinedFormComponent,
        defaultValue: "",
      },
    };
    this.viewLayoutComponents = viewLayoutComponents;
  }

  private oneLine(
    components: FieldConfig<T>[],
    formikOrData: FormikInstance<T> | T,
    i18n: I18nFunction | undefined,
    isForm: boolean
  ): React.ReactElement {
    return (
      <View className="flex-row space-x-2">
        {components.map((item, index) => (
          <View key={index} className="flex-1">
            {isForm
              ? this.formikFormMapper({
                  field: item,
                  formik: formikOrData as FormikInstance<T>,
                  i18n,
                  index,
                })
              : this.formikViewMapper({
                  field: item,
                  data: formikOrData as T,
                  i18n,
                  index,
                })}
          </View>
        ))}
      </View>
    );
  }

  private formikFormMapper({
    field,
    formik,
    i18n,
    index,
  }: {
    field: FieldConfig<T>;
    formik: FormikInstance<T>;
    i18n?: I18nFunction;
    index?: number;
  }): React.ReactElement | null {
    if (field?.hide && field.hide(formik)) {
      return null;
    }

    const { component: Component, ...otherProps } =
      this.formComponents[field.type] || this.formComponents["undefined"];

    return (
      <FormWrapper
        formik={formik}
        name={field.name}
        label={field.label}
        required={field.required}
        helper={field.helper}
        i18n={i18n}
      >
        <Component
          i18n={i18n}
          index={index}
          {...otherProps}
          {...field}
          formik={formik}
        />
      </FormWrapper>
    );
  }

  private formikViewMapper({
    field,
    data,
    i18n,
    index,
  }: {
    field: FieldConfig<T>;
    data: T;
    i18n?: I18nFunction;
    index?: number;
  }): React.ReactElement {
    const {
      component: Component,
      formatter,
      ...otherProps
    } = this.viewComponents[field.type] || this.viewComponents["undefined"];

    return (
      <Component
        data={data}
        i18n={i18n}
        index={index}
        formatter={formatter}
        {...otherProps}
        {...field}
      />
    );
  }

  // editable mode form factory
  buildForm({
    fields,
    formik,
    i18n,
  }: BuildFormParams<T>): (React.ReactElement | null)[] {
    return fields.map((field, index) => {
      if (Array.isArray(field)) {
        return this.oneLine(field, formik, i18n, true);
      }
      return this.formikFormMapper({ field, formik, i18n, index });
    });
  }

  // read only mode form factory
  buildView({
    fields,
    data,
    i18n,
    keepFormat = false,
  }: BuildViewParams<T>): React.ReactElement[] {
    const filterFields = keepFormat
      ? fields
      : flatten(fields).filter(
          (field: FieldConfig<T>) =>
            !this.viewLayoutComponents.includes(field.type)
        );

    const fieldsWithData = keepFormat
      ? filterFields
      : (filterFields as FieldConfig<T>[]).filter((field: FieldConfig<T>) => {
          const value = data[field.name];
          return !isNil(value) && value !== "";
        });

    return fieldsWithData.map((field, index) => {
      if (Array.isArray(field)) {
        return this.oneLine(field, data, i18n, false);
      }
      return this.formikViewMapper({ field, data, i18n, index });
    });
  }
}
