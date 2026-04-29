import React from 'react';
import { Container } from 'react-bootstrap';

const Dashboard: React.FC = () => {
    return (
        <Container className="py-4">
            <h1>Dashboard</h1>
            <p>Bem-vindo ao ZipTick!</p>
            <p>Esta é a página inicial do sistema.</p>
        </Container>
    );
};

export default Dashboard;
