import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { FormikInstance, FormValues, I18nFunction } from "../../types";

interface FormWrapperProps<T = FormValues> {
  formik: FormikInstance<T>;
  name: keyof T & string;
  label: string | ((values: T) => string);
  required?: boolean | ((values: T) => boolean);
  helper?: string;
  children: ReactNode;
  i18n?: I18nFunction;
}

export const FormWrapper = <T = FormValues>({
  formik,
  name,
  label,
  required = false,
  helper,
  children,
}: FormWrapperProps<T>) => {
  // normallize label and required
  const resolvedLabel =
    typeof label === "function" ? label(formik.values) : label;
  const resolvedRequired =
    typeof required === "function" ? required(formik.values) : required;

  // get current filed error state
  const error = formik.errors[name];
  const touched = formik.touched[name];
  const showError = touched && error;

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        {resolvedRequired && (
          <Text className="text-red-500 text-base mr-1">*</Text>
        )}
        <Text className="text-gray-700 text-base font-medium">
          {resolvedLabel}
        </Text>
      </View>

      {children}

      {helper && !showError && (
        <Text className="text-gray-500 text-sm mt-1">{helper}</Text>
      )}

      {showError && (
        <View className="flex-row items-center mt-1">
          <Text className="text-red-500 text-sm flex-1">{error as string}</Text>
        </View>
      )}
    </View>
  );
};
