import { useMemo } from 'react';
import Toast, { ToastShowParams } from 'react-native-toast-message';

export interface UseToastOptions {
  // Default configuration for all toasts
  defaultConfig?: Partial<ToastShowParams>;
  // Default duration in milliseconds
  visibilityTime?: number;
  // Default titles for each toast type
  defaultTitles?: {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
  };
}

export interface ToastConfig {
  title?: string;
  content?: string;
  config?: Partial<ToastShowParams>;
}

export interface UseToastReturn {
  // Show success toast
  // Usage: toast.success('content') or toast.success({ title: 'title', content: 'content' })
  success: (contentOrConfig: string | ToastConfig) => void;
  // Show error toast
  // Usage: toast.error('content') or toast.error({ title: 'title', content: 'content' })
  error: (contentOrConfig: string | ToastConfig) => void;
  // Show info toast
  // Usage: toast.info('content') or toast.info({ title: 'title', content: 'content' })
  info: (contentOrConfig: string | ToastConfig) => void;
  // Show warning toast
  // Usage: toast.warning('content') or toast.warning({ title: 'title', content: 'content' })
  warning: (contentOrConfig: string | ToastConfig) => void;
  // Show custom toast with full control
  show: (config: ToastShowParams) => void;
  // Hide current toast
  hide: () => void;
}

// Hook to show toast messages
// Example:
// const toast = useToast();
// const { t } = useTranslation();
// toast.success(t('messages.success'));
// toast.error({ title: t('error'), content: t('messages.error') });
export const useToast = (options: UseToastOptions = {}): UseToastReturn => {
  const {
    defaultConfig = {},
    visibilityTime = 3000,
    defaultTitles = {
      success: 'Success',
      error: 'Error',
      info: 'Info',
      warning: 'Warning'
    }
  } = options;

  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    contentOrConfig: string | ToastConfig
  ) => {
    const defaultTitle = defaultTitles[type] || '';

    if (typeof contentOrConfig === 'string') {
      // Simple string usage: toast.success('content')
      Toast.show({
        type,
        text1: defaultTitle,
        text2: contentOrConfig,
        visibilityTime,
        ...defaultConfig
      });
    } else {
      // Object usage: toast.success({ title: 'title', content: 'content' })
      const { title, content, config } = contentOrConfig;
      Toast.show({
        type,
        text1: title !== undefined ? title : defaultTitle,
        text2: content,
        visibilityTime,
        ...defaultConfig,
        ...config
      });
    }
  };

  return useMemo(
    () => ({
      success: (contentOrConfig: string | ToastConfig) => {
        showToast('success', contentOrConfig);
      },

      error: (contentOrConfig: string | ToastConfig) => {
        showToast('error', contentOrConfig);
      },

      info: (contentOrConfig: string | ToastConfig) => {
        showToast('info', contentOrConfig);
      },

      warning: (contentOrConfig: string | ToastConfig) => {
        showToast('warning', contentOrConfig);
      },

      show: (config: ToastShowParams) => {
        Toast.show({
          visibilityTime,
          ...defaultConfig,
          ...config
        });
      },

      hide: () => {
        Toast.hide();
      }
    }),
    [visibilityTime, defaultConfig, defaultTitles]
  );
};
