import { TextInput } from "react-native";
import type {
  FormComponentProps,
  FormValues,
  TextFieldConfig,
} from "../../types";

export const TextField = <T = FormValues>(
  props: FormComponentProps<T> & TextFieldConfig<T>
) => {
  const {
    formik,
    name,
    placeholder,
    keyboardType = "default",
    maxLength,
    multiline = false,
    numberOfLines = 1,
    disabled,
  } = props;

  const value = formik.values[name] || "";
  const isDisabled =
    typeof disabled === "function" ? disabled(formik.values) : disabled;

  return (
    <TextInput
      value={String(value)}
      onChangeText={async (text) => {
        await formik.setFieldValue(name, text);
        await formik.setFieldTouched(name, true);
      }}
      placeholder={placeholder}
      keyboardType={keyboardType}
      maxLength={maxLength}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
      editable={!isDisabled}
      className={`
        border border-gray-300 rounded-lg px-4 py-3
        ${multiline ? "min-h-[100px]" : "h-12"}
        ${isDisabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-900"}
      `}
    />
  );
};
