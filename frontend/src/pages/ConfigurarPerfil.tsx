import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../services/usuarioService';
import { useAuth } from '../contexts/AuthContext';

const ConfigurarPerfil: React.FC = () => {
    const { user } = useAuth();
    const [telegramId, setTelegramId] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const salvarNotificacoes = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.patch(`/usuarios/${user?.email}/perfil`, { telegram_id: telegramId, whatsapp });
            setSuccess('Preferências salvas com sucesso!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar.');
        } finally { setSaving(false); }
    };

    const alterarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (novaSenha !== confirmarSenha) { setError('As senhas não coincidem.'); return; }
        if (novaSenha.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
        setSaving(true);
        try {
            await api.put(`/usuarios/${user?.email}/senha`, { novaSenha });
            setSuccess('Senha alterada com sucesso!');
            setNovaSenha(''); setConfirmarSenha('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao alterar senha.');
        } finally { setSaving(false); }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <h1>Meu Perfil</h1>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            <Card className="mb-4">
                <Card.Header><strong>Notificações externas</strong></Card.Header>
                <Card.Body>
                    <Form onSubmit={salvarNotificacoes}>
                        <Form.Group className="mb-3">
                            <Form.Label>Telegram ID</Form.Label>
                            <Form.Control type="text" placeholder="Seu ID numérico do Telegram"
                                value={telegramId} onChange={e => setTelegramId(e.target.value)} />
                            <Form.Text className="text-muted">
                                Envie /start para o bot e copie seu ID.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>WhatsApp</Form.Label>
                            <Form.Control type="tel" placeholder="+5511999999999"
                                value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar preferências'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header><strong>Alterar senha</strong></Card.Header>
                <Card.Body>
                    <Form onSubmit={alterarSenha}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nova senha</Form.Label>
                            <Form.Control type="password" value={novaSenha}
                                onChange={e => setNovaSenha(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar senha</Form.Label>
                            <Form.Control type="password" value={confirmarSenha}
                                onChange={e => setConfirmarSenha(e.target.value)} required />
                        </Form.Group>
                        <Button variant="outline-primary" type="submit" disabled={saving}>
                            Alterar senha
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ConfigurarPerfil;
