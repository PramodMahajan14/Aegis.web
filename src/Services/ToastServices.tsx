import { OverlayToaster, Position, Intent, type ToastProps } from "@blueprintjs/core";
import { useMemo } from "react";

// Singleton toaster instance
let toaster: Awaited<ReturnType<typeof OverlayToaster.createAsync>> | undefined;

// Initialize the toaster asynchronously
OverlayToaster.createAsync({
    position: Position.TOP_RIGHT,
}).then((t) => {
    toaster = t;
});

/**
 * A custom hook for showing toast notifications anywhere in your React components or hooks.
 */
export function useToast() {
    return useMemo(() => ({
        show: (message: string, intent: Intent = Intent.NONE, icon?: ToastProps["icon"]) => {
            if (!toaster) {
                console.warn("Toaster is not yet initialized.");
                return;
            }
            toaster.show({ message, intent, icon });
        },
        success: (message: string) => {
            if (toaster) toaster.show({ message, intent: Intent.SUCCESS, icon: "tick" });
        },
        error: (message: string) => {
            if (toaster) toaster.show({ message, intent: Intent.DANGER, icon: "error" });
        },
        warning: (message: string) => {
            if (toaster) toaster.show({ message, intent: Intent.WARNING, icon: "warning-sign" });
        },
        info: (message: string) => {
            if (toaster) toaster.show({ message, intent: Intent.PRIMARY, icon: "info-sign" });
        }
    }), []);
}