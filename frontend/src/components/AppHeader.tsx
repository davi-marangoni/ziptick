import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLayout } from '../contexts/LayoutContext';
import NotificationBell from './NotificationBell';
import '../styles/header.css';

const GridIcon = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.9" />
        <rect x="15" y="1" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.9" />
        <rect x="1" y="15" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.9" />
        <rect x="15" y="15" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.45" />
    </svg>
);

const AppHeader: React.FC = () => {
    const { user, logout, isAdmin, isGerencia, isFuncionario } = useAuth();
    const { headerExtra } = useLayout();
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    const initials = user?.nome
        ? user.nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : 'U';

    return (
        <header className="app-header">
            {/* Logo */}
            <Link to="/kanban" className="header-brand">
                <div className="header-logo-icon"><GridIcon /></div>
                <div className="header-brand-text">
                    <span className="header-brand-name">ZipTick</span>
                    <span className="header-brand-tagline">Atendimento transparente, do chamado à resolução</span>
                </div>
            </Link>

            {/* Nav links */}
            <nav className="header-nav">
                <Link to="/chamados" className={`hn-link${isActive('/chamados') ? ' active' : ''}`}>Chamados</Link>
                {isFuncionario && (
                    <Link to="/kanban" className={`hn-link${isActive('/kanban') ? ' active' : ''}`}>Kanban</Link>
                )}
                {isGerencia && (
                    <>
                        <Link to="/setores" className={`hn-link${isActive('/setores') ? ' active' : ''}`}>Setores</Link>
                        <Link to="/configurar/kanban" className={`hn-link${isActive('/configurar') ? ' active' : ''}`}>Configurar</Link>
                    </>
                )}
                {isAdmin && (
                    <Link to="/usuarios" className={`hn-link${isActive('/usuarios') ? ' active' : ''}`}>Usuários</Link>
                )}
            </nav>

            {/* Page-injected extras (sector filter, buttons, etc.) */}
            <div className="header-extra">{headerExtra}</div>

            {/* Right controls */}
            <div className="header-right">
                <NotificationBell />
                <div className="header-user" ref={menuRef}>
                    <button
                        className="header-avatar-btn"
                        onClick={() => setUserMenuOpen(o => !o)}
                        aria-label="Menu do usuário"
                    >
                        <span className="header-avatar">{initials}</span>
                    </button>
                    {userMenuOpen && (
                        <div className="header-user-dropdown">
                            <div className="hud-info">
                                <span className="hud-name">{user?.nome ?? 'Usuário'}</span>
                                <span className="hud-email">{(user as any)?.email ?? ''}</span>
                            </div>
                            <div className="hud-divider" />
                            <Link to="/notificacoes" className="hud-item" onClick={() => setUserMenuOpen(false)}>
                                Notificações
                            </Link>
                            <Link to="/perfil" className="hud-item" onClick={() => setUserMenuOpen(false)}>
                                Meu Perfil
                            </Link>
                            <div className="hud-divider" />
                            <button className="hud-logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
