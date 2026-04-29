import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
    email: string;
    tipo: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Carrega dados do localStorage ao inicializar
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Configura o header padrão do axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, senha: string): Promise<void> => {
        try {
            const response = await axios.post('http://localhost:3000/api/usuarios/login', {
                email,
                senha
            });

            const { usuario, token: novoToken } = response.data.data;

            setUser(usuario);
            setToken(novoToken);

            // Armazena no localStorage
            localStorage.setItem('token', novoToken);
            localStorage.setItem('user', JSON.stringify(usuario));

            // Configura o header padrão do axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${novoToken}`;
        } catch (error) {
            throw error;
        }
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isAdmin: user?.tipo === 1
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
