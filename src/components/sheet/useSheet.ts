import { useCallback, useState } from 'react';

import type { SheetProps } from './types';

export interface UseSheetReturn {
  // Visibility state
  visible: boolean;
  // Open sheet
  open: () => void;
  // Close sheet
  close: () => void;
  // Toggle sheet
  toggle: () => void;
  // Sheet props to spread on Sheet component
  sheetProps: {
    visible: boolean;
    onClose: () => void;
  };
}

/**
 * Hook for declarative sheet usage
 *
 * @example
 * const sheet = useSheet();
 * return (
 *   <>
 *     <Button onPress={sheet.open}>Open Sheet</Button>
 *     <Sheet {...sheet.sheetProps} title="My Sheet">
 *       <Text>Content</Text>
 *     </Sheet>
 *   </>
 * );
 */
export function useSheet(options: { onOpen?: () => void; onClose?: () => void } = {}): UseSheetReturn {
  const { onOpen, onClose } = options;
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => {
    setVisible(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    open,
    close,
    toggle,
    sheetProps: {
      visible,
      onClose: close
    }
  };
}
