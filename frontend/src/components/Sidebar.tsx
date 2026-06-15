import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faSignOutAlt, faUsers, faBuilding,
    faTicketAlt, faColumns, faCog, faBell, faUser
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/sidebar.css';

const Sidebar: React.FC = () => {
    const { logout, isAdmin, isGerencia, isFuncionario, user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <nav
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="sidebar-header">
                <h3>{isExpanded ? 'ZipTick' : 'Z'}</h3>
            </div>

            <Nav className="flex-column nav-links">
                <Nav.Link as={Link} to="/" className="nav-item" title="Dashboard">
                    <span className="nav-icon"><FontAwesomeIcon icon={faHome} /></span>
                    <span className="nav-label">Dashboard</span>
                </Nav.Link>

                {/* Chamados — todos os perfis */}
                <Nav.Link as={Link} to="/chamados" className="nav-item" title="Chamados">
                    <span className="nav-icon"><FontAwesomeIcon icon={faTicketAlt} /></span>
                    <span className="nav-label">Chamados</span>
                </Nav.Link>

                {/* Kanban — Funcionário+ */}
                {isFuncionario && (
                    <Nav.Link as={Link} to="/kanban" className="nav-item" title="Kanban">
                        <span className="nav-icon"><FontAwesomeIcon icon={faColumns} /></span>
                        <span className="nav-label">Kanban</span>
                    </Nav.Link>
                )}

                {/* Setores e Configurações — Gerência+ */}
                {isGerencia && (
                    <>
                        <Nav.Link as={Link} to="/setores" className="nav-item" title="Setores">
                            <span className="nav-icon"><FontAwesomeIcon icon={faBuilding} /></span>
                            <span className="nav-label">Setores</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/configurar/kanban" className="nav-item" title="Config. Kanban">
                            <span className="nav-icon"><FontAwesomeIcon icon={faCog} /></span>
                            <span className="nav-label">Config. Kanban</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/configurar/campos" className="nav-item" title="Campos Customizados">
                            <span className="nav-icon"><FontAwesomeIcon icon={faCog} /></span>
                            <span className="nav-label">Config. Campos</span>
                        </Nav.Link>
                    </>
                )}

                {/* Usuários — Admin */}
                {isAdmin && (
                    <Nav.Link as={Link} to="/usuarios" className="nav-item" title="Usuários">
                        <span className="nav-icon"><FontAwesomeIcon icon={faUsers} /></span>
                        <span className="nav-label">Usuários</span>
                    </Nav.Link>
                )}

                {/* Notificações e Perfil — todos */}
                <Nav.Link as={Link} to="/notificacoes" className="nav-item" title="Notificações">
                    <span className="nav-icon"><FontAwesomeIcon icon={faBell} /></span>
                    <span className="nav-label">Notificações</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil" className="nav-item" title="Meu Perfil">
                    <span className="nav-icon"><FontAwesomeIcon icon={faUser} /></span>
                    <span className="nav-label">Meu Perfil</span>
                </Nav.Link>
            </Nav>

            <div className="sidebar-footer">
                {isExpanded && user?.nome && (
                    <span className="sidebar-username">{user.nome}</span>
                )}
                <Button variant="danger" onClick={logout} className="logout-btn" title="Sair">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {isExpanded && <span className="btn-label">Sair</span>}
                </Button>
            </div>
        </nav>
    );
};

export default Sidebar;
