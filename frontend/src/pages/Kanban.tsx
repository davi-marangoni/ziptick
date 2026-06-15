import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { chamadoService, Chamado } from '../services/chamadoService';
import { kanbanService, KanbanColuna } from '../services/kanbanService';
import { setorService, Setor } from '../services/setorService';
import { useAuth } from '../contexts/AuthContext';
import { useLayout } from '../contexts/LayoutContext';
import '../styles/kanban.css';

/* ── helpers ── */

const COL_COLORS: Record<string, string> = {
    'Triagem': '#f97316',
    'Aberto': '#f97316',
    'Em Andamento': '#3b82f6',
    'Em Progresso': '#3b82f6',
    'Em Análise': '#8b5cf6',
    'Aguardando': '#f59e0b',
    'Backlog': '#9ca3af',
    'Code Review': '#8b5cf6',
    'Deploy': '#14b8a6',
    'Concluído': '#22c55e',
    'Aprovado': '#22c55e',
    'Briefing': '#9ca3af',
    'Prototipagem': '#06b6d4',
    'Em Criação': '#3b82f6',
    'Revisão Cliente': '#f59e0b',
};

function colColor(titulo: string): string {
    return COL_COLORS[titulo] ?? '#9ca3af';
}

function timeAgo(iso?: string): string {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'agora';
    if (m < 60) return `${m}min atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
}

function initials(email?: string): string {
    if (!email) return '?';
    const [local] = email.split('@');
    return local
        .split('.')
        .map(p => p[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2);
}

/* ── component ── */

const Kanban: React.FC = () => {
    const { isAdmin } = useAuth();
    const { setHeaderExtra } = useLayout();

    const [colunas, setColunas] = useState<KanbanColuna[]>([]);
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [setoFiltro, setSetorFiltro] = useState<number | ''>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* Modal */
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [setoId, setSetoId] = useState<number | ''>('');
    const [files, setFiles] = useState<FileList | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Admin sem filtro de setor → carrega todas as colunas de todos os setores
    const adminVerTodos = isAdmin && setoFiltro === '';

    const carregar = async (seto?: number | '', verTodos?: boolean) => {
        try {
            const [koRes, chRes] = await Promise.all([
                kanbanService.listarColunas(seto ? seto as number : undefined, verTodos),
                chamadoService.listar(seto ? { seto_id: seto as number } : undefined),
            ]);
            setColunas(koRes.data.data);
            setChamados(chRes.data.data);
        } catch {
            setError('Erro ao carregar o quadro.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar(setoFiltro, adminVerTodos);
        setorService.listar().then(r => setSetores(r.data.data)).catch(() => {});
    }, [setoFiltro, adminVerTodos]);

    /* Inject sector filter + open button into AppHeader */
    useEffect(() => {
        setHeaderExtra(
            <>
                <select
                    className="header-sector-select"
                    value={setoFiltro}
                    onChange={e => setSetorFiltro(e.target.value === '' ? '' : Number(e.target.value))}
                >
                    <option value="">Todos os setores</option>
                    {setores.map(s => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                </select>
                <button className="header-btn-primary" onClick={() => setModalOpen(true)}>
                    + Abrir chamado
                </button>
            </>
        );
        return () => setHeaderExtra(null);
    }, [setores, setoFiltro]);

    /* Drag & drop — droppableId is "cokaId" (flat) or "setoId_cokaId" (admin sector view) */
    const onDragEnd = async ({ draggableId, destination }: DropResult) => {
        if (!destination) return;
        const cid = parseInt(draggableId, 10);
        const parts = destination.droppableId.split('_');
        const isAdminDrop = parts.length === 2;
        const novaCoka = parseInt(isAdminDrop ? parts[1] : parts[0], 10);
        const novoSeto = isAdminDrop ? parseInt(parts[0], 10) : undefined;

        setChamados(prev => prev.map(c =>
            c.id === cid
                ? { ...c, coka_id: novaCoka, ...(novoSeto !== undefined && { seto_id: novoSeto }) }
                : c
        ));
        try {
            await kanbanService.moverChamado(cid, novaCoka, novoSeto);
        } catch {
            carregar(setoFiltro, adminVerTodos);
        }
    };

    /* Create ticket */
    const handleCreate = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        if (!titulo.trim() || !setoId) { setModalError('Preencha título e setor.'); return; }
        setSaving(true);
        setModalError('');
        try {
            const fd = new FormData();
            fd.append('titulo', titulo.trim());
            fd.append('descricao', descricao.trim());
            fd.append('seto_id', String(setoId));
            if (files) Array.from(files).forEach(f => fd.append('anexos', f));
            await chamadoService.abrir(fd);
            setModalOpen(false);
            setTitulo(''); setDescricao(''); setSetoId(''); setFiles(null);
            if (fileRef.current) fileRef.current.value = '';
            await carregar(setoFiltro);
        } catch (err: any) {
            setModalError(err.response?.data?.message || 'Erro ao criar chamado.');
        } finally {
            setSaving(false);
        }
    };

    /* ── render helpers ── */

    const renderCard = (c: Chamado, idx: number) => (
        <Draggable key={c.id} draggableId={String(c.id)} index={idx}>
            {(drag, snap) => (
                <div
                    ref={drag.innerRef}
                    {...drag.draggableProps}
                    {...drag.dragHandleProps}
                    className={`kb-card${snap.isDragging ? ' dragging' : ''}`}
                    style={drag.draggableProps.style}
                >
                    <div className="kb-card-top">
                        <Link to={`/chamados/${c.id}`} className="kb-card-id">CH-{c.id}</Link>
                        {c.setor_nome && <span className="kb-card-sector">{c.setor_nome}</span>}
                    </div>
                    <Link to={`/chamados/${c.id}`} className="kb-card-title">{c.titulo}</Link>
                    {c.descricao && <p className="kb-card-desc">{c.descricao}</p>}
                    <div className="kb-card-footer">
                        {c.func_email ? (
                            <span className="kb-card-assignee" title={c.func_email}>
                                <span className="kb-avatar">{initials(c.func_email)}</span>
                                <span className="kb-assignee-name">{c.func_email.split('@')[0]}</span>
                            </span>
                        ) : <span />}
                        <span className="kb-card-time">{timeAgo(c.criado_em)}</span>
                    </div>
                </div>
            )}
        </Draggable>
    );

    const renderColumn = (coluna: KanbanColuna, cards: Chamado[], droppableId: string, dropBg?: string) => {
        const cor = colColor(coluna.titulo);
        return (
            <div key={droppableId} className="kb-column">
                <div className="kb-col-header">
                    <span className="kb-col-dot" style={{ background: cor }} />
                    <span className="kb-col-title">{coluna.titulo}</span>
                    <span className="kb-col-count">{cards.length}</span>
                </div>
                <Droppable droppableId={droppableId}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`kb-drop-zone${snapshot.isDraggingOver ? ' over' : ''}`}
                            style={!snapshot.isDraggingOver && dropBg ? { background: dropBg } : undefined}
                        >
                            {cards.length === 0 && !snapshot.isDraggingOver && (
                                <div className="kb-empty">Solte aqui</div>
                            )}
                            {cards.map((c, idx) => renderCard(c, idx))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    /* Columns for a sector in admin view:
       - if sector has specific columns → use those
       - otherwise → use global columns (seto_id null) */
    const getSectorColunas = (setor: Setor): KanbanColuna[] => {
        const specific = colunas.filter(c => c.seto_id === setor.id);
        return specific.length > 0 ? specific : colunas.filter(c => !c.seto_id);
    };

    const totalVisiveis = chamados.length;

    if (loading) {
        return (
            <div className="kanban-loading">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="kanban-page">
            {/* Page title bar */}
            <div className="kanban-title-bar">
                <div>
                    <h1 className="kanban-title">Quadro de chamados</h1>
                    <p className="kanban-subtitle">Arraste os cards entre as colunas para atualizar o status.</p>
                </div>
                {totalVisiveis > 0 && (
                    <span className="kanban-count">
                        {totalVisiveis} chamado{totalVisiveis !== 1 ? 's' : ''} visíve{totalVisiveis !== 1 ? 'is' : 'l'}
                    </span>
                )}
            </div>

            {error && <Alert variant="danger" className="mx-4 mb-0">{error}</Alert>}

            <DragDropContext onDragEnd={onDragEnd}>
                {adminVerTodos ? (
                    /* ── Admin view: sector boxes ── */
                    <div className="kanban-board admin-sectors">
                        {setores.map(setor => {
                            const cor = setor.cor || '#6b7280';
                            const sectorCols = getSectorColunas(setor);
                            const sectorChamados = chamados.filter(c => c.seto_id === setor.id);

                            return (
                                <div key={setor.id} className="kb-sector-box">
                                    <div
                                        className="kb-sector-box-header"
                                        style={{
                                            background: `${cor}18`,
                                            borderBottom: `2px solid ${cor}`,
                                        }}
                                    >
                                        <span className="kb-sector-box-dot" style={{ background: cor }} />
                                        <span className="kb-sector-box-name">{setor.nome}</span>
                                        <span className="kb-sector-box-count">
                                            {sectorChamados.length} chamado{sectorChamados.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="kb-sector-columns">
                                        {sectorCols.length === 0 ? (
                                            <div className="kb-sector-empty">Nenhuma coluna configurada</div>
                                        ) : (
                                            sectorCols.map(coluna => {
                                                const droppableId = `${setor.id}_${coluna.id}`;
                                                const cards = sectorChamados.filter(c => c.coka_id === coluna.id);
                                                return renderColumn(coluna, cards, droppableId, `${cor}0a`);
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Regular flat board ── */
                    <div className="kanban-board">
                        {colunas.map(coluna => {
                            const cards = chamados.filter(c => c.coka_id === coluna.id);
                            return renderColumn(coluna, cards, String(coluna.id));
                        })}
                    </div>
                )}
            </DragDropContext>

            {/* ── Modal: Novo chamado ── */}
            <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Novo chamado</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreate}>
                    <Modal.Body>
                        {modalError && <Alert variant="danger">{modalError}</Alert>}
                        <p className="text-muted mb-3" style={{ fontSize: 14 }}>
                            Descreva seu problema. A equipe responsável será notificada.
                        </p>

                        <Form.Group className="mb-3">
                            <Form.Label>Título <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                placeholder="Ex.: Não consigo acessar o sistema X"
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                                required
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Setor <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={setoId}
                                onChange={e => setSetoId(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            >
                                <option value="">Selecione o setor responsável</option>
                                {setores.map(s => (
                                    <option key={s.id} value={s.id}>{s.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descrição <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="O que aconteceu? Quando começou? Já tentou alguma solução?"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Anexos</Form.Label>
                            <div className="kb-file-drop" onClick={() => fileRef.current?.click()}>
                                <span className="kb-file-icon">📎</span>
                                <span>
                                    {files && files.length > 0
                                        ? `${files.length} arquivo(s) selecionado(s)`
                                        : 'Clique para anexar (PNG, JPG, PDF, TXT — até 10 MB)'}
                                </span>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                multiple
                                accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx"
                                style={{ display: 'none' }}
                                onChange={e => setFiles(e.target.files)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Criando...' : 'Criar chamado'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Kanban;
