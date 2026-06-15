import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap';
import { campoService, CampoCustomizado } from '../services/campoService';
import { setorService, Setor } from '../services/setorService';

const TIPOS = ['texto', 'numero', 'data', 'select', 'checkbox'];

const ConfigurarCampos: React.FC = () => {
    const [campos, setCampos] = useState<CampoCustomizado[]>([]);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [setoFiltro, setSetoFiltro] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [editando, setEditando] = useState<CampoCustomizado | null>(null);
    const [form, setForm] = useState({ label: '', tipo: 'texto', obrigatorio: false, seto_id: '', ordem: '0', opcoes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setorService.listar().then(r => setSetores(r.data.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!setoFiltro) { setCampos([]); return; }
        setLoading(true);
        campoService.listar(setoFiltro as number)
            .then(r => setCampos(r.data.data))
            .catch(() => setError('Erro ao carregar campos.'))
            .finally(() => setLoading(false));
    }, [setoFiltro]);

    const abrirModal = (campo?: CampoCustomizado) => {
        setEditando(campo || null);
        setForm({
            label: campo?.label || '',
            tipo: campo?.tipo || 'texto',
            obrigatorio: campo?.obrigatorio || false,
            seto_id: String(campo?.seto_id || setoFiltro || ''),
            ordem: String(campo?.ordem || 0),
            opcoes: campo?.opcoes ? JSON.parse(campo.opcoes).join('\n') : '',
        });
        setShow(true);
    };

    const salvar = async () => {
        if (!form.label.trim() || !form.seto_id) return;
        setSaving(true);
        const opcoes = form.tipo === 'select' && form.opcoes
            ? form.opcoes.split('\n').map(o => o.trim()).filter(Boolean)
            : undefined;
        try {
            if (editando) {
                await campoService.atualizar(editando.id, {
                    label: form.label, tipo: form.tipo as any,
                    obrigatorio: form.obrigatorio,
                    ordem: parseInt(form.ordem),
                    opcoes: opcoes ? JSON.stringify(opcoes) : undefined,
                });
            } else {
                await campoService.criar({
                    label: form.label, tipo: form.tipo as any,
                    obrigatorio: form.obrigatorio,
                    seto_id: parseInt(form.seto_id),
                    ordem: parseInt(form.ordem),
                    opcoes,
                });
            }
            setShow(false);
            if (setoFiltro) {
                campoService.listar(setoFiltro as number).then(r => setCampos(r.data.data));
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar.');
        } finally { setSaving(false); }
    };

    const deletar = async (id: number) => {
        if (!confirm('Remover campo? Os valores existentes serão apagados.')) return;
        await campoService.deletar(id);
        if (setoFiltro) campoService.listar(setoFiltro as number).then(r => setCampos(r.data.data));
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Campos Customizados</h1>
                <Button variant="primary" onClick={() => abrirModal()} disabled={!setoFiltro}>+ Novo Campo</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="mb-3" style={{ maxWidth: 280 }}>
                <Form.Select value={setoFiltro} onChange={e => setSetoFiltro(e.target.value ? parseInt(e.target.value) : '')}>
                    <option value="">Selecione um setor</option>
                    {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </Form.Select>
            </div>

            {loading ? <Spinner animation="border" /> : campos.length === 0 && setoFiltro ? (
                <Alert variant="info">Nenhum campo cadastrado para este setor.</Alert>
            ) : (
                <Table striped hover responsive>
                    <thead><tr><th>Label</th><th>Tipo</th><th>Obrigatório</th><th>Ordem</th><th></th></tr></thead>
                    <tbody>
                        {campos.map(c => (
                            <tr key={c.id}>
                                <td>{c.label}</td>
                                <td><Badge bg="secondary">{c.tipo}</Badge></td>
                                <td>{c.obrigatorio ? '✓' : '—'}</td>
                                <td>{c.ordem}</td>
                                <td className="text-end">
                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => abrirModal(c)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => deletar(c.id)}>Remover</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Campo' : 'Novo Campo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Label *</Form.Label>
                        <Form.Control value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                        </Form.Select>
                    </Form.Group>
                    {form.tipo === 'select' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Opções (uma por linha)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={form.opcoes}
                                onChange={e => setForm(p => ({ ...p, opcoes: e.target.value }))} />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Ordem</Form.Label>
                        <Form.Control type="number" value={form.ordem}
                            onChange={e => setForm(p => ({ ...p, ordem: e.target.value }))} />
                    </Form.Group>
                    <Form.Check type="checkbox" label="Obrigatório" checked={form.obrigatorio}
                        onChange={e => setForm(p => ({ ...p, obrigatorio: e.target.checked }))} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={salvar} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ConfigurarCampos;
