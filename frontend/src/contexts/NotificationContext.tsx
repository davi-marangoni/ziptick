import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificacaoService, Notificacao } from '../services/notificacaoService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
    notificacoes: Notificacao[];
    naoLidas: number;
    marcarLida: (id: number) => Promise<void>;
    marcarTodasLidas: () => Promise<void>;
    recarregar: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

    const recarregar = useCallback(() => {
        if (!isAuthenticated) return;
        notificacaoService.listar()
            .then(r => setNotificacoes(r.data.data))
            .catch(() => {});
    }, [isAuthenticated]);

    // Polling a cada 30 segundos
    useEffect(() => {
        if (!isAuthenticated) return;
        recarregar();
        const interval = setInterval(recarregar, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated, recarregar]);

    const marcarLida = async (id: number) => {
        await notificacaoService.marcarLida(id);
        setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    };

    const marcarTodasLidas = async () => {
        await notificacaoService.marcarTodasLidas();
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    };

    const naoLidas = notificacoes.filter(n => !n.lida).length;

    return (
        <NotificationContext.Provider value={{ notificacoes, naoLidas, marcarLida, marcarTodasLidas, recarregar }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
    return ctx;
};
