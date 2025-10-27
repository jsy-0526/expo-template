import { useUsers } from "@/hooks/api/useApi";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";

export default function HomeScreen() {
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data,
    error: usersError,
    isLoading,
    mutate,
  } = useUsers({ page, limit: 10 });

  // 当数据加载完成时，合并到 allUsers
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllUsers(data.data);
      } else {
        setAllUsers((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.pagination?.hasMore ?? false);
    }
  }, [data, page]);

  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setAllUsers([]);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  // 触底加载更多
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMore = useCallback(() => {
    if (!isLoading && !loadingMore && hasMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [isLoading, loadingMore, hasMore]);

  // 监听加载完成
  useEffect(() => {
    if (!isLoading) {
      setLoadingMore(false);
    }
  }, [isLoading]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isCloseToBottom) {
        loadMore();
      }
    },
    [loadMore]
  );

  const pagination = data?.pagination;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 标题栏 */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          className="bg-white px-4 py-4 border-b border-gray-200"
        >
          <Text className="text-2xl font-bold text-gray-900">用户列表</Text>
          {pagination && (
            <Text className="text-sm text-gray-500 mt-1">
              共 {pagination.total} 人 · 第 {pagination.page} 页
            </Text>
          )}
        </Animated.View>

        <View className="px-4 py-2">
          {isLoading && page === 1 && (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-400 text-base mt-2">加载中...</Text>
            </View>
          )}

          {usersError && (
            <View className="items-center justify-center py-12 bg-red-50 rounded-lg">
              <Text className="text-red-600">
                加载失败: {usersError.message}
              </Text>
            </View>
          )}

          {allUsers.map((user: any, index: number) => (
            <Animated.View
              key={user.id}
              entering={FadeInDown.duration(500).delay(index * 100)}
              layout={Layout.duration(300)}
              className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm active:opacity-80"
            >
              <View className="flex-row items-center">
                {/* 头像 */}
                <Image
                  source={{ uri: user.avatar }}
                  className="w-16 h-16 rounded-full mr-4"
                />

                {/* 用户信息 */}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {user.name}
                  </Text>
                  {user.bio && (
                    <Text className="text-sm text-gray-500 mb-2">
                      {user.bio}
                    </Text>
                  )}
                  {user.email && (
                    <Text className="text-xs text-blue-600">{user.email}</Text>
                  )}
                </View>
              </View>
            </Animated.View>
          ))}

          {/* 加载更多指示器 */}
          {loadingMore && hasMore && (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="text-gray-400 text-sm mt-2">加载更多...</Text>
            </View>
          )}

          {/* 没有更多数据 */}
          {!hasMore && allUsers.length > 0 && (
            <View className="items-center justify-center py-4">
              <Text className="text-gray-400 text-sm">没有更多数据了</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
