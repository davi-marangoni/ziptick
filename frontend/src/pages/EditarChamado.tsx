import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { chamadoService, PRIORIDADES } from '../services/chamadoService';
import { setorService, Setor } from '../services/setorService';
import { kanbanService, KanbanColuna } from '../services/kanbanService';
import { usuarioService } from '../services/usuarioService';

const EditarChamado: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState({ titulo: '', descricao: '', func_email: '' });
    const [setoId, setSetoId] = useState<number | ''>('');
    const [prioridade, setPrioridade] = useState(0);
    const [cokaId, setCokaId] = useState<number | ''>('');
    const [setores, setSetores] = useState<Setor[]>([]);
    const [colunas, setColunas] = useState<KanbanColuna[]>([]);
    const [funcionarios, setFuncionarios] = useState<{ email: string; nome?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const initialLoaded = React.useRef(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            chamadoService.buscarPorId(parseInt(id)),
            setorService.listar(),
            usuarioService.getUsuarios(),
        ]).then(([ch, st, us]) => {
            const c = ch.data.data;
            const setor = c.seto_id || undefined;
            setForm({ titulo: c.titulo, descricao: c.descricao || '', func_email: c.func_email || '' });
            setSetoId(c.seto_id || '');
            setPrioridade(c.prioridade);
            setCokaId(c.coka_id || '');
            setSetores(st.data.data);
            setFuncionarios(us.data.data.filter((u: any) => u.tipo <= 3));
            return kanbanService.listarColunas(setor);
        }).then(ko => {
            setColunas(ko.data.data);
            initialLoaded.current = true;
        }).catch(() => setError('Erro ao carregar dados.'))
          .finally(() => setLoading(false));
    }, [id]);

    // Recarrega colunas compatíveis quando o setor muda
    useEffect(() => {
        if (!initialLoaded.current) return;
        const setor = setoId !== '' ? setoId as number : undefined;
        kanbanService.listarColunas(setor)
            .then(r => setColunas(r.data.data))
            .catch(() => {});
        setCokaId('');
    }, [setoId]);

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        if (!id) return;
        setSaving(true);
        try {
            await chamadoService.atualizar(parseInt(id), {
                titulo: form.titulo,
                descricao: form.descricao || undefined,
                seto_id: setoId !== '' ? setoId : undefined,
                prioridade,
                func_email: form.func_email || undefined,
                coka_id: cokaId !== '' ? cokaId : undefined,
            });
            navigate(`/chamados/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <h1>Editar Chamado #{id}</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Título *</Form.Label>
                    <Form.Control type="text" value={form.titulo} required
                        onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={3} value={form.descricao}
                        onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select value={setoId} onChange={e => setSetoId(e.target.value ? parseInt(e.target.value) : '')}>
                        <option value="">— Sem setor —</option>
                        {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Coluna Kanban</Form.Label>
                    <Form.Select value={cokaId} onChange={e => setCokaId(e.target.value ? parseInt(e.target.value) : '')}>
                        <option value="">— Sem coluna —</option>
                        {colunas.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prioridade</Form.Label>
                    <Form.Select value={prioridade} onChange={e => setPrioridade(parseInt(e.target.value))}>
                        {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Responsável</Form.Label>
                    <Form.Select value={form.func_email} onChange={e => setForm(p => ({ ...p, func_email: e.target.value }))}>
                        <option value="">— Sem responsável —</option>
                        {funcionarios.map((f: any) => (
                            <option key={f.email} value={f.email}>{f.nome || f.email}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/chamados/${id}`)}>Cancelar</Button>
                </div>
            </Form>
        </Container>
    );
};

export default EditarChamado;
