import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { setorService, Setor } from '../services/setorService';

const Setores: React.FC = () => {
    const [setores, setSetores] = useState<Setor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletando, setDeletando] = useState<number | null>(null);

    const carregar = () => {
        setLoading(true);
        setorService.listar()
            .then(res => setSetores(res.data.data))
            .catch(() => setError('Erro ao carregar setores.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const handleDeletar = async (setor: Setor) => {
        if (!confirm(`Remover o setor "${setor.nome}"?`)) return;
        setDeletando(setor.id);
        try {
            await setorService.deletar(setor.id);
            setSetores(prev => prev.filter(s => s.id !== setor.id));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao remover setor.');
        } finally {
            setDeletando(null);
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Setores</h1>
                <Button as={Link as any} to="/setores/novo" variant="primary">
                    + Novo Setor
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : setores.length === 0 ? (
                <Alert variant="info">Nenhum setor cadastrado.</Alert>
            ) : (
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Criado em</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {setores.map(setor => (
                            <tr key={setor.id}>
                                <td>{setor.id}</td>
                                <td>{setor.nome}</td>
                                <td>{setor.criado_em ? new Date(setor.criado_em).toLocaleDateString('pt-BR') : '—'}</td>
                                <td className="text-end">
                                    <Button
                                        as={Link as any}
                                        to={`/setores/editar/${setor.id}`}
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-2"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeletar(setor)}
                                        disabled={deletando === setor.id}
                                    >
                                        {deletando === setor.id ? '...' : 'Remover'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Setores;
