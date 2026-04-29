import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

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
        api.post('/usuarios/login', { email, senha }),

    getUsuarios: () =>
        api.get('/usuarios'),

    getUsuarioByEmail: (email: string) =>
        api.get(`/usuarios/${email}`),

    createUsuario: (email: string, senha: string, tipo: number) =>
        api.post('/usuarios/register', { email, senha, tipo }),

    updateSenha: (email: string, novaSenha: string) =>
        api.put(`/usuarios/${email}/senha`, { novaSenha }),

    deleteUsuario: (email: string) =>
        api.delete(`/usuarios/${email}`)
};

export default api;
