import api from './usuarioService';

export interface KanbanColuna {
    id: number;
    titulo: string;
    ordem: number;
    seto_id?: number;
    setor_nome?: string;
}

export const kanbanService = {
    listarColunas: (seto_id?: number, all?: boolean) =>
        api.get<{ success: boolean; data: KanbanColuna[] }>('api/kanban', { params: { seto_id, all } }),

    criarColuna: (titulo: string, ordem: number, seto_id?: number) =>
        api.post<{ success: boolean; data: KanbanColuna }>('api/kanban', { titulo, ordem, seto_id }),

    atualizarColuna: (id: number, dados: Partial<{ titulo: string; ordem: number; seto_id: number | null }>) =>
        api.put<{ success: boolean; data: KanbanColuna }>(`api/kanban/${id}`, dados),

    deletarColuna: (id: number) =>
        api.delete(`api/kanban/${id}`),

    reordenarColunas: (ordens: { id: number; ordem: number }[]) =>
        api.put('api/kanban/reordenar', { ordens }),

    moverChamado: (chamadoId: number, coka_id: number, seto_id?: number) =>
        api.put(`api/chamados/${chamadoId}`, { coka_id, ...(seto_id !== undefined && { seto_id }) }),

    atribuirFuncionario: (chamadoId: number, func_email: string) =>
        api.put(`api/chamados/${chamadoId}`, { func_email }),

    setPrioridade: (chamadoId: number, prioridade: number) =>
        api.put(`api/chamados/${chamadoId}`, { prioridade }),
};
