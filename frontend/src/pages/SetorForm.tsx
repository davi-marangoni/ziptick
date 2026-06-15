import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { setorService } from '../services/setorService';

const SetorForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('#6b7280');
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(isEditing);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEditing) return;
        setorService.listar()
            .then(res => {
                const setor = res.data.data.find(s => s.id === parseInt(id!, 10));
                if (setor) {
                    setNome(setor.nome);
                    if (setor.cor) setCor(setor.cor);
                } else {
                    setError('Setor não encontrado.');
                }
            })
            .catch(() => setError('Erro ao carregar setor.'))
            .finally(() => setLoadingDados(false));
    }, [id, isEditing]);

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        if (!nome.trim()) {
            setError('Nome do setor é obrigatório.');
            return;
        }
        setLoading(true);
        try {
            if (isEditing) {
                await setorService.atualizar(parseInt(id!, 10), nome, cor);
            } else {
                await setorService.criar(nome, cor);
            }
            navigate('/setores');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar setor.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingDados) return <Container className="py-4"><p>Carregando...</p></Container>;

    return (
        <Container className="py-4" style={{ maxWidth: '500px' }}>
            <h1>{isEditing ? 'Editar Setor' : 'Novo Setor'}</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome do setor</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: Suporte, TI, Financeiro..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Cor de identificação</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                        <input
                            type="color"
                            value={cor}
                            onChange={(e) => setCor(e.target.value)}
                            style={{
                                width: 48,
                                height: 38,
                                border: '1px solid #dee2e6',
                                borderRadius: 6,
                                padding: 2,
                                cursor: 'pointer',
                                background: 'none',
                            }}
                        />
                        <div
                            style={{
                                padding: '6px 14px',
                                borderRadius: 6,
                                background: `${cor}22`,
                                border: `1.5px solid ${cor}`,
                                color: cor,
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: 0.3,
                            }}
                        >
                            {nome || 'Pré-visualização'}
                        </div>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{cor}</span>
                    </div>
                    <Form.Text className="text-muted">
                        Esta cor identifica o setor no quadro Kanban.
                    </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/setores')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default SetorForm;
