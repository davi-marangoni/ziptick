import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import AdminOnly from './AdminOnly';
import './sidebar.css';

const Sidebar: React.FC = () => {
    const { logout, user, isAdmin } = useAuth();

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h3>ZipTick</h3>
                {user && <p className="user-email">{user.email}</p>}
            </div>

            <Nav className="flex-column nav-links">
                <Nav.Link as={Link} to="/" className="nav-item">
                    <FontAwesomeIcon icon={faHome} /> Dashboard
                </Nav.Link>

                <AdminOnly>
                    <Nav.Link as={Link} to="/usuarios" className="nav-item">
                        <FontAwesomeIcon icon={faUsers} /> Usuários
                    </Nav.Link>
                </AdminOnly>

                <Nav.Link as={Link} to="/configuracoes" className="nav-item">
                    <FontAwesomeIcon icon={faCog} /> Configurações
                </Nav.Link>
            </Nav>

            <div className="sidebar-footer">
                <Button
                    variant="danger"
                    size="sm"
                    onClick={logout}
                    className="logout-btn w-100"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Sair
                </Button>
            </div>
        </nav>
    );
};

export default Sidebar;
