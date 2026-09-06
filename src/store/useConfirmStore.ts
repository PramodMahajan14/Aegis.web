import { create } from 'zustand';
import React from 'react';

import type { AlertProps } from '@blueprintjs/core';

export interface ConfirmConfig extends Omit<AlertProps, 'isOpen' | 'onCancel' | 'onConfirm' | 'children'> {
  content: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

interface ConfirmState {
  config: ConfirmConfig | null;
  isOpen: boolean;
  openConfirm: (config: ConfirmConfig) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  config: null,
  isOpen: false,
  openConfirm: (config) => set({ config, isOpen: true }),
  closeConfirm: () => set({ isOpen: false }),
}));
