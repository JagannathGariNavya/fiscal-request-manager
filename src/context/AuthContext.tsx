
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole, AuthState } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    name: "Finance Admin",
    email: "finance@example.com",
    password: "finance123",
    role: "finance" as UserRole,
  },
  {
    id: "2",
    name: "Department Head",
    email: "hod@example.com",
    password: "hod123",
    role: "hod" as UserRole,
    department: "Engineering",
  },
  {
    id: "3",
    name: "Clerk User",
    email: "clerk@example.com",
    password: "clerk123",
    role: "clerk" as UserRole,
    department: "Engineering",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
  const { toast } = useToast();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState({ ...state, isLoading: true });

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          setState({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          toast({
            title: "Login successful",
            description: `Welcome, ${userWithoutPassword.name}`,
          });
          resolve(true);
        } else {
          setState({
            ...state,
            isLoading: false,
          });
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
