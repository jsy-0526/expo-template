import type { FormikValues } from "formik";
import { useFormik } from "formik";
import { flatten, isEmpty, isNil, pick } from "lodash";
import * as yup from "yup";
import { useFormContext } from "./context";
import type {
  FieldConfig,
  FormValues,
  UseFormParams,
  UseFormViewParams
} from "./types";

export function useForm<T extends FormikValues = FormValues>({
  fields,
  i18n = (key: string) => key,
  defaultValues = {},
  onSubmit = () => {},
  additionalNames = [],
}: UseFormParams<T>) {
  const { factory, formComponents } = useFormContext<T>();

  const flatFields = flatten(fields) as FieldConfig<T>[];

  const initialValues = {
    ...flatFields.reduce((acc, field) => {
      const fieldType = field.type;
      const defaultValue =
        formComponents[fieldType]?.defaultValue !== undefined
          ? formComponents[fieldType]?.defaultValue
          : null;
      return { ...acc, [field.name]: defaultValue };
    }, {} as Partial<T>),
    ...pick(defaultValues, [
      ...flatFields.map((f) => f.name as string),
      ...additionalNames,
    ]),
  } as T;

  // build yup schema
  const schema = yup.object(
    flatFields.reduce((acc, field) => {
      // if yup config exists
      // track it
      if (field.yup) {
        return {
          ...acc,
          [field.name]: field.yup,
        };
      }
      return acc;
    }, {})
  );

  // build Formik instance
  const formik = useFormik<T>({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      // filter hidden fields
      const visibleFields = flatFields.filter((field) => {
        if (field.hide) {
          return !field.hide(formik);
        }
        return true;
      });

      const visibleNames = visibleFields.map((f) => f.name as string);
      const filteredValues = pick(values, [
        ...visibleNames,
        ...additionalNames,
      ]);

      await onSubmit(filteredValues as T);
    },
  });

  return {
    formik,
    handleSubmit: formik.handleSubmit,
    formGenerator: () =>
      factory.buildForm({
        fields,
        formik,
        i18n,
      }),
    submitDisabled: !formik.isValid || isEmpty(formik.touched),
  };
}

// readonly mode form hook
export function useFormView<T = FormValues>({
  fields,
  data,
  i18n = (key: string) => key,
  keepFormat = false,
}: UseFormViewParams<T>) {
  const { factory } = useFormContext<T>();

  if (isNil(fields) || isNil(data)) {
    return {
      viewGenerator: () => [],
    };
  }

  return {
    viewGenerator: () => factory.buildView({ fields, data, i18n, keepFormat }),
  };
}
