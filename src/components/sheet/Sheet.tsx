import React, { useEffect, useState } from 'react';
import {
  Modal as RNModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SheetProps } from './types';

export function Sheet({
  visible = false,
  onClose,
  title,
  content,
  footer,
  hideFooter = false,
  okText = 'OK',
  cancelText = 'Cancel',
  onOk,
  onCancel,
  confirmLoading = false,
  closeOnBackdropPress = true,
  presentationStyle = 'pageSheet',
  children
}: SheetProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(confirmLoading);
  }, [confirmLoading]);

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleOk = async () => {
    if (!onOk) {
      onClose?.();
      return;
    }

    try {
      setLoading(true);
      const result = onOk();
      if (result instanceof Promise) {
        await result;
      }
      onClose?.();
    } catch (error) {
      console.error('Sheet onOk error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    if (!title) return null;

    return (
      <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900 flex-1">
          {title}
        </Text>
        {closeOnBackdropPress && (
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-gray-500 text-2xl">×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (children) return children;

    if (!content) return null;

    return (
      <View>
        {typeof content === 'string' ? (
          <Text className="text-base text-gray-700">{content}</Text>
        ) : (
          content
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (hideFooter) return null;

    if (footer) return footer;

    // Only show footer if there are callbacks
    if (!onOk && !onCancel) return null;

    return (
      <View className="flex-row justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
        {onCancel && (
          <TouchableOpacity
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white flex-1"
            onPress={handleCancel}
            disabled={loading}
          >
            <Text className="text-gray-700 font-medium text-center">{cancelText}</Text>
          </TouchableOpacity>
        )}
        {onOk && (
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg flex-1 ${
              loading ? 'bg-blue-400' : 'bg-blue-600'
            }`}
            onPress={handleOk}
            disabled={loading}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Loading...' : okText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <RNModal
      visible={visible}
      presentationStyle={presentationStyle}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </ScrollView>
      </SafeAreaView>
    </RNModal>
  );
}
