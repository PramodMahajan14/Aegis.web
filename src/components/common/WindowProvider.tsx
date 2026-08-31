import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';

export const WindowProvider: React.FC = () => {
    const { windows, closeWindow } = useWindowStore();

    return (
        <>
            {windows.map((win) => (
                <Dialog
                    key={win.id}
                    title={win.title}
                    icon={win.icon}
                    isOpen={win.isOpen}
                    onClose={() => closeWindow(win.id)}
                    style={{ width: win.width || 500 }}
                    // Blueprint handles exit animations; we keep it mounted until animation finishes
                    // If you want it completely unmounted immediately, you can filter `isOpen` in the map,
                    // but Blueprint's Dialog is designed to handle `isOpen` prop for transitions.
                >
                    <div className="bp5-dialog-body" style={{ margin: 0, padding: '1rem' }}>
                        {win.content}
                    </div>
                </Dialog>
            ))}
        </>
    );
};
