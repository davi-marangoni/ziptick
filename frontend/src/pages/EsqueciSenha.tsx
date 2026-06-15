import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';

const EsqueciSenha: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await usuarioService.esqueciSenha(email);
            setEnviado(true);
        } catch {
            setError('Erro ao processar solicitação. Tente novamente.');
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
                        <h5 className="text-center text-muted mb-4">Recuperação de Senha</h5>

                        {enviado ? (
                            <Alert variant="success">
                                Se o e-mail estiver cadastrado, você receberá as instruções em breve.
                            </Alert>
                        ) : (
                            <>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>E-mail cadastrado</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Seu e-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                                    </Button>
                                </Form>
                            </>
                        )}

                        <div className="text-center mt-3">
                            <Link to="/login">Voltar ao login</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default EsqueciSenha;
