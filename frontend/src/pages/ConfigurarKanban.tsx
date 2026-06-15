import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { kanbanService, KanbanColuna } from '../services/kanbanService';
import { setorService, Setor } from '../services/setorService';

/* ── helpers ── */

const sectionStyle = (cor?: string): React.CSSProperties => ({
    border: `1.5px solid ${cor || '#e5e7eb'}`,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
});

const headerStyle = (cor?: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 16px',
    background: cor ? `${cor}18` : '#f9fafb',
    borderBottom: `2px solid ${cor || '#e5e7eb'}`,
});

const rowStyle = (isDragging: boolean, cor?: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    background: isDragging ? '#f0f4ff' : '#fff',
    borderBottom: '1px solid #f3f4f6',
    borderLeft: cor ? `3px solid ${cor}` : '3px solid transparent',
    transition: 'background 0.1s',
});

/* ── component ── */

const ConfigurarKanban: React.FC = () => {
    const [colunas, setColunas] = useState<KanbanColuna[]>([]);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [show, setShow] = useState(false);
    const [editando, setEditando] = useState<KanbanColuna | null>(null);
    const [form, setForm] = useState({ titulo: '', seto_id: '' });
    const [saving, setSaving] = useState(false);

    const carregar = async () => {
        try {
            const [ko, st] = await Promise.all([
                kanbanService.listarColunas(undefined, true),
                setorService.listar(),
            ]);
            setColunas(ko.data.data);
            setSetores(st.data.data);
        } catch {
            setError('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregar(); }, []);

    /* Filtragem por seção */
    const globalCols = colunas.filter(c => !c.seto_id);
    const setorCols = (setoId: number) => colunas.filter(c => c.seto_id === setoId);

    /* Modal */
    const abrirModal = (coluna?: KanbanColuna, setoIdPrefill?: number) => {
        setEditando(coluna ?? null);
        setForm({
            titulo: coluna?.titulo ?? '',
            seto_id: String(coluna?.seto_id ?? setoIdPrefill ?? ''),
        });
        setShow(true);
    };

    const salvar = async () => {
        if (!form.titulo.trim()) return;
        setSaving(true);
        try {
            const setoIdVal = form.seto_id ? parseInt(form.seto_id) : undefined;
            if (editando) {
                await kanbanService.atualizarColuna(editando.id, {
                    titulo: form.titulo,
                    seto_id: setoIdVal ?? null,
                });
            } else {
                await kanbanService.criarColuna(form.titulo, colunas.length + 1, setoIdVal);
            }
            setShow(false);
            carregar();
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    const deletar = async (id: number) => {
        if (!window.confirm('Remover coluna? Os chamados perderão o vínculo.')) return;
        try {
            await kanbanService.deletarColuna(id);
            carregar();
        } catch {
            setError('Erro ao remover coluna.');
        }
    };

    /* Drag & drop */
    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        const colId = parseInt(draggableId, 10);

        if (source.droppableId !== destination.droppableId) {
            // Mudança de seção → atualiza seto_id da coluna
            const novoSeto = destination.droppableId === 'global'
                ? null
                : parseInt(destination.droppableId.replace('setor-', ''), 10);
            await kanbanService.atualizarColuna(colId, { seto_id: novoSeto });
            await carregar();
            return;
        }

        // Mesma seção → reordena
        const grupo = source.droppableId === 'global'
            ? Array.from(globalCols)
            : Array.from(setorCols(parseInt(source.droppableId.replace('setor-', ''), 10)));

        const [moved] = grupo.splice(source.index, 1);
        grupo.splice(destination.index, 0, moved);
        setColunas(prev => {
            const restantes = prev.filter(c =>
                source.droppableId === 'global' ? c.seto_id : c.seto_id !== moved.seto_id
            );
            return [...restantes, ...grupo];
        });
        await kanbanService.reordenarColunas(grupo.map((c, i) => ({ id: c.id, ordem: i + 1 })));
    };

    /* Render de uma seção */
    const renderSecao = (
        sectionId: string,
        cols: KanbanColuna[],
        label: string,
        cor?: string,
        setoIdPrefill?: number,
    ) => (
        <div key={sectionId} style={sectionStyle(cor)}>
            {/* Cabeçalho da seção */}
            <div style={headerStyle(cor)}>
                {cor && (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: cor, flexShrink: 0 }} />
                )}
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1, letterSpacing: -0.2 }}>{label}</span>
                <span style={{ fontSize: 12, color: '#6b7280', marginRight: 8 }}>
                    {cols.length} {cols.length === 1 ? 'coluna' : 'colunas'}
                </span>
                <Button size="sm" variant="outline-primary" onClick={() => abrirModal(undefined, setoIdPrefill)}>
                    + Coluna
                </Button>
            </div>

            {/* Lista de colunas com drag */}
            <Droppable droppableId={sectionId}>
                {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 40 }}>
                        {cols.length === 0 && (
                            <div style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
                                Nenhuma coluna — clique em "+ Coluna" para adicionar.
                            </div>
                        )}
                        {cols.map((c, i) => (
                            <Draggable key={c.id} draggableId={String(c.id)} index={i}>
                                {(drag, snap) => (
                                    <div
                                        ref={drag.innerRef}
                                        {...drag.draggableProps}
                                        style={{ ...rowStyle(snap.isDragging, cor), ...drag.draggableProps.style }}
                                    >
                                        {/* Handle */}
                                        <span
                                            {...drag.dragHandleProps}
                                            style={{ fontSize: 18, color: '#d1d5db', cursor: 'grab', flexShrink: 0 }}
                                            title="Arrastar para reordenar"
                                        >
                                            ⠿
                                        </span>

                                        {/* Título */}
                                        <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{c.titulo}</span>

                                        {/* Ordem */}
                                        <span style={{ fontSize: 12, color: '#9ca3af', width: 32, textAlign: 'center' }}>
                                            {c.ordem}
                                        </span>

                                        {/* Ações */}
                                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                            <Button variant="outline-secondary" size="sm" onClick={() => abrirModal(c)}>
                                                Editar
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => deletar(c.id)}>
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-0">Configurar Kanban</h1>
                    <p className="text-muted mb-0" style={{ fontSize: 13, marginTop: 4 }}>
                        Arraste para reordenar. Arraste entre seções para mover uma coluna de setor.
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                {/* Seção global */}
                {renderSecao('global', globalCols, 'Global — compartilhada por todos os setores')}

                {/* Uma seção por setor */}
                {setores.map(setor =>
                    renderSecao(`setor-${setor.id}`, setorCols(setor.id), setor.nome, setor.cor, setor.id)
                )}
            </DragDropContext>

            {/* Modal criar / editar */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Coluna' : 'Nova Coluna'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Título <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            autoFocus
                            value={form.titulo}
                            onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && salvar()}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Setor <span className="text-muted" style={{ fontWeight: 400 }}>(vazio = global)</span></Form.Label>
                        <Form.Select
                            value={form.seto_id}
                            onChange={e => setForm(p => ({ ...p, seto_id: e.target.value }))}
                        >
                            <option value="">Global (todos os setores)</option>
                            {setores.map(s => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={salvar} disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ConfigurarKanban;
