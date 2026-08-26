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
