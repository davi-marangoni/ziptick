import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import { setorService, Setor } from '../services/setorService';

const TIPOS = [
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Gerência' },
    { value: 3, label: 'Funcionário' },
    { value: 4, label: 'Usuário externo' },
];

const UserForm: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', senha: '', nome: '', cargo: '' });
    const [tipo, setTipo] = useState(3);
    const [setoId, setSetoId] = useState<number | ''>('');
    const [setores, setSetores] = useState<Setor[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setorService.listar()
            .then(res => setSetores(res.data.data))
            .catch(() => { /* sem setores cadastrados ainda */ });
    }, []);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await usuarioService.createUsuario(
                form.email,
                form.senha,
                tipo,
                form.nome || undefined,
                setoId !== '' ? setoId : undefined,
                form.cargo || undefined
            );
            navigate('/usuarios');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar usuário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '500px' }}>
            <h1>Novo Usuário</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome completo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome do usuário"
                        value={form.nome}
                        onChange={set('nome')}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="usuario@example.com"
                        value={form.email}
                        onChange={set('email')}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={form.senha}
                        onChange={set('senha')}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Perfil de acesso</Form.Label>
                    <Form.Select
                        value={tipo}
                        onChange={(e) => setTipo(parseInt(e.target.value))}
                    >
                        {TIPOS.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {tipo <= 3 && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Cargo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Analista, Coordenador..."
                                value={form.cargo}
                                onChange={set('cargo')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Setor</Form.Label>
                            <Form.Select
                                value={setoId}
                                onChange={(e) => setSetoId(e.target.value ? parseInt(e.target.value) : '')}
                            >
                                <option value="">— Sem setor —</option>
                                {setores.map(s => (
                                    <option key={s.id} value={s.id}>{s.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/usuarios')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserForm;
