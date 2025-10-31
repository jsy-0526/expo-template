import { useEffect, useState } from "react";
import {
  Pressable,
  Modal as RNModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ModalProps } from "./types";

const typeIcons: Record<string, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
  confirm: "❓",
};

const typeColors: Record<string, string> = {
  info: "bg-blue-100 border-blue-500",
  success: "bg-green-100 border-green-500",
  warning: "bg-yellow-100 border-yellow-500",
  error: "bg-red-100 border-red-500",
  confirm: "bg-gray-100 border-gray-500",
};

export const Modal = ({
  visible = false,
  onClose,
  type = "default",
  title,
  content,
  footer,
  hideFooter = false,
  okText = "OK",
  cancelText = "Cancel",
  onOk,
  onCancel,
  confirmLoading = false,
  closeOnBackdropPress = true,
  animationType = "fade",
  presentationStyle = "dialog",
  children,
}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(confirmLoading);
  }, [confirmLoading]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose?.();
    }
  };

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
      console.error("Modal onOk error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    if (!title && type === "default") return null;

    return (
      <View className="flex-row items-center mb-4">
        {type !== "default" && (
          <Text className="text-2xl mr-2">{typeIcons[type]}</Text>
        )}
        {title && (
          <Text className="text-xl font-bold text-gray-900 flex-1">
            {title}
          </Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (children) return children;

    if (!content) return null;

    const containerClass =
      type !== "default" ? `p-4 rounded-lg border-l-4 ${typeColors[type]}` : "";

    return (
      <View className={containerClass}>
        {typeof content === "string" ? (
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

    return (
      <View className="flex-row justify-end space-x-2 mt-6">
        {(type === "default" || type === "confirm") && (
          <TouchableOpacity
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
            onPress={handleCancel}
            disabled={loading}
          >
            <Text className="text-gray-700 font-medium">{cancelText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleOk}
          disabled={loading}
        >
          <Text className="text-white font-medium">
            {loading ? "Loading..." : okText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const insets = useSafeAreaInsets();

  // Full screen layout
  if (presentationStyle === "fullScreen") {
    return (
      <RNModal
        visible={visible}
        presentationStyle="fullScreen"
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}
        >
          {/* Header with close button */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <Text className="text-xl font-bold text-gray-900 flex-1">
                {title}
              </Text>
            )}
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center"
            >
              <Text className="text-gray-500 text-2xl">×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-6">{renderContent()}</ScrollView>

          {/* Footer */}
          {!hideFooter && (footer || onOk || onCancel) && (
            <View
              className="p-4 border-t border-gray-200"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
              {renderFooter()}
            </View>
          )}
        </View>
      </RNModal>
    );
  }

  // Default dialog layout
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={handleBackdropPress}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};
