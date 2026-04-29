import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordEditForm: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (novaSenha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        if (novaSenha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await axios.put(`http://localhost:3000/api/usuarios/${email}/senha`, {
                novaSenha
            });
            setSuccess('Senha atualizada com sucesso!');
            setTimeout(() => navigate('/usuarios'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '500px' }}>
            <h1>Editar Senha - {email}</h1>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirmar Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirme a senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Atualizar Senha'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/usuarios')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default PasswordEditForm;
