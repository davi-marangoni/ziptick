import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const NotFound: React.FC = () => {
    return (
        <Container className="py-4 text-center">
            <div style={{ marginTop: '50px' }}>
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    size="3x"
                    className="mb-3"
                    style={{ color: '#ff6b6b' }}
                />
                <h1>Página não encontrada</h1>
                <p>A página que você está procurando não existe.</p>
                <Link to="/">
                    <Button variant="primary">Voltar para o Dashboard</Button>
                </Link>
            </div>
        </Container>
    );
};

export default NotFound;
