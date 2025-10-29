import React from 'react';
import type { ReactNode } from 'react';
import { AppRegistry } from 'react-native';

import { Modal } from './Modal';
import type { ModalInstance, ModalProps, ModalStaticMethods } from './types';

// Container component ID for imperative API
const MODAL_CONTAINER_ID = '__modal_container__';

interface ModalContainerState {
  modals: Array<{
    id: string;
    props: ModalProps;
  }>;
}

class ModalContainer extends React.Component<{}, ModalContainerState> {
  static instance: ModalContainer | null = null;

  state: ModalContainerState = {
    modals: []
  };

  componentDidMount() {
    ModalContainer.instance = this;
  }

  componentWillUnmount() {
    ModalContainer.instance = null;
  }

  add = (id: string, props: ModalProps) => {
    this.setState((prevState) => ({
      modals: [...prevState.modals, { id, props }]
    }));
  };

  update = (id: string, props: Partial<ModalProps>) => {
    this.setState((prevState) => ({
      modals: prevState.modals.map((modal) =>
        modal.id === id ? { ...modal, props: { ...modal.props, ...props } } : modal
      )
    }));
  };

  remove = (id: string) => {
    this.setState((prevState) => ({
      modals: prevState.modals.filter((modal) => modal.id !== id)
    }));
  };

  render() {
    return (
      <>
        {this.state.modals.map(({ id, props }) => (
          <Modal
            key={id}
            {...props}
            visible={true}
            onClose={() => {
              props.onClose?.();
              this.remove(id);
            }}
          />
        ))}
      </>
    );
  }
}

// Register ModalContainer as a separate React root
let isRegistered = false;
function ensureModalContainer() {
  if (!isRegistered) {
    AppRegistry.registerComponent(MODAL_CONTAINER_ID, () => ModalContainer);
    isRegistered = true;
  }
}

// Generate unique ID
let modalIdCounter = 0;
function generateModalId(): string {
  return `modal_${Date.now()}_${++modalIdCounter}`;
}

// Create modal instance
function createModal(config: ModalProps): ModalInstance {
  ensureModalContainer();

  const id = generateModalId();

  // Wait for container to be ready
  setTimeout(() => {
    if (ModalContainer.instance) {
      ModalContainer.instance.add(id, config);
    } else {
      console.error('ModalContainer not initialized');
    }
  }, 0);

  return {
    update: (newConfig: Partial<ModalProps>) => {
      if (ModalContainer.instance) {
        ModalContainer.instance.update(id, newConfig);
      }
    },
    close: () => {
      if (ModalContainer.instance) {
        ModalContainer.instance.remove(id);
      }
    }
  };
}

// Static methods
export const ModalAPI: ModalStaticMethods = {
  show: (config: ModalProps) => {
    return createModal(config);
  },

  info: (config: Omit<ModalProps, 'type'>) => {
    return createModal({ ...config, type: 'info' });
  },

  success: (config: Omit<ModalProps, 'type'>) => {
    return createModal({ ...config, type: 'success' });
  },

  error: (config: Omit<ModalProps, 'type'>) => {
    return createModal({ ...config, type: 'error' });
  },

  warning: (config: Omit<ModalProps, 'type'>) => {
    return createModal({ ...config, type: 'warning' });
  },

  confirm: (config: Omit<ModalProps, 'type'>) => {
    return createModal({ ...config, type: 'confirm' });
  }
};

// Export ModalContainer for app root
export { ModalContainer };
