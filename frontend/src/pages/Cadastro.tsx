import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import '../styles/login.css';

const GridIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="14" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="1" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.85" />
        <rect x="14" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" />
    </svg>
);

const Cadastro: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
    const [aceitou, setAceitou] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        if (form.senha !== form.confirmar) { setError('As senhas não coincidem.'); return; }
        if (form.senha.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
        if (!aceitou) { setError('Você deve aceitar os termos de uso para continuar.'); return; }
        setLoading(true);
        try {
            await usuarioService.cadastrarPublico(form.email, form.senha, form.nome, aceitou);
            navigate('/login', { state: { mensagem: 'Cadastro realizado! Faça login para continuar.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                {/* Logo */}
                <div className="login-logo-wrap">
                    <div className="login-logo-icon"><GridIcon /></div>
                    <span className="login-logo-name">ZipTick</span>
                </div>

                <div className="login-card">
                    <h2 className="login-title">Criar conta</h2>
                    <p className="login-subtitle">Preencha os dados para se cadastrar</p>

                    {error && <div className="login-error">{error}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <label className="login-label">Nome completo</label>
                            <Form.Control
                                className="login-input"
                                type="text"
                                placeholder="Seu nome"
                                value={form.nome}
                                onChange={set('nome')}
                                required
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <label className="login-label">E-mail</label>
                            <Form.Control
                                className="login-input"
                                type="email"
                                placeholder="seu@email.com"
                                value={form.email}
                                onChange={set('email')}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <label className="login-label">Senha</label>
                            <Form.Control
                                className="login-input"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={form.senha}
                                onChange={set('senha')}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <label className="login-label">Confirmar senha</label>
                            <Form.Control
                                className="login-input"
                                type="password"
                                placeholder="Repita a senha"
                                value={form.confirmar}
                                onChange={set('confirmar')}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="login-check-row">
                                <input
                                    type="checkbox"
                                    id="termos"
                                    checked={aceitou}
                                    onChange={e => setAceitou(e.target.checked)}
                                    className="login-check"
                                />
                                <label htmlFor="termos" className="login-check-label">
                                    Li e aceito os{' '}
                                    <Link to="/termos" target="_blank" className="login-link">
                                        Termos de Uso
                                    </Link>
                                </label>
                            </div>
                        </Form.Group>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Criar conta'}
                        </button>
                    </Form>

                    <p className="login-footer">
                        Já tem conta?{' '}
                        <Link to="/login" className="login-link">Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
