import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Modal, useModal } from '@/components/modal';
import { Sheet, SheetForm, useSheet } from '@/components/sheet';
import { useBottomSheet, useToast, useTranslation } from '@/hooks/common';

export default function ExploreScreen() {
  const { ref: bottomSheetRef, open, close } = useBottomSheet();
  const toast = useToast();
  const { t } = useTranslation();
  const modal = useModal();

  // Sheet states
  const pageSheet = useSheet();
  const formSheet = useSheet();

  // Modal states for fullScreen demo
  const [fullScreenVisible, setFullScreenVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1">
      <View className="p-6">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          组件库
        </Text>

        {/* Bottom Sheet Demo */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Bottom Sheet 示例
          </Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-4 active:bg-blue-700"
            onPress={open}
          >
            <Text className="text-white font-bold text-center">
              打开 Bottom Sheet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toast Demo */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Toast 消息示例
          </Text>
          <TouchableOpacity
            className="bg-green-600 rounded-xl p-4 mb-2 active:bg-green-700"
            onPress={() => toast.success(t('toast.success.message'))}
          >
            <Text className="text-white font-bold text-center">
              显示成功消息
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-600 rounded-xl p-4 mb-2 active:bg-red-700"
            onPress={() => toast.error(t('toast.error.message'))}
          >
            <Text className="text-white font-bold text-center">
              显示错误消息
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-cyan-600 rounded-xl p-4 active:bg-cyan-700"
            onPress={() => toast.info(t('toast.info.message'))}
          >
            <Text className="text-white font-bold text-center">
              显示信息提示
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal & Sheet Presentation Styles Demo */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Modal & Sheet Presentation Styles
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-4 mb-2 active:bg-blue-700"
            onPress={() => setFullScreenVisible(true)}
          >
            <Text className="text-white font-bold text-center">
              Modal fullScreen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-600 rounded-xl p-4 mb-2 active:bg-purple-700"
            onPress={pageSheet.open}
          >
            <Text className="text-white font-bold text-center">
              Sheet pageSheet (iOS 卡片)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-indigo-600 rounded-xl p-4 mb-2 active:bg-indigo-700"
            onPress={formSheet.open}
          >
            <Text className="text-white font-bold text-center">
              SheetForm with Keyboard Avoiding
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-pink-600 rounded-xl p-4 mb-2 active:bg-pink-700"
            onPress={() => {
              modal.info({
                title: '信息提示',
                content: '这是使用 modal.info() 方法调用的对话框'
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.info()
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Demo */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Modal 弹窗示例
          </Text>

          {/* Modal methods */}
          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-4 mb-2 active:bg-blue-700"
            onPress={() => {
              modal.info({
                title: '信息提示',
                content: '这是一个信息提示对话框'
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.info()
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600 rounded-xl p-4 mb-2 active:bg-green-700"
            onPress={() => {
              modal.success({
                title: '操作成功',
                content: '数据已成功保存到服务器',
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.success()
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-yellow-600 rounded-xl p-4 mb-2 active:bg-yellow-700"
            onPress={() => {
              modal.warning({
                title: '警告',
                content: '您确定要继续这个操作吗？此操作可能有风险。',
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.warning()
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-600 rounded-xl p-4 mb-2 active:bg-red-700"
            onPress={() => {
              modal.error({
                title: '错误',
                content: '网络连接失败，请检查您的网络设置',
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.error()
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-700 rounded-xl p-4 active:bg-gray-800"
            onPress={() => {
              modal.confirm({
                title: '确认删除',
                content: '删除后数据将无法恢复，确定要删除吗？',
                okText: '确定删除',
                cancelText: '取消',
                onOk: async () => {
                  // Simulate async operation
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  toast.success('删除成功');
                }
              });
            }}
          >
            <Text className="text-white font-bold text-center">
              modal.confirm()
            </Text>
          </TouchableOpacity>
        </View>

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

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '50%', '70%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#fff' }}
        handleIndicatorStyle={{ backgroundColor: '#000' }}
      >
        <BottomSheetView className="flex-1 p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Bottom Sheet 演示
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            这是一个使用 @gorhom/bottom-sheet 创建的底部弹窗组件。
          </Text>
          <View className="bg-blue-100 rounded-lg p-4 mb-3">
            <Text className="text-blue-800 font-semibold mb-1">特性</Text>
            <Text className="text-blue-700">• 支持多个停靠点</Text>
            <Text className="text-blue-700">• 流畅的手势交互</Text>
            <Text className="text-blue-700">• 完全可定制</Text>
          </View>
          <TouchableOpacity
            className="bg-gray-800 rounded-xl p-4"
            onPress={close}
          >
            <Text className="text-white font-bold text-center">关闭</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      {/* Full Screen Modal */}
      <Modal
        visible={fullScreenVisible}
        onClose={() => setFullScreenVisible(false)}
        presentationStyle="fullScreen"
        title="Full Screen Modal"
      >
        <View className="py-4">
          <Text className="text-base text-gray-700 mb-4">
            完全占据整个屏幕，不显示底层内容。
          </Text>
          <View className="bg-blue-100 rounded-lg p-4 mb-4">
            <Text className="text-blue-800 font-semibold mb-2">特性：</Text>
            <Text className="text-blue-700">• 全屏显示</Text>
            <Text className="text-blue-700">• 完全遮挡主页面</Text>
            <Text className="text-blue-700">• iOS 和 Android 都支持</Text>
            <Text className="text-blue-700">• 适合复杂内容展示</Text>
          </View>
        </View>
      </Modal>

      {/* 2. Sheet pageSheet */}
      <Sheet
        {...pageSheet.sheetProps}
        presentationStyle="pageSheet"
        title="pageSheet 示例"
      >
        <Text className="text-base text-gray-700 mb-4">
          iOS 卡片样式，支持下拉关闭。这是纯展示内容，不需要键盘避让。
        </Text>
        <View className="bg-purple-100 rounded-lg p-4 mb-4">
          <Text className="text-purple-800 font-semibold mb-2">特性：</Text>
          <Text className="text-purple-700">• iOS 显示为卡片</Text>
          <Text className="text-purple-700">• 支持下拉关闭手势</Text>
          <Text className="text-purple-700">• 底层内容变暗可见</Text>
        </View>
      </Sheet>

      {/* 3. SheetForm with Keyboard Avoiding */}
      <SheetForm
        {...formSheet.sheetProps}
        presentationStyle="pageSheet"
        title="编辑资料"
        okText="保存"
        cancelText="取消"
        onOk={async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success('保存成功');
        }}
      >
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">姓名</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="请输入姓名"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">邮箱</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="请输入邮箱"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">备注</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="请输入备注"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="bg-indigo-100 rounded-lg p-4">
          <Text className="text-indigo-800 font-semibold mb-2">特性：</Text>
          <Text className="text-indigo-700">• 内置 KeyboardAvoidingView</Text>
          <Text className="text-indigo-700">• 自动处理键盘避让</Text>
          <Text className="text-indigo-700">• 适合表单场景</Text>
        </View>
      </SheetForm>
    </SafeAreaView>
  );
}
