import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import AdminOnly from './AdminOnly';
import '../styles/sidebar.css';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
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
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faHome} />
                    </span>
                    <span className="nav-label">Dashboard</span>
                </Nav.Link>

                <AdminOnly>
                    <Nav.Link as={Link} to="/usuarios" className="nav-item" title="Usuários">
                        <span className="nav-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </span>
                        <span className="nav-label">Usuários</span>
                    </Nav.Link>
                </AdminOnly>

                <Nav.Link as={Link} to="/configuracoes" className="nav-item" title="Configurações">
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faCog} />
                    </span>
                    <span className="nav-label">Configurações</span>
                </Nav.Link>
            </Nav>

            <div className="sidebar-footer">
                <Button
                    variant="danger"
                    onClick={logout}
                    className="logout-btn"
                    title="Sair"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {isExpanded && <span className="btn-label">Sair</span>}
                </Button>
            </div>
        </nav>
    );
};

export default Sidebar;
