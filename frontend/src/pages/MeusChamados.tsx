import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { chamadoService, Chamado, PRIORIDADES } from '../services/chamadoService';

const MeusChamados: React.FC = () => {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroColuna, setFiltroColuna] = useState('');

    const carregar = () => {
        setLoading(true);
        chamadoService.listar()
            .then(r => setChamados(r.data.data))
            .catch(() => setError('Erro ao carregar chamados.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const filtrados = filtroColuna
        ? chamados.filter(c => c.coluna_titulo === filtroColuna)
        : chamados;

    const colunas = [...new Set(chamados.map(c => c.coluna_titulo).filter(Boolean))];

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Chamados</h1>
                <Button as={Link as any} to="/chamados/novo" variant="primary">+ Abrir Chamado</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="mb-3" style={{ maxWidth: 250 }}>
                <Form.Select value={filtroColuna} onChange={e => setFiltroColuna(e.target.value)}>
                    <option value="">Todos os status</option>
                    {colunas.map(c => <option key={c} value={c!}>{c}</option>)}
                </Form.Select>
            </div>

            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : filtrados.length === 0 ? (
                <Alert variant="info">Nenhum chamado encontrado.</Alert>
            ) : (
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Setor</th>
                            <th>Status</th>
                            <th>Prioridade</th>
                            <th>Abertura</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map(c => {
                            const prio = PRIORIDADES.find(p => p.value === c.prioridade);
                            return (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.titulo}</td>
                                    <td>{c.setor_nome || '—'}</td>
                                    <td>{c.coluna_titulo
                                        ? <Badge bg="primary">{c.coluna_titulo}</Badge>
                                        : <Badge bg="secondary">Sem status</Badge>}
                                    </td>
                                    <td>
                                        {prio && prio.value > 0
                                            ? <Badge bg={prio.variant as any}>{prio.label}</Badge>
                                            : '—'}
                                    </td>
                                    <td>{c.criado_em ? new Date(c.criado_em).toLocaleDateString('pt-BR') : '—'}</td>
                                    <td>
                                        <Button as={Link as any} to={`/chamados/${c.id}`}
                                            variant="outline-primary" size="sm">Ver</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MeusChamados;
