import api from './usuarioService';

export interface CampoCustomizado {
    id: number;
    label: string;
    tipo: 'texto' | 'numero' | 'data' | 'select' | 'checkbox';
    obrigatorio: boolean;
    seto_id?: number;
    ordem: number;
    opcoes?: string; // JSON string
}

export const campoService = {
    listar: (seto_id: number) =>
        api.get<{ success: boolean; data: CampoCustomizado[] }>('api/campos', { params: { seto_id } }),

    criar: (dados: Omit<CampoCustomizado, 'id' | 'opcoes'> & { opcoes?: string[] }) =>
        api.post<{ success: boolean; data: CampoCustomizado }>('api/campos', dados),

    atualizar: (id: number, dados: Partial<CampoCustomizado>) =>
        api.put<{ success: boolean; data: CampoCustomizado }>(`api/campos/${id}`, dados),

    deletar: (id: number) =>
        api.delete(`api/campos/${id}`),
};
