import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { chamadoService } from '../services/chamadoService';
import { setorService, Setor } from '../services/setorService';
import { campoService, CampoCustomizado } from '../services/campoService';

const AbrirChamado: React.FC = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [setoId, setSetoId] = useState<number | ''>('');
    const [arquivos, setArquivos] = useState<FileList | null>(null);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [campos, setCampos] = useState<CampoCustomizado[]>([]);
    const [valoresCampos, setValoresCampos] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setorService.listar().then(r => setSetores(r.data.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!setoId) { setCampos([]); return; }
        campoService.listar(setoId as number)
            .then(r => setCampos(r.data.data))
            .catch(() => setCampos([]));
    }, [setoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Valida campos obrigatórios customizados
        for (const c of campos) {
            if (c.obrigatorio && !valoresCampos[c.id]?.trim()) {
                setError(`O campo "${c.label}" é obrigatório.`);
                return;
            }
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('titulo', titulo);
            if (descricao) formData.append('descricao', descricao);
            if (setoId) formData.append('seto_id', String(setoId));
            if (arquivos) {
                Array.from(arquivos).forEach(f => formData.append('anexos', f));
            }
            // Campos customizados como JSON
            const valoresArray = Object.entries(valoresCampos).map(([id, valor]) => ({
                cacu_id: parseInt(id), valor
            }));
            if (valoresArray.length) formData.append('campos_valores', JSON.stringify(valoresArray));

            const res = await chamadoService.abrir(formData);
            navigate(`/chamados/${res.data.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao abrir chamado.');
        } finally {
            setLoading(false);
        }
    };

    const setCampoValor = (id: number, valor: string) =>
        setValoresCampos(prev => ({ ...prev, [id]: valor }));

    return (
        <Container className="py-4" style={{ maxWidth: '700px' }}>
            <h1>Abrir Chamado</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Título *</Form.Label>
                    <Form.Control
                        type="text" placeholder="Descreva brevemente o problema"
                        value={titulo} onChange={e => setTitulo(e.target.value)} required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                        as="textarea" rows={4} placeholder="Detalhes do problema"
                        value={descricao} onChange={e => setDescricao(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select value={setoId} onChange={e => setSetoId(e.target.value ? parseInt(e.target.value) : '')}>
                        <option value="">— Selecione —</option>
                        {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </Form.Select>
                </Form.Group>

                {/* Campos customizados do setor */}
                {campos.map(campo => (
                    <Form.Group key={campo.id} className="mb-3">
                        <Form.Label>{campo.label}{campo.obrigatorio && ' *'}</Form.Label>
                        {campo.tipo === 'texto' && (
                            <Form.Control type="text" value={valoresCampos[campo.id] || ''}
                                onChange={e => setCampoValor(campo.id, e.target.value)} required={campo.obrigatorio} />
                        )}
                        {campo.tipo === 'numero' && (
                            <Form.Control type="number" value={valoresCampos[campo.id] || ''}
                                onChange={e => setCampoValor(campo.id, e.target.value)} required={campo.obrigatorio} />
                        )}
                        {campo.tipo === 'data' && (
                            <Form.Control type="date" value={valoresCampos[campo.id] || ''}
                                onChange={e => setCampoValor(campo.id, e.target.value)} required={campo.obrigatorio} />
                        )}
                        {campo.tipo === 'checkbox' && (
                            <Form.Check type="checkbox" label={campo.label}
                                checked={valoresCampos[campo.id] === 'true'}
                                onChange={e => setCampoValor(campo.id, e.target.checked ? 'true' : 'false')} />
                        )}
                        {campo.tipo === 'select' && campo.opcoes && (
                            <Form.Select value={valoresCampos[campo.id] || ''}
                                onChange={e => setCampoValor(campo.id, e.target.value)} required={campo.obrigatorio}>
                                <option value="">— Selecione —</option>
                                {(JSON.parse(campo.opcoes) as string[]).map((op: string) => (
                                    <option key={op} value={op}>{op}</option>
                                ))}
                            </Form.Select>
                        )}
                    </Form.Group>
                ))}

                <Form.Group className="mb-3">
                    <Form.Label>Anexos (máx. 10 arquivos, 10 MB cada)</Form.Label>
                    <Form.Control type="file" multiple
                        onChange={e => setArquivos((e.target as HTMLInputElement).files)} />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Enviando...' : 'Abrir Chamado'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/chamados')}>Cancelar</Button>
                </div>
            </Form>
        </Container>
    );
};

export default AbrirChamado;
