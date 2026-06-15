import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';

const RedefinirSenha: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') ?? '';

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (novaSenha !== confirmSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        if (novaSenha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (!token) {
            setError('Token inválido. Solicite um novo link de recuperação.');
            return;
        }

        setLoading(true);
        try {
            await usuarioService.redefinirSenha(token, novaSenha);
            navigate('/login', { state: { mensagem: 'Senha redefinida com sucesso! Faça login.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Token inválido ou expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="login-container">
            <div className="login-wrapper">
                <Card className="login-card">
                    <Card.Body>
                        <h1 className="text-center mb-2">ZipTick</h1>
                        <h5 className="text-center text-muted mb-4">Nova Senha</h5>

                        {!token && (
                            <Alert variant="danger">
                                Link inválido. <Link to="/esqueci-senha">Solicite um novo</Link>.
                            </Alert>
                        )}

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repita a nova senha"
                                    value={confirmSenha}
                                    onChange={(e) => setConfirmSenha(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading || !token}
                            >
                                {loading ? 'Salvando...' : 'Redefinir senha'}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <Link to="/login">Voltar ao login</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default RedefinirSenha;
