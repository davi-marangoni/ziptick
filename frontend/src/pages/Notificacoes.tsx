import React, { useState } from 'react';
import { Container, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const Notificacoes: React.FC = () => {
    const { notificacoes, marcarLida, marcarTodasLidas } = useNotifications();
    const [filtro, setFiltro] = useState<'todas' | 'lidas' | 'nao_lidas'>('todas');

    const filtradas = notificacoes.filter(n => {
        if (filtro === 'lidas') return n.lida;
        if (filtro === 'nao_lidas') return !n.lida;
        return true;
    });

    return (
        <Container className="py-4" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Notificações</h1>
                <Button variant="outline-secondary" size="sm" onClick={() => marcarTodasLidas()}>
                    Marcar todas como lidas
                </Button>
            </div>

            <div className="d-flex gap-2 mb-3">
                {(['todas', 'nao_lidas', 'lidas'] as const).map(f => (
                    <Button key={f} size="sm"
                        variant={filtro === f ? 'primary' : 'outline-secondary'}
                        onClick={() => setFiltro(f)}>
                        {f === 'todas' ? 'Todas' : f === 'nao_lidas' ? 'Não lidas' : 'Lidas'}
                    </Button>
                ))}
            </div>

            {filtradas.length === 0 ? (
                <Alert variant="info">Nenhuma notificação.</Alert>
            ) : (
                <ListGroup>
                    {filtradas.map(n => (
                        <ListGroup.Item
                            key={n.id}
                            className={`d-flex justify-content-between align-items-start ${!n.lida ? 'border-start border-primary border-3' : ''}`}
                        >
                            <div>
                                <div className={n.lida ? 'text-muted' : 'fw-semibold'}>
                                    {n.mensagem}
                                </div>
                                <small className="text-muted">
                                    {n.criado_em ? new Date(n.criado_em).toLocaleString('pt-BR') : ''}
                                    {' · '}
                                    <Badge bg="secondary">{n.tipo}</Badge>
                                </small>
                                {n.cham_id && (
                                    <div><Link to={`/chamados/${n.cham_id}`} className="small">Ver chamado #{n.cham_id}</Link></div>
                                )}
                            </div>
                            {!n.lida && (
                                <Button variant="link" size="sm" onClick={() => marcarLida(n.id)}>✓</Button>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default Notificacoes;
