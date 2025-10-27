import { useSettingsStore } from "@/stores/useSettingsStore";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ThemeDemoScreen() {
  const { themeName, colorScheme, setThemeName, setColorScheme } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-card px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-card-foreground">主题演示</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            切换主题查看颜色变化
          </Text>
        </View>

        <View className="px-4 py-4">
          {/* Theme Selector */}
          <View className="bg-card p-4 rounded-xl border border-border mb-4">
            <Text className="text-lg font-bold text-card-foreground mb-3">
              选择主题
            </Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border-2 ${
                  themeName === "default"
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
                onPress={() => setThemeName("default")}
              >
                <Text
                  className={`text-center font-semibold ${
                    themeName === "default" ? "text-primary-foreground" : "text-card-foreground"
                  }`}
                >
                  💙 蓝色
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border-2 ${
                  themeName === "purple"
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
                onPress={() => setThemeName("purple")}
              >
                <Text
                  className={`text-center font-semibold ${
                    themeName === "purple" ? "text-primary-foreground" : "text-card-foreground"
                  }`}
                >
                  💜 紫色
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-bold text-card-foreground mb-3">
              深浅模式
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border-2 ${
                  colorScheme === "light"
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
                onPress={() => setColorScheme("light")}
              >
                <Text
                  className={`text-center font-semibold ${
                    colorScheme === "light" ? "text-primary-foreground" : "text-card-foreground"
                  }`}
                >
                  ☀️ 浅色
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border-2 ${
                  colorScheme === "dark"
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
                onPress={() => setColorScheme("dark")}
              >
                <Text
                  className={`text-center font-semibold ${
                    colorScheme === "dark" ? "text-primary-foreground" : "text-card-foreground"
                  }`}
                >
                  🌙 深色
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Palette Preview */}
          <View className="bg-card p-4 rounded-xl border border-border mb-4">
            <Text className="text-lg font-bold text-card-foreground mb-3">
              颜色系统预览
            </Text>

            {/* Primary */}
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground mb-1">Primary</Text>
              <View className="bg-primary p-4 rounded-lg">
                <Text className="text-primary-foreground font-semibold">
                  主色按钮文字
                </Text>
              </View>
            </View>

            {/* Secondary */}
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground mb-1">Secondary</Text>
              <View className="bg-secondary p-4 rounded-lg">
                <Text className="text-secondary-foreground font-semibold">
                  次要按钮文字
                </Text>
              </View>
            </View>

            {/* Muted */}
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground mb-1">Muted</Text>
              <View className="bg-muted p-4 rounded-lg border border-border">
                <Text className="text-muted-foreground font-semibold">
                  弱化的内容区域
                </Text>
              </View>
            </View>

            {/* Card */}
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground mb-1">Card</Text>
              <View className="bg-card p-4 rounded-lg border-2 border-border">
                <Text className="text-card-foreground font-semibold">
                  卡片内容文字
                </Text>
              </View>
            </View>
          </View>

          {/* Interactive Elements */}
          <View className="bg-card p-4 rounded-xl border border-border mb-4">
            <Text className="text-lg font-bold text-card-foreground mb-3">
              交互元素
            </Text>

            <TouchableOpacity className="bg-primary py-3 rounded-lg mb-2 active:opacity-80">
              <Text className="text-primary-foreground text-center font-semibold">
                主要按钮
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-secondary py-3 rounded-lg mb-2 active:opacity-80">
              <Text className="text-secondary-foreground text-center font-semibold">
                次要按钮
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border-2 border-border py-3 rounded-lg active:opacity-80">
              <Text className="text-card-foreground text-center font-semibold">
                轮廓按钮
              </Text>
            </TouchableOpacity>
          </View>

          {/* Typography */}
          <View className="bg-card p-4 rounded-xl border border-border">
            <Text className="text-lg font-bold text-card-foreground mb-3">
              文字层级
            </Text>
            <Text className="text-2xl font-bold text-foreground mb-2">
              标题文字 (foreground)
            </Text>
            <Text className="text-base text-card-foreground mb-2">
              正文文字 (card-foreground)
            </Text>
            <Text className="text-sm text-muted-foreground">
              辅助文字 (muted-foreground)
            </Text>
          </View>

          <Text className="text-xs text-muted-foreground mt-4 text-center">
            💡 所有颜色会随主题和深浅模式自动切换
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
