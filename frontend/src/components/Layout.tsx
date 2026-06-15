import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import { NotificationProvider } from '../contexts/NotificationContext';
import { LayoutProvider } from '../contexts/LayoutContext';
import '../styles/layout.css';

const Layout: React.FC = () => {
    return (
        <LayoutProvider>
            <NotificationProvider>
                <AppHeader />
                <main className="main-content">
                    <Outlet />
                </main>
            </NotificationProvider>
        </LayoutProvider>
    );
};

export default Layout;
