import { View, Text, TouchableOpacity } from "react-native";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <View className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
        <Text className="text-2xl font-bold text-red-600 mb-4 text-center">
          出错了
        </Text>
        <Text className="text-gray-700 mb-2 font-semibold">
          错误信息：
        </Text>
        <View className="bg-red-50 rounded-lg p-4 mb-6">
          <Text className="text-red-800 text-sm">
            {error.message}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-blue-600 rounded-xl p-4 active:bg-blue-700"
          onPress={resetError}
        >
          <Text className="text-white font-bold text-center">
            重新尝试
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
