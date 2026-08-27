interface Tenant {
    id: string;
    name: string;
    slug: string;
}

export interface AuthState {
    user: User | null;
    permissions: string[];
    // tenants: Tenant[];
    requiresTenantSelection: boolean;
    loading: boolean;

    login: (data: LoginPayload) => Promise<void>;
    // selectTenant: (tenantId: string) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (newPassword: string) => Promise<void>;
    can: (perm: string) => boolean;
}

export interface User {
    id: number | string;
    code?: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResult {
    accessToken: string;
    user: User;
    permissions: string[];
    mustResetPassword?: boolean;
}
export interface LoginPayload {
    // tenantSlug: string;
    email: string;
    password: string;
    // platform: string;
}

export interface ChangePasswordPayload {
    newPassword: string;
}
//