import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { chamadoService, Chamado, PRIORIDADES } from '../services/chamadoService';
import { useAuth } from '../contexts/AuthContext';

const DetalheChamado: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isFuncionario } = useAuth();
    const [chamado, setChamado] = useState<Chamado | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        chamadoService.buscarPorId(parseInt(id))
            .then(r => setChamado(r.data.data))
            .catch(() => setError('Chamado não encontrado ou sem permissão.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    if (error) return <Container className="py-4"><Alert variant="danger">{error}</Alert></Container>;
    if (!chamado) return null;

    const prio = PRIORIDADES.find(p => p.value === chamado.prioridade);

    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1>Chamado #{chamado.id}</h1>
                    <h5 className="text-muted">{chamado.titulo}</h5>
                </div>
                <div className="d-flex gap-2">
                    {isFuncionario && (
                        <Button as={Link as any} to={`/chamados/${chamado.id}/editar`}
                            variant="outline-secondary" size="sm">Editar</Button>
                    )}
                    <Button as={Link as any} to="/chamados" variant="secondary" size="sm">Voltar</Button>
                </div>
            </div>

            <Card className="mb-3">
                <Card.Body>
                    <div className="row g-3">
                        <div className="col-sm-4">
                            <strong>Status</strong>
                            <div>{chamado.coluna_titulo
                                ? <Badge bg="primary">{chamado.coluna_titulo}</Badge>
                                : <Badge bg="secondary">Sem status</Badge>}</div>
                        </div>
                        <div className="col-sm-4">
                            <strong>Prioridade</strong>
                            <div>{prio && prio.value > 0
                                ? <Badge bg={prio.variant as any}>{prio.label}</Badge>
                                : '—'}</div>
                        </div>
                        <div className="col-sm-4">
                            <strong>Setor</strong>
                            <div>{chamado.setor_nome || '—'}</div>
                        </div>
                        <div className="col-sm-4">
                            <strong>Aberto por</strong>
                            <div>{chamado.usua_email || '—'}</div>
                        </div>
                        <div className="col-sm-4">
                            <strong>Responsável</strong>
                            <div>{chamado.func_email || '—'}</div>
                        </div>
                        <div className="col-sm-4">
                            <strong>Aberto em</strong>
                            <div>{chamado.criado_em ? new Date(chamado.criado_em).toLocaleString('pt-BR') : '—'}</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {chamado.descricao && (
                <Card className="mb-3">
                    <Card.Header><strong>Descrição</strong></Card.Header>
                    <Card.Body><pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{chamado.descricao}</pre></Card.Body>
                </Card>
            )}

            {chamado.anexos && chamado.anexos.length > 0 && (
                <Card>
                    <Card.Header><strong>Anexos ({chamado.anexos.length})</strong></Card.Header>
                    <ListGroup variant="flush">
                        {chamado.anexos.map(a => (
                            <ListGroup.Item key={a.id}>
                                <a href={a.url} target="_blank" rel="noopener noreferrer">{a.nome}</a>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default DetalheChamado;
