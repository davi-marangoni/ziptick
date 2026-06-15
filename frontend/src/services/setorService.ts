import api from './usuarioService';

export interface Setor {
    id: number;
    nome: string;
    cor?: string;
    criado_em?: string;
}

export const setorService = {
    listar: () =>
        api.get<{ success: boolean; data: Setor[] }>('api/setores'),

    criar: (nome: string, cor: string) =>
        api.post<{ success: boolean; data: Setor }>('api/setores', { nome, cor }),

    atualizar: (id: number, nome: string, cor: string) =>
        api.put<{ success: boolean; data: Setor }>(`api/setores/${id}`, { nome, cor }),

    deletar: (id: number) =>
        api.delete(`api/setores/${id}`),
};
