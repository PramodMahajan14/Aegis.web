// utils/errorHelpers.ts
import axios from 'axios';


// 1. Define the shapes for both types of API failure payloads
interface ApiValidationErrorPayload {
    type?: string;
    title?: string;
    status?: number;
    errors?: Record<string, string[]>; // For the 400 validation format
    traceId?: string;
}

interface ApiBusinessErrorPayload {
    success: boolean;
    message?: string; // For the "Email already exists" format
    data?: null | any;
    errors?: number;
    statusCode?: number;
    dateTime?: string;
}

export const getErrorMessage = (err: unknown): string => {
    // Check if it is an Axios HTTP failure
    if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as ApiValidationErrorPayload & ApiBusinessErrorPayload | undefined;

        if (errorData) {
            // Kind 1: Check for explicit business errors (e.g., "An employee with this email already exists...")
            if (errorData.success === false && errorData.message) {
                return errorData.message;
            }

            // Kind 2: Check for field validation errors (e.g., "Contact number cannot exceed 20 characters.")
            if (errorData.errors && typeof errorData.errors === 'object') {
                const errorMessages = Object.values(errorData.errors).flat();
                if (errorMessages.length > 0) {
                    return errorMessages.join(', ');
                }
            }

            // Kind 3: Check for general API title text
            if (errorData.title) return errorData.title;
        }

        // Fallback: Default Axios string message (e.g., "Request failed with status code 400")
        if (err.message) return err.message;
    }

    // Handle native thrown JavaScript runtime errors
    if (err instanceof Error) {
        return err.message;
    }

    return typeof err === 'string' ? err : 'An unexpected error occurred';
};
