import React, { useState } from 'react';
import { Alert } from '@blueprintjs/core';
import { useConfirmStore } from '../../store/useConfirmStore';

export const ConfirmProvider: React.FC = () => {
    const { config, isOpen, closeConfirm } = useConfirmStore();
    const [isConfirming, setIsConfirming] = useState(false);

    if (!config) return null;

    const { content, onConfirm, onCancel, ...alertProps } = config;

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm();
            closeConfirm();
        } catch (error) {
            console.error('Confirm action failed:', error);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        closeConfirm();
    };

    return (
        <Alert
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            loading={isConfirming}
            {...alertProps}
        >
            {content}
        </Alert>
    );
};
