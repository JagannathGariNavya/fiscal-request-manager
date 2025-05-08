
export type UserRole = 'finance' | 'hod' | 'clerk';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
