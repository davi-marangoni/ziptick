import api from './usuarioService';

export interface Notificacao {
    id: number;
    usua_email: string;
    cham_id?: number;
    mensagem: string;
    tipo: string;
    lida: boolean;
    criado_em?: string;
}

export const notificacaoService = {
    listar: () =>
        api.get<{ success: boolean; data: Notificacao[] }>('api/notificacoes'),

    marcarLida: (id: number) =>
        api.put(`api/notificacoes/${id}/lida`),

    marcarTodasLidas: () =>
        api.put('api/notificacoes/todas-lidas'),
};
