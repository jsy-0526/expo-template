import { PortalHost, usePortal } from "@gorhom/portal";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { Modal } from "./Modal";
import type { ModalInstance, ModalProps } from "./types";

// generate unique ID
let modalIdCounter = 0;
const generateModalId = () => `modal_${Date.now()}_${++modalIdCounter}`;

// context for modal methods
interface ModalContextValue {
  info: (config: Omit<ModalProps, "type" | "visible">) => ModalInstance;
  success: (config: Omit<ModalProps, "type" | "visible">) => ModalInstance;
  error: (config: Omit<ModalProps, "type" | "visible">) => ModalInstance;
  warning: (config: Omit<ModalProps, "type" | "visible">) => ModalInstance;
  confirm: (config: Omit<ModalProps, "type" | "visible">) => ModalInstance;
}

const ModalContext = createContext<ModalContextValue | null>(null);

// provider component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { addPortal, updatePortal, removePortal } = usePortal();

  const createModalInstance = (config: ModalProps): ModalInstance => {
    const id = generateModalId();
    let currentConfig = { ...config };

    const handleClose = () => {
      config.onClose?.();
      removePortal(id);
    };

    // add modal to portal
    const renderModal = () => (
      <Modal key={id} {...currentConfig} visible={true} onClose={handleClose} />
    );

    addPortal(id, renderModal());

    return {
      update: (newConfig: Partial<ModalProps>) => {
        currentConfig = { ...currentConfig, ...newConfig };
        updatePortal(id, renderModal());
      },
      close: () => {
        removePortal(id);
      },
    };
  };

  const value: ModalContextValue = {
    info: (config) => createModalInstance({ ...config, type: "info" }),
    success: (config) => createModalInstance({ ...config, type: "success" }),
    error: (config) => createModalInstance({ ...config, type: "error" }),
    warning: (config) => createModalInstance({ ...config, type: "warning" }),
    confirm: (config) => createModalInstance({ ...config, type: "confirm" }),
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <PortalHost name="modal-host" />
    </ModalContext.Provider>
  );
};

// hook to access modal context
export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModal must be used within <ModalProvider>. " +
        "Please wrap your app with <ModalProvider> in the root layout."
    );
  }
  return context;
};
