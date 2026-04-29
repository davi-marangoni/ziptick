// Tipos de usuário
export enum TipoUsuario {
    ADMINISTRADOR = 1,
    USUARIO_COMUM = 2
}

// Interface de usuário
export interface IUsuario {
    email: string;
    tipo: TipoUsuario;
}

// Interface de resposta de login
export interface ILoginResponse {
    usuario: IUsuario;
    token: string;
}

// Interface de resposta genérica da API
export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}
