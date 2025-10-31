import { FormProvider, useForm, useFormView } from "@/components/form";
import { useTranslation } from "@/hooks/common";
import {
  exampleFormFields,
  type FormModel,
} from "@/schemas/exampleForm";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 表单内容组件（在 Provider 内部）
const FormContent = () => {
  const [submittedData, setSubmittedData] = useState<FormModel | null>(
    null
  );

  const { t, getCurrentLanguage, changeLanguage } = useTranslation();

  // 表单配置 - 使用 useMemo 确保语言切换时重新生成
  const formFields = exampleFormFields(t);

  // 使用表单 Hook
  const { formik, formGenerator, handleSubmit, submitDisabled } =
    useForm<FormModel>({
      fields: formFields,
      i18n: t,
      onSubmit: async (values) => {
        console.log("Form submitted:", values);
        setSubmittedData(values);
        Alert.alert("Success", "Form submitted successfully!");
      },
    });

  // 使用视图 Hook（展示已提交的数据）
  const { viewGenerator } = useFormView<FormModel>({
    fields: formFields,
    data: submittedData || ({} as FormModel),
    i18n: t,
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* 标题 */}
        <View className="bg-white px-4 py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Form Demo</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Dynamic Form System Example
          </Text>
        </View>

        {/* 表单区域 */}
        <View className="px-4 py-4 bg-white mt-4 mx-4 rounded-lg">
          <Text className="text-lg font-semibold mb-4">Example Form</Text>

          {formGenerator().map((field, index) => (
            <View key={index}>{field}</View>
          ))}

          {/* 切换语言 */}
          <TouchableOpacity
            onPress={() =>
              changeLanguage(
                getCurrentLanguage() === "en-US" ? "zh-CN" : "en-US"
              )
            }
            className={`
              py-3 px-6 rounded-lg mt-4
            `}
          >
            <Text
              className={`
                text-center font-semibold
              `}
            >
              switch language
            </Text>
          </TouchableOpacity>

          {/* 提交按钮 */}
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
            disabled={submitDisabled}
            className={`
              py-3 px-6 rounded-lg mt-4
              ${submitDisabled ? "bg-gray-300" : "bg-blue-500"}
            `}
          >
            <Text
              className={`
                text-center font-semibold
                ${submitDisabled ? "text-gray-500" : "text-white"}
              `}
            >
              Submit
            </Text>
          </TouchableOpacity>

          {/* 重置按钮 */}
          <TouchableOpacity
            onPress={() => formik.resetForm()}
            className="py-3 px-6 rounded-lg mt-2 border border-gray-300"
          >
            <Text className="text-center font-semibold text-gray-700">
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {/* 已提交数据展示 */}
        {submittedData && (
          <View className="px-4 py-4 bg-white mt-4 mx-4 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Submitted Data (Read-only View)
            </Text>
            {viewGenerator().map((view, index) => (
              <View key={index}>{view}</View>
            ))}
          </View>
        )}

        {/* Debug 信息 */}
        <View className="px-4 py-4 bg-gray-100 mt-4 mx-4 rounded-lg mb-8">
          <Text className="text-sm font-semibold mb-2">Debug Info:</Text>
          <Text className="text-xs text-gray-600">
            Valid: {formik.isValid ? "Yes" : "No"}
          </Text>
          <Text className="text-xs text-gray-600">
            Touched: {Object.keys(formik.touched).length} fields
          </Text>
          <Text className="text-xs text-gray-600">
            Errors: {Object.keys(formik.errors).length} fields
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 主组件（包裹 Provider）
export default () => {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
};
