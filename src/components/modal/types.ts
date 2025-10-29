import type { ReactNode } from 'react';

export type ModalType = 'default' | 'confirm' | 'info' | 'success' | 'warning' | 'error';

export interface ModalProps {
  // Visibility control
  visible?: boolean;
  // Close callback
  onClose?: () => void;
  // Modal type
  type?: ModalType;
  // Title
  title?: string;
  // Content
  content?: ReactNode;
  // Custom footer buttons
  footer?: ReactNode;
  // Hide default footer
  hideFooter?: boolean;
  // Confirm button text
  okText?: string;
  // Cancel button text
  cancelText?: string;
  // Confirm button callback
  onOk?: () => void | Promise<void>;
  // Cancel button callback
  onCancel?: () => void;
  // Loading state for ok button
  confirmLoading?: boolean;
  // Close on backdrop press
  closeOnBackdropPress?: boolean;
  // Animation type
  animationType?: 'none' | 'slide' | 'fade';
  // Modal width (for web/tablet)
  width?: number | string;
  // Z-index
  zIndex?: number;
  // Custom content (for declarative usage)
  children?: ReactNode;
}

export interface ModalInstance {
  // Update modal props
  update: (config: Partial<ModalProps>) => void;
  // Close modal
  close: () => void;
}

export interface ModalStaticMethods {
  // Show a basic modal
  show: (config: ModalProps) => ModalInstance;
  // Show info modal
  info: (config: Omit<ModalProps, 'type'>) => ModalInstance;
  // Show success modal
  success: (config: Omit<ModalProps, 'type'>) => ModalInstance;
  // Show error modal
  error: (config: Omit<ModalProps, 'type'>) => ModalInstance;
  // Show warning modal
  warning: (config: Omit<ModalProps, 'type'>) => ModalInstance;
  // Show confirm modal
  confirm: (config: Omit<ModalProps, 'type'>) => ModalInstance;
}
