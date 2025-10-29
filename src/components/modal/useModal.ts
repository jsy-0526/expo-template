import { useCallback, useState } from 'react';

import type { ModalProps } from './types';

export interface UseModalReturn {
  // Visibility state
  visible: boolean;
  // Open modal
  open: () => void;
  // Close modal
  close: () => void;
  // Toggle modal
  toggle: () => void;
  // Modal props to spread on Modal component
  modalProps: {
    visible: boolean;
    onClose: () => void;
  };
}

// Hook for declarative modal usage
// Example:
// const modal = useModal();
// return (
//   <>
//     <Button onPress={modal.open}>Open Modal</Button>
//     <Modal {...modal.modalProps} title="My Modal">
//       <Text>Content</Text>
//     </Modal>
//   </>
// );
export function useModal(options: { onOpen?: () => void; onClose?: () => void } = {}): UseModalReturn {
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
    modalProps: {
      visible,
      onClose: close
    }
  };
}
