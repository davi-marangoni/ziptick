import React, { useState } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
    const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotifications();
    const [show, setShow] = useState(false);

    const ultimas = notificacoes.slice(0, 10);

    return (
        <Dropdown show={show} onToggle={setShow} align="end">
            <Dropdown.Toggle variant="link" className="text-white position-relative p-2" style={{ textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faBell} size="lg" />
                {naoLidas > 0 && (
                    <Badge
                        bg="danger" pill
                        style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.65rem' }}
                    >
                        {naoLidas > 99 ? '99+' : naoLidas}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: 320, maxHeight: 400, overflowY: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <strong>Notificações</strong>
                    {naoLidas > 0 && (
                        <button className="btn btn-link btn-sm p-0" onClick={() => marcarTodasLidas()}>
                            Marcar todas como lidas
                        </button>
                    )}
                </div>
                <Dropdown.Divider />

                {ultimas.length === 0 ? (
                    <Dropdown.ItemText className="text-muted text-center py-3">
                        Nenhuma notificação
                    </Dropdown.ItemText>
                ) : (
                    ultimas.map(n => (
                        <Dropdown.Item
                            key={n.id}
                            as={Link as any}
                            to={n.cham_id ? `/chamados/${n.cham_id}` : '/notificacoes'}
                            onClick={() => { if (!n.lida) marcarLida(n.id); setShow(false); }}
                            className={n.lida ? 'text-muted' : 'fw-semibold'}
                        >
                            <div style={{ whiteSpace: 'normal', fontSize: '0.875rem' }}>
                                {!n.lida && <span className="text-primary me-1">●</span>}
                                {n.mensagem}
                            </div>
                            <small className="text-muted">
                                {n.criado_em ? new Date(n.criado_em).toLocaleString('pt-BR') : ''}
                            </small>
                        </Dropdown.Item>
                    ))
                )}

                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/notificacoes" className="text-center">
                    Ver todas
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;
