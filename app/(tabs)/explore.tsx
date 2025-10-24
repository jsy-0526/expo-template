import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1">
      <View className="p-6">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Explore
        </Text>
        <Text className="text-base text-gray-600 mb-6">
          Discover Tailwind CSS utilities
        </Text>

        {/* Color Palette */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Color Palette
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="w-16 h-16 bg-red-500 rounded-lg" />
            <View className="w-16 h-16 bg-blue-500 rounded-lg" />
            <View className="w-16 h-16 bg-green-500 rounded-lg" />
            <View className="w-16 h-16 bg-yellow-500 rounded-lg" />
            <View className="w-16 h-16 bg-purple-500 rounded-lg" />
            <View className="w-16 h-16 bg-pink-500 rounded-lg" />
          </View>
        </View>

        {/* Spacing Examples */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Spacing & Borders
          </Text>
          <View className="bg-white rounded-xl p-4 border-2 border-blue-500 mb-2">
            <Text className="text-gray-700">Border: 2px blue</Text>
          </View>
          <View className="bg-white rounded-2xl p-6 shadow-md mb-2">
            <Text className="text-gray-700">Rounded corners + shadow</Text>
          </View>
          <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-4">
            <Text className="text-white font-bold">Gradient background</Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Interactive Elements
          </Text>
          <TouchableOpacity className="bg-blue-600 rounded-xl p-4 mb-2 active:bg-blue-700">
            <Text className="text-white font-bold text-center">
              Primary Button
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-2">
            <Text className="text-gray-700 font-bold text-center">
              Secondary Button
            </Text>
          </TouchableOpacity>
        </View>

        {/* Typography */}
        <View className="bg-white rounded-2xl p-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Typography
          </Text>
          <Text className="text-lg text-gray-700 mb-1">Large text</Text>
          <Text className="text-base text-gray-600 mb-1">Base text</Text>
          <Text className="text-sm text-gray-500 mb-1">Small text</Text>
          <Text className="text-xs text-gray-400">Extra small text</Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
