export interface Chamado {
    id: number;
    titulo: string;
    descricao?: string;
    prioridade: number; // 0=sem 1=baixa 2=média 3=alta
    usua_email?: string;
    seto_id?: number;
    setor_nome?: string;
    func_email?: string;
    coka_id?: number;
    coluna_titulo?: string;
    criado_em?: Date;
    atualizado_em?: Date;
    anexos?: Anexo[];
}

export interface Anexo {
    id: number;
    cham_id: number;
    nome: string;
    url: string;
    criado_em?: Date;
}
