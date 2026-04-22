import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as api from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAccount: (name: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("biblio_user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(email, password);
      const u: User = { 
        id: data.id, 
        name: data.name, 
        email: data.email, 
        avatar: data.name[0].toUpperCase(),
        joinDate: new Date().toISOString() 
      };
      setUser(u);
      localStorage.setItem("biblio_user", JSON.stringify(u));
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.register(name, email, password);
      const u: User = { 
        id: data.id, 
        name: data.name, 
        email: data.email, 
        avatar: name[0].toUpperCase(),
        joinDate: new Date().toISOString() 
      };
      setUser(u);
      localStorage.setItem("biblio_user", JSON.stringify(u));
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const updateAccount = async (name: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const data = await api.updateUserProfile(user.id, name);
      const updatedUser = { ...user, name: data.name, avatar: data.name[0].toUpperCase() };
      setUser(updatedUser);
      localStorage.setItem("biblio_user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Update account failed:", error);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      await api.deleteUser(user.id);
      logout();
      return true;
    } catch (error) {
      console.error("Delete account failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("biblio_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateAccount, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
