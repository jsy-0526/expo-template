import { useSettingsStore } from "@/stores/useSettingsStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StoreScreen() {
  // Zustand 内存存储示例
  const { currentUser, isAuthenticated, setUser, logout } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Zustand 持久化存储示例
  const { themeName, colorScheme, language, notifications, setThemeName, setColorScheme, setLanguage, toggleNotifications, loadSettings } = useSettingsStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载持久化设置
  useEffect(() => {
    loadSettings().then(() => setIsLoaded(true));
  }, []);

  const handleLogin = () => {
    if (name && email) {
      setUser({
        id: Date.now().toString(),
        name,
        email,
      });
      setName("");
      setEmail("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* 标题栏 */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">存储示例</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Zustand 内存存储 & 持久化存储演示
          </Text>
        </View>

        <View className="px-4 py-4">
          {/* 内存存储示例 */}
          <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              📦 内存存储 (useUserStore)
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              仅在应用运行时存在，重启后丢失
            </Text>

            {!isAuthenticated ? (
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  模拟登录
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                  placeholder="姓名"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  placeholder="邮箱"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-lg active:opacity-80"
                  onPress={handleLogin}
                >
                  <Text className="text-white text-center font-semibold">
                    登录
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View className="bg-blue-50 p-3 rounded-lg mb-3">
                  <Text className="text-sm text-gray-600 mb-1">当前用户:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {currentUser?.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {currentUser?.email}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-2">
                    ID: {currentUser?.id}
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-red-500 py-3 rounded-lg active:opacity-80"
                  onPress={logout}
                >
                  <Text className="text-white text-center font-semibold">
                    退出登录
                  </Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-500 mt-2 text-center">
                  💡 退出后数据会立即清除
                </Text>
              </View>
            )}
          </View>

          {/* 持久化存储示例 */}
          <View className="bg-white p-4 rounded-xl border border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              💾 持久化存储 (useSettingsStore)
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              使用 SecureStore 保存，重启应用后依然存在
            </Text>

            {!isLoaded ? (
              <Text className="text-gray-400 text-center py-4">加载中...</Text>
            ) : (
              <View>
                {/* 主题名称设置 */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    主题风格
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        themeName === "default"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setThemeName("default")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          themeName === "default" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        💙 蓝色
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        themeName === "purple"
                          ? "bg-purple-500 border-purple-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setThemeName("purple")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          themeName === "purple" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        💜 紫色
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 深浅模式设置 */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    深浅模式
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        colorScheme === "light"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setColorScheme("light")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          colorScheme === "light" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        ☀️ 浅色
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        colorScheme === "dark"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setColorScheme("dark")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          colorScheme === "dark" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        🌙 深色
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 语言设置 */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    语言设置
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        language === "zh"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setLanguage("zh")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          language === "zh" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        🇨🇳 中文
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-3 rounded-lg border-2 ${
                        language === "en"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => setLanguage("en")}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          language === "en" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        🇺🇸 English
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 通知开关 */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    推送通知
                  </Text>
                  <TouchableOpacity
                    className={`py-3 rounded-lg ${
                      notifications ? "bg-green-500" : "bg-gray-300"
                    }`}
                    onPress={toggleNotifications}
                  >
                    <Text className="text-white text-center font-semibold">
                      {notifications ? "🔔 已开启" : "🔕 已关闭"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 当前状态显示 */}
                <View className="bg-gray-50 p-3 rounded-lg">
                  <Text className="text-xs font-semibold text-gray-600 mb-2">
                    当前持久化状态:
                  </Text>
                  <Text className="text-xs text-gray-700 font-mono">
                    {JSON.stringify({ themeName, colorScheme, language, notifications }, null, 2)}
                  </Text>
                </View>

                <Text className="text-xs text-gray-500 mt-3 text-center">
                  💡 关闭应用重新打开，设置会自动恢复
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
