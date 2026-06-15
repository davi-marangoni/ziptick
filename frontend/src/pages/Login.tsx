import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

const GridIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="14" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="1" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="14" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" />
    </svg>
);

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, senha);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'E-mail ou senha incorretos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-logo">
                    <div className="login-logo-icon"><GridIcon /></div>
                    <span className="login-logo-name">ZipTick</span>
                    <span className="login-logo-tagline">Atendimento transparente, do chamado à resolução</span>
                </div>
                <div className="login-card">
                    <h2>Entrar</h2>

                    {error && (
                        <div className="login-error">{error}</div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </Form>
                </div>

                <div className="login-links">
                    <a href="/esqueci-senha">Esqueci minha senha</a>
                    <a href="/cadastro">Não tem conta? Cadastre-se</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
