import api from './usuarioService';
import { Setor } from './setorService';

export interface Chamado {
    id: number;
    titulo: string;
    descricao?: string;
    prioridade: number;
    usua_email?: string;
    func_email?: string;
    seto_id?: number;
    setor_nome?: string;
    coka_id?: number;
    coluna_titulo?: string;
    criado_em?: string;
    atualizado_em?: string;
    anexos?: Anexo[];
    setor?: Setor;
}

export interface Anexo {
    id: number;
    cham_id: number;
    nome: string;
    url: string;
}

export const PRIORIDADES = [
    { value: 0, label: 'Sem prioridade', variant: 'secondary' },
    { value: 1, label: 'Baixa',          variant: 'info'      },
    { value: 2, label: 'Média',          variant: 'warning'   },
    { value: 3, label: 'Alta',           variant: 'danger'    },
];

export const chamadoService = {
    abrir: (formData: FormData) =>
        api.post<{ success: boolean; data: Chamado }>('api/chamados', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    listar: (params?: { seto_id?: number; coka_id?: number }) =>
        api.get<{ success: boolean; data: Chamado[] }>('api/chamados', { params }),

    buscarPorId: (id: number) =>
        api.get<{ success: boolean; data: Chamado }>(`api/chamados/${id}`),

    atualizar: (id: number, dados: Partial<Pick<Chamado, 'titulo' | 'descricao' | 'seto_id' | 'prioridade' | 'func_email' | 'coka_id'>>) =>
        api.put<{ success: boolean; data: Chamado }>(`api/chamados/${id}`, dados),
};
