import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';

export interface UseBottomSheetOptions {
  // Initial open state
  // @default false
  initialOpen?: boolean;
  // Callback fired when bottom sheet opens
  onOpen?: () => void;
  // Callback fired when bottom sheet closes
  onClose?: () => void;
  // Callback fired when bottom sheet changes position
  onChange?: (index: number) => void;
}

export interface UseBottomSheetReturn {
  // Ref to be attached to BottomSheet component
  ref: React.RefObject<BottomSheet | null>;
  // Current open state
  isOpen: boolean;
  // Current snap point index
  currentIndex: number;
  // Open the bottom sheet (expand to first snap point)
  open: () => void;
  // Close the bottom sheet
  close: () => void;
  // Toggle between open and closed states
  toggle: () => void;
  // Snap to a specific index
  snapToIndex: (index: number) => void;
  // Snap to a specific position (percentage or pixel value)
  snapToPosition: (position: string | number) => void;
  // Expand to the maximum snap point
  expand: () => void;
  // Collapse to the minimum snap point
  collapse: () => void;
}

// Hook to control Bottom Sheet component
// Example:
// const { ref, open, close, isOpen } = useBottomSheet({
//   onOpen: () => console.log('opened'),
//   onClose: () => console.log('closed')
// });
//
// return (
//   <>
//     <Button onPress={open}>Open</Button>
//     <BottomSheet ref={ref} snapPoints={['25%', '50%']}>
//       <Content onClose={close} />
//     </BottomSheet>
//   </>
// );
export const useBottomSheet = (
  options: UseBottomSheetOptions = {}
): UseBottomSheetReturn => {
  const { initialOpen = false, onOpen, onClose, onChange } = options;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [currentIndex, setCurrentIndex] = useState(initialOpen ? 0 : -1);

  const open = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
    setCurrentIndex(0);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
    setCurrentIndex(-1);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const snapToIndex = useCallback(
    (index: number) => {
      bottomSheetRef.current?.snapToIndex(index);
      setCurrentIndex(index);
      setIsOpen(index >= 0);
      onChange?.(index);
    },
    [onChange]
  );

  const snapToPosition = useCallback((position: string | number) => {
    bottomSheetRef.current?.snapToPosition(position);
  }, []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  return {
    ref: bottomSheetRef,
    isOpen,
    currentIndex,
    open,
    close,
    toggle,
    snapToIndex,
    snapToPosition,
    expand,
    collapse
  };
};
