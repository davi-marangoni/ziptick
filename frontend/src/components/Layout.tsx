import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/layout.css';

const Layout: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div className="layout">
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Layout;
