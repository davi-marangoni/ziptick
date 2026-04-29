import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState(2);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/usuarios/register', {
                email,
                senha,
                tipo
            });
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="usuario@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tipo de Usuário</Form.Label>
                    <Form.Select
                        value={tipo}
                        onChange={(e) => setTipo(parseInt(e.target.value))}
                    >
                        <option value={1}>Administrador</option>
                        <option value={2}>Usuário Comum</option>
                    </Form.Select>
                </Form.Group>

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
