import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/layout.css';

const Layout: React.FC = () => {
    return (
        <div className="layout">
            <Row className="g-0" style={{ height: '100vh' }}>
                <Col md={3} lg={2} className="sidebar-container">
                    <Sidebar />
                </Col>
                <Col md={9} lg={10} className="content-container">
                    <main className="main-content">
                        <Outlet />
                    </main>
                </Col>
            </Row>
        </div>
    );
};

export default Layout;
