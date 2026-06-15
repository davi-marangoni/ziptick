export interface KanbanColuna {
    id: number;
    titulo: string;
    ordem: number;
    seto_id?: number;
    setor_nome?: string;
    criado_em?: Date;
}
