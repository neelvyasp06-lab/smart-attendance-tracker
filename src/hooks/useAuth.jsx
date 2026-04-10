import { createContext, useContext, useState } from "react";
import API_URL from "../config";

const AuthContext = createContext({
    isAuthenticated: false,
    role: null,
    userName: "",
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (role, email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: "Connection Error: " + error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (<AuthContext.Provider value={{
            isAuthenticated,
            role: user?.role,
            userId: user?.userId,
            userName: user?.name,
            user,
            login,
            logout
        }}>
      {children}
    </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);
