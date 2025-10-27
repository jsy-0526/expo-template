import { useTranslation } from "@/hooks/common";
import { Text, TouchableOpacity, View } from "react-native";

export default function I18nScreen() {
  const { t, i18n, changeLanguage } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-6 p-6">
      <Text className="text-2xl font-bold">{t("hello")}</Text>

      <View className="gap-4">
        <TouchableOpacity
          onPress={() => changeLanguage("zh-CN")}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg font-semibold">中文</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeLanguage("en-US")}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg font-semibold">English</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-600 mt-4">Current: {i18n.language}</Text>
    </View>
  );
}
