import { Switch, View } from "react-native";
import type {
  FormComponentProps,
  FormValues,
  SwitchFieldConfig,
} from "../../types";

export const SwitchField = <T = FormValues>(
  props: FormComponentProps<T> & SwitchFieldConfig<T>
) => {
  const { formik, name, disabled } = props;

  const value = Boolean(formik.values[name]);
  const isDisabled =
    typeof disabled === "function" ? disabled(formik.values) : disabled;

  return (
    <View className="flex-row items-center justify-between py-2">
      <Switch
        value={value}
        onValueChange={async (newValue) => {
          await formik.setFieldValue(name, newValue);
          await formik.setFieldTouched(name, true);
        }}
        disabled={isDisabled}
        trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
        thumbColor={value ? "#FFFFFF" : "#F3F4F6"}
      />
    </View>
  );
};
