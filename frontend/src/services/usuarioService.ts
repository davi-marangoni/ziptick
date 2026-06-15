import axios from 'axios';
// Em produção (Docker) VITE_API_URL não é definido → '' → URLs relativas → Nginx proxia
// Em dev VITE_API_URL=http://localhost:3003 via proxy do Vite dev server
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
    baseURL: API_BASE_URL
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const usuarioService = {
    login: (email: string, senha: string) =>
        api.post('api/usuarios/login', { email, senha }),

    getUsuarios: () =>
        api.get('api/usuarios'),

    getUsuarioByEmail: (email: string) =>
        api.get(`api/usuarios/${email}`),

    createUsuario: (email: string, senha: string, tipo: number, nome?: string, seto_id?: number, cargo?: string) =>
        api.post('api/usuarios/register', { email, senha, tipo, nome, seto_id, cargo }),

    cadastrarPublico: (email: string, senha: string, nome: string, aceitou_termos: boolean) =>
        api.post('api/usuarios/register-publico', { email, senha, nome, aceitou_termos }),

    esqueciSenha: (email: string) =>
        api.post('api/auth/esqueci-senha', { email }),

    redefinirSenha: (token: string, novaSenha: string) =>
        api.post('api/auth/redefinir-senha', { token, novaSenha }),

    updateSenha: (email: string, novaSenha: string) =>
        api.put(`api/usuarios/${email}/senha`, { novaSenha }),

    deleteUsuario: (email: string) =>
        api.delete(`api/usuarios/${email}`),

    atualizarPerfil: (email: string, dados: { telegram_id?: string; whatsapp?: string }) =>
        api.patch(`api/usuarios/${email}/perfil`, dados),
};

export default api;
