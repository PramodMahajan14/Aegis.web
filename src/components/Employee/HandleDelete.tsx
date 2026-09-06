import React from 'react';
import { Intent } from '@blueprintjs/core';
import { useConfirmStore } from '../../store/useConfirmStore';
import { useDeleteEmployee } from '../../hooks/Employee/useEmployee';

export const useHandleDeleteEmployee = () => {
    const { openConfirm } = useConfirmStore();
    const deleteEmployee = useDeleteEmployee();

    const handleDelete = (emp: any) => {
        openConfirm({
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete Employee",
            icon: "trash",
            intent: Intent.DANGER,
            content: (
                <p>
                    Are you sure you want to delete <b>{emp.firstName} {emp?.lastName || ''}</b>? This action cannot be undone.
                </p>
            ),
            onConfirm: async () => {
                if (emp.id) {
                    try {
                        await deleteEmployee.mutateAsync(emp.id);
                    } catch (error) {
                        console.error("Failed to delete employee:", error);
                        throw error;
                    }
                }
            }
        });
    };

    return handleDelete;
};
