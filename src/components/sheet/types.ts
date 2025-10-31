import type { ReactNode } from 'react';

export type SheetPresentationStyle = 'pageSheet' | 'formSheet';

export interface SheetProps {
  // Visibility control
  visible?: boolean;
  // Close callback
  onClose?: () => void;
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
  // Close on backdrop press (swipe down on iOS)
  closeOnBackdropPress?: boolean;
  // Presentation style
  presentationStyle?: SheetPresentationStyle;
  // Custom content (for declarative usage)
  children?: ReactNode;
}

export interface SheetInstance {
  // Update sheet props
  update: (config: Partial<SheetProps>) => void;
  // Close sheet
  close: () => void;
}
